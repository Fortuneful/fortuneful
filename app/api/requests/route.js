import { neon } from "@neondatabase/serverless";

function getDatabase() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing");
  }

  return neon(process.env.DATABASE_URL);
}

export async function GET() {
  try {
    const sql = getDatabase();

    const rows = await sql`
      SELECT id, business, title, type, status, created_at
      FROM requests
      ORDER BY created_at DESC
      LIMIT 100
    `;

    return Response.json(rows);
  } catch (err) {
    console.error("GET /api/requests failed:", err);

    return Response.json(
      { error: "Could not load requests" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    const title = String(body.title || "").trim().slice(0, 200);
    const type = String(body.type || "").trim().slice(0, 40);
    const business = String(body.business || "chung-fa")
      .trim()
      .slice(0, 60);

    if (!title || !type) {
      return Response.json(
        { error: "Missing title or type" },
        { status: 400 }
      );
    }

    const sql = getDatabase();

    const [row] = await sql`
      INSERT INTO requests (business, title, type, status)
      VALUES (${business}, ${title}, ${type}, ${"Requested"})
      RETURNING id, business, title, type, status, created_at
    `;

    const message = `New ${type} request from ${business}: "${title}"`;

    const notifications = [];

    if (process.env.SLACK_WEBHOOK_URL) {
      notifications.push(
        fetch(process.env.SLACK_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: message }),
        })
      );
    }

    if (process.env.RESEND_API_KEY && process.env.NOTIFY_EMAIL) {
      notifications.push(
        fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "Fortuneful <onboarding@resend.dev>",
            to: [process.env.NOTIFY_EMAIL],
            subject: `New Fortuneful request: ${type}`,
            text: `${message}\n\nOpen your dashboard to view it.`,
          }),
        })
      );
    }

    await Promise.allSettled(notifications);

    return Response.json(row, { status: 201 });
  } catch (err) {
    console.error("POST /api/requests failed:", err);

    return Response.json(
      { error: "Could not save request" },
      { status: 500 }
    );
  }
}