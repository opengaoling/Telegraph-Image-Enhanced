export async function onRequest(context) {
    const { request, env, next } = context;
    const url = new URL(request.url);

    // 排除登录相关的路径
    if (url.pathname === '/api/manage/login' || url.pathname === '/login.html') {
        return await next();
    }

    const cookieString = request.headers.get('Cookie') || '';
    const cookies = Object.fromEntries(cookieString.split('; ').map(c => c.split('=')));
    const session = cookies['manage_session'];

    // 如果未登录，根据请求类型进行处理
    if (!session) {
        // 如果是 API 请求，返回 401 告诉前端需要登录
        if (url.pathname.startsWith('/api/')) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        // 如果是页面请求，重定向到登录页
        return Response.redirect(`${url.origin}/login.html`, 302);
    }

    // 校验 Session
    if (env.img_url) {
        const storedSession = await env.img_url.get("manage_session");
        if (session !== storedSession) {
            if (url.pathname.startsWith('/api/')) {
                return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
            }
            return Response.redirect(`${url.origin}/login.html`, 302);
        }
    }

    return await next();
}
