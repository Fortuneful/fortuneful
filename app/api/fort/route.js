import { auth } from "@clerk/nextjs/server";
import { after } from "next/server";
import { neon } from "@neondatabase/serverless";
import Anthropic from "@anthropic-ai/sdk";

const MODEL = "claude-sonnet-4-6";
const MAX_TOOL_ITERATIONS = 4;

const FILE_REQUEST_TOOL = {
  name: "file_request",
  description:
    "File a request with the human team for anything that requires actual execution — website changes, publishing social posts, media buying, design assets, or hiring. Use this once you've gathered enough detail conversationally. Do not use this for questions, brainstorming, or copy you can just answer directly in chat.",
  input_schema: {
    type: "object",
    properties: {
      title: { type: "string", description: "Short summary of the request, e.g. 'Redesign homepage hero section'" },
      type: { type: "string", enum: ["Website", "Social", "Media", "Design", "Hiring", "Other"] },
    },
    required: ["title", "type"],
  },
};

async function getBusiness(sql, userId) {
  const rows = await sql`
    SELECT id, name, owner_name, business_type, services
    FROM businesses WHERE clerk_user_id = ${userId}
  `;
  return rows[0] || null;
}

function buildSystemPrompt(biz, recentRequests) {
  const owner = (biz.owner_name || "").split(" ")[0] || biz.owner_name || "the owner";
  const servicesLine = biz.services ? `They've expressed interest in: ${biz.services}.` : "";
  const requestsLine = recentRequests.length
    ? `Recent requests from this business: ${recentRequests.map((r) => `"${r.title}" (${r.type}, ${r.status})`).join("; ")}.`
    : "No requests filed yet.";

  return `Fort is an executive assistant and growth strategist for a ${biz.business_type || "Restaurant"} business called ${biz.name}, owned by ${owner}. ${servicesLine} ${requestsLine}

Fort brainstorms marketing ideas, drafts captions/copy live in chat, and answers strategy questions directly — do that work inline, don't just describe it.

For anything requiring EXECUTION — website changes, publishing posts, media buying, design assets, hiring — Fort must never claim it will do the work itself. Instead, ask the conversational questions needed to scope the request well, then call the file_request tool to hand it to the human team. Keep the scoping brief — one or two clarifying questions at most, not an interrogation.`;
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return Response.json({ error: "Not signed in" }, { status: 401 });

    const sql = neon(process.env.DATABASE_URL);
    const biz = await getBusiness(sql, userId);
    if (!biz) return Response.json([]);

    const rows = await sql`
      SELECT role, content, created_at
      FROM fort_messages
      WHERE business_id = ${String(biz.id)}
      ORDER BY created_at ASC
      LIMIT 50
    `;
    return Response.json(rows);
  } catch (err) {
    console.error("GET /api/fort failed:", err);
    return Response.json({ error: "Could not load conversation" }, { status: 500 });
  }
}

export async function POST(req) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Not signed in" }, { status: 401 });

  const body = await req.json();
  const userMessage = (body.message || "").trim().slice(0, 4000);
  if (!userMessage) return Response.json({ error: "Missing message" }, { status: 400 });

  const sql = neon(process.env.DATABASE_URL);
  const biz = await getBusiness(sql, userId);
  if (!biz) return Response.json({ error: "Finish onboarding first" }, { status: 400 });

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (obj) => controller.enqueue(encoder.encode(JSON.stringify(obj) + "\n"));

      try {
        const historyRows = await sql`
          SELECT role, content FROM fort_messages
          WHERE business_id = ${String(biz.id)}
          ORDER BY created_at DESC
          LIMIT 30
        `;
        const history = historyRows.reverse();

        const recentRequests = await sql`
          SELECT title, type, status FROM requests
          WHERE business = ${String(biz.id)}
          ORDER BY created_at DESC
          LIMIT 10
        `;

        const system = buildSystemPrompt(biz, recentRequests);
        const messages = [
          ...history.map((m) => ({ role: m.role, content: m.content })),
          { role: "user", content: userMessage },
        ];

        const client = new Anthropic();
        const filedRequests = [];
        let fullReply = "";
        let iterations = 0;

        while (true) {
          const anthropicStream = client.messages.stream(
            { model: MODEL, max_tokens: 2048, system, messages, tools: [FILE_REQUEST_TOOL] },
            { signal: req.signal }
          );

          anthropicStream.on("text", (delta) => {
            fullReply += delta;
            send({ type: "text_delta", text: delta });
          });

          const finalMessage = await anthropicStream.finalMessage();

          if (finalMessage.stop_reason !== "tool_use" || iterations >= MAX_TOOL_ITERATIONS) break;
          iterations++;

          const toolUseBlocks = finalMessage.content.filter((b) => b.type === "tool_use");
          messages.push({ role: "assistant", content: finalMessage.content });

          const toolResults = [];
          for (const block of toolUseBlocks) {
            if (block.name === "file_request") {
              const { title, type } = block.input;
              send({ type: "tool_step", tool: "file_request", status: "start", input: block.input });

              const [row] = await sql`
                INSERT INTO requests (business, title, type, status)
                VALUES (${String(biz.id)}, ${title}, ${type}, ${"Requested"})
                RETURNING id, title, type, status, created_at
              `;
              filedRequests.push(row);

              if (process.env.SLACK_WEBHOOK_URL) {
                const webhookUrl = process.env.SLACK_WEBHOOK_URL;
                const text = `New ${type} request from ${biz.name} (via Fort): ${title}`;
                after(() =>
                  fetch(webhookUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ text }),
                  }).catch((err) => console.error("Slack webhook failed:", err))
                );
              }

              send({ type: "tool_step", tool: "file_request", status: "done", input: block.input, result: row });

              toolResults.push({
                type: "tool_result",
                tool_use_id: block.id,
                content: `Filed request #${row.id}: "${title}" (${type}).`,
              });
            }
          }
          messages.push({ role: "user", content: toolResults });
        }

        const reply = fullReply.trim() || "Got it.";

        await sql`
          INSERT INTO fort_messages (business_id, role, content) VALUES (${String(biz.id)}, ${"user"}, ${userMessage})
        `;
        await sql`
          INSERT INTO fort_messages (business_id, role, content) VALUES (${String(biz.id)}, ${"assistant"}, ${reply})
        `;

        send({ type: "done", reply, filedRequests });
        controller.close();
      } catch (err) {
        if (err?.name !== "AbortError") {
          console.error("POST /api/fort stream failed:", err);
          try { send({ type: "error", message: "Fort couldn't respond" }); } catch {}
        }
        controller.close();
      }
    },
  });

  return new Response(stream, { headers: { "Content-Type": "application/x-ndjson" } });
}
