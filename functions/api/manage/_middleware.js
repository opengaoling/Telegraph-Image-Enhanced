export async function onRequest(context) {
    const { request, env } = context;
    
    // 如果没有配置管理员账号密码，则不开启鉴权（防呆）
    if (!env.ADMIN_USER || !env.ADMIN_PASS) {
        return await context.next();
    }

    const authHeader = request.headers.get('Authorization');

    if (!authHeader) {
        return new Response('Unauthorized', {
            status: 401,
            headers: {
                'WWW-Authenticate': 'Basic realm="Admin Management"',
                'Content-Type': 'text/plain'
            }
        });
    }

    // 解析 Basic Auth (格式为 Basic base64(user:pass))
    const auth = authHeader.split(' ')[1];
    const decoded = atob(auth);
    const [user, pass] = decoded.split(':');

    if (user === env.ADMIN_USER && pass === env.ADMIN_PASS) {
        return await context.next();
    }

    return new Response('Forbidden', {
        status: 403,
        headers: { 'Content-Type': 'text/plain' }
    });
}
