export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  const raw = url.searchParams.get("limit");
  let limit = parseInt(raw || "100", 10);
  if (!Number.isFinite(limit) || limit <= 0) limit = 100;
  if (limit > 1000) limit = 1000;

  const cursor = url.searchParams.get("cursor") || undefined;
  const prefix = url.searchParams.get("prefix") || undefined;
  const value = await env.img_url.list({ limit, cursor, prefix });

  const keys = (value.keys || []).map((item) => {
    const metadata = item.metadata || {};
    const createdAt = metadata.CreatedAt || metadata.TimeStamp || null;
    const updatedAt = metadata.UpdatedAt || metadata.CreatedAt || metadata.TimeStamp || null;
    return {
      ...item,
      createdAt,
      updatedAt,
    };
  });

  return new Response(JSON.stringify({
    ...value,
    keys,
  }), {
    headers: { "Content-Type": "application/json" }
  });
}
