import { auth } from "@clerk/nextjs/server";
import { after } from "next/server";
import { neon } from "@neondatabase/serverless";

async function getBusiness(sql, userId) {
  const rows = await sql`SELECT id, name FROM businesses WHERE clerk_user_id = ${userId}`;
  return rows[0] || null;
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return Response.json({ error: "Not signed in" }, { status: 401 });

    const sql = neon(process.env.DATABASE_URL);
    const biz = await getBusiness(sql, userId);
    if (!biz) return Response.json([]);

    const rows = await sql`
      SELECT id, business, title, type, status, created_at
      FROM requests
      WHERE business = ${String(biz.id)}
      ORDER BY created_at DESC
      LIMIT 100
    `;
    return Response.json(rows);
  } catch (err) {
    console.error("GET /api/requests failed:", err);
    return Response.json({ error: "Could not load requests" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) return Response.json({ error: "Not signed in" }, { status: 401 });

    const body = await req.json();
    const title = (body.title || "").trim().slice(0, 200);
    const type = (body.type || "").trim().slice(0, 40);
    if (!title || !type) return Response.json({ error: "Missing title or type" }, { status: 400 });

    const sql = neon(process.env.DATABASE_URL);
    const biz = await getBusiness(sql, userId);
    if (!biz) return Response.json({ error: "Finish onboarding first" }, { status: 400 });

    const [row] = await sql`
      INSERT INTO requests (business, title, type, status)
      VALUES (${String(biz.id)}, ${title}, ${type}, ${"Requested"})
      RETURNING id, business, title, type, status, created_at
    `;

    const message = "New " + type + " request from " + biz.name + ": " + title;

    if (process.env.SLACK_WEBHOOK_URL) {
      const webhookUrl = process.env.SLACK_WEBHOOK_URL;
      after(() =>
        fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: message }),
        }).catch((err) => console.error("Slack webhook failed:", err))
      );
    }

    return Response.json(row, { status: 201 });
  } catch (err) {
    console.error("POST /api/requests failed:", err);
    return Response.json({ error: "Could not save request" }, { status: 500 });
  }
}
