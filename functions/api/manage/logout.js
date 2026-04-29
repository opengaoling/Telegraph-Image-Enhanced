export async function onRequest(context) {
    // 强制清除 KV 中的 session，并下发一个过期的 cookie
    await context.env.img_url.delete("manage_session");

    return new Response(JSON.stringify({ success: true }), {
        headers: {
            'Set-Cookie': `manage_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax; Secure`,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store'
        }
    });
}
