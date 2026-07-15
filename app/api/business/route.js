import { auth } from "@clerk/nextjs/server";
import { after } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return Response.json({ error: "Not signed in" }, { status: 401 });

    const sql = neon(process.env.DATABASE_URL);
    const rows = await sql`SELECT id, name, owner_name, phone, address, services, business_type FROM businesses WHERE clerk_user_id = ${userId}`;
    if (rows.length === 0) return Response.json({ error: "No business yet" }, { status: 404 });
    return Response.json(rows[0]);
  } catch (err) {
    console.error("GET /api/business failed:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) return Response.json({ error: "Not signed in" }, { status: 401 });

    const b = await req.json();
    const name = (b.name || "").trim().slice(0, 120);
    const owner = (b.owner || "").trim().slice(0, 120);
    const phone = (b.phone || "").trim().slice(0, 40);
    const address = (b.address || "").trim().slice(0, 240);
    const services = Array.isArray(b.services) ? b.services.join(", ").slice(0, 300) : "";
    const businessType = (b.business_type || "Restaurant").trim().slice(0, 60);

    if (!name) return Response.json({ error: "Missing name" }, { status: 400 });

    const sql = neon(process.env.DATABASE_URL);
    const [row] = await sql`
      INSERT INTO businesses (clerk_user_id, name, owner_name, phone, address, services, business_type)
      VALUES (${userId}, ${name}, ${owner}, ${phone}, ${address}, ${services}, ${businessType})
      ON CONFLICT (clerk_user_id)
      DO UPDATE SET name = ${name}, owner_name = ${owner}, phone = ${phone}, address = ${address}, services = ${services}, business_type = ${businessType}
      RETURNING id, name, owner_name, business_type
    `;

    if (process.env.SLACK_WEBHOOK_URL) {
      const webhookUrl = process.env.SLACK_WEBHOOK_URL;
      const text = "New signup: " + name + " (" + owner + ", " + phone + ") wants: " + (services || "unspecified");
      after(() =>
        fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        }).catch((err) => console.error("Slack webhook failed:", err))
      );
    }

    return Response.json(row, { status: 201 });
  } catch (err) {
    console.error("POST /api/business failed:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
