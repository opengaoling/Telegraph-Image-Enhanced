export async function onRequest(context) {
    const { env, params } = context;
    const value = await env.img_url.getWithMetadata(params.id);
    if (!value.metadata) return new Response(`Image metadata not found for ID: ${params.id}`, { status: 404 });

    value.metadata.ListType = "Block";
    value.metadata.UpdatedAt = Date.now();
    await env.img_url.put(params.id, "", { metadata: value.metadata });
    return new Response(JSON.stringify(value.metadata), { headers: { 'Content-Type': 'application/json' } });
}
