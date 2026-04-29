export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  const limit = parseInt(url.searchParams.get("limit") || "100");
  const cursor = url.searchParams.get("cursor") || undefined;
  
  const value = await env.img_url.list({ limit, cursor });
  
  // 在后端强制排序
  value.keys = (value.keys || [])
    .filter(key => !key.name.startsWith('manage_session'))
    .sort((a, b) => {
        const timeA = (a.metadata && a.metadata.TimeStamp) ? a.metadata.TimeStamp : 0;
        const timeB = (b.metadata && b.metadata.TimeStamp) ? b.metadata.TimeStamp : 0;
        return timeB - timeA;
    });

  return new Response(JSON.stringify(value), {
    headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
    }
  });
}
