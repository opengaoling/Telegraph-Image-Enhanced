export async function onRequest(context) {
    const { params, env } = context;

    const value = await env.img_url.getWithMetadata(params.id);
    if (!value.metadata) return new Response(`Image metadata not found for ID: ${params.id}`, { status: 404 });

    value.metadata.liked = !value.metadata.liked;
    value.metadata.UpdatedAt = Date.now();
    await env.img_url.put(params.id, "", { metadata: value.metadata });

    return new Response(JSON.stringify({ success: true, liked: value.metadata.liked, updatedAt: value.metadata.UpdatedAt }), {
        headers: { 'Content-Type': 'application/json' },
    });
}
