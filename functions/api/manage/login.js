export async function onRequestPost(context) {
    const { request, env } = context;
    const { username, password } = await request.json();

    if (username === env.ADMIN_USER && password === env.ADMIN_PASS) {
        const session = crypto.randomUUID();
        if (env.img_url) {
            await env.img_url.put("manage_session", session, { expirationTtl: 604800 });
        }
        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: {
                'Set-Cookie': `manage_session=${session}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`,
                'Content-Type': 'application/json'
            }
        });
    }

    return new Response(JSON.stringify({ success: false, message: "账号或密码错误" }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
    });
}
