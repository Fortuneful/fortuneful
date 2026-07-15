import { auth } from "@clerk/nextjs/server";

const COMPOSIO_BASE = "https://backend.composio.dev/api/v3.1";
const PAGE_SIZE = 60;

export async function GET(req) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Not signed in" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const search = (searchParams.get("search") || "").trim().slice(0, 100);
  const cursor = searchParams.get("cursor") || "";

  const params = new URLSearchParams({ limit: String(PAGE_SIZE) });
  if (search) params.set("search", search);
  if (cursor) params.set("cursor", cursor);

  try {
    const res = await fetch(`${COMPOSIO_BASE}/toolkits?${params.toString()}`, {
      headers: { "x-api-key": process.env.COMPOSIO_API_KEY },
    });
    if (!res.ok) return Response.json({ error: "Could not load integrations" }, { status: 502 });

    const data = await res.json();
    const items = (data.items || []).map((tk) => ({
      slug: tk.slug,
      name: tk.name,
      description: tk.meta?.description || "",
      logo: tk.meta?.logo || "",
      category: tk.meta?.categories?.[0]?.name || "",
      toolsCount: tk.meta?.tools_count || 0,
    }));

    return Response.json({
      items,
      nextCursor: items.length > 0 ? data.next_cursor || null : null,
      totalItems: data.total_items || 0,
    });
  } catch (err) {
    console.error("GET /api/integrations failed:", err);
    return Response.json({ error: "Could not load integrations" }, { status: 500 });
  }
}
