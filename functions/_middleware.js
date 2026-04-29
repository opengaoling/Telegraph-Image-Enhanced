async function errorHandling(context) {
    try {
        return await context.next();
    } catch (err) {
        return new Response(`${err.message}\n${err.stack}`, { status: 500 });
    }
}

async function authentication(context) {
    const { request, env } = context;
    const url = new URL(request.url);

    // 1. 基本检查
    if (!env.BASIC_USER || !env.BASIC_PASS) return context.next();

    // 2. 登录接口放行
    if (request.method === 'POST' && url.pathname.includes('/api/manage/login')) {
        try {
            const { user, pass } = await request.json();
            if (user === env.BASIC_USER && pass === env.BASIC_PASS) {
                const newToken = crypto.randomUUID();
                await env.img_url.put("manage_session", newToken, { expirationTtl: 604800 });
                return new Response(JSON.stringify({ success: true }), {
                    headers: { 'Set-Cookie': `manage_session=${newToken}; Path=/; HttpOnly; Max-Age=604800; SameSite=Lax; Secure` }
                });
            }
            return new Response(JSON.stringify({}), { status: 401 });
        } catch (e) {
            return new Response('{}', { status: 400 });
        }
    }
    
    // 3. 登出接口
    if (request.method === 'POST' && url.pathname.includes('/api/manage/logout')) {
        await env.img_url.delete("manage_session");
        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Set-Cookie': `manage_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT` }
        });
    }

    // 4. 鉴权
    const cookie = request.headers.get('Cookie') || '';
    const sessionToken = (cookie.match(/manage_session=([^;]+)/) || [])[1];
    const kvToken = await env.img_url.get("manage_session");
    
    const isAuthenticated = sessionToken && kvToken && sessionToken === kvToken;

    // 5. 拦截逻辑
    const isManagePath = url.pathname.includes('/admin') || url.pathname.includes('/api/manage/');
    if (isManagePath && !isAuthenticated) {
        if (url.pathname.includes('/api/manage/')) {
            return new Response(JSON.stringify({}), { status: 401 });
        }
        
        // 返回登录页
        const loginHtml = `<!DOCTYPE html><html><head><title>Login</title><link rel="stylesheet" href="https://unpkg.com/element-ui@2.15.14/lib/theme-chalk/index.css"><style>body{background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);display:flex;justify-content:center;align-items:center;height:100vh}#app{width:350px;padding:35px;background:#fff;border-radius:8px;box-shadow:0 10px 20px rgba(0,0,0,0.1)}</style></head><body><div id="app"><h2 style="text-align:center;margin-bottom:25px">Dashboard</h2><el-form @submit.native.prevent="h"><el-form-item><el-input v-model="f.u" placeholder="User"></el-input></el-form-item><el-form-item><el-input v-model="f.p" type="password" placeholder="Pass" @keyup.enter.native="h"></el-input></el-form-item><el-button type="primary" style="width:100%" @click="h" :loading="l">Login</el-button></el-form></div><script src="https://unpkg.com/vue@2.7.14/dist/vue.min.js"></script><script src="https://unpkg.com/element-ui@2.15.14/lib/index.js"></script><script>new Vue({el:'#app',data:{f:{u:'',p:''},l:false},methods:{h(){this.l=true;fetch('/api/manage/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({user:this.f.u,pass:this.f.p})}).then(r=>r.ok?location.reload():this.$message.error('Failed')).finally(()=>this.l=false)}}})</script></body></html>`;
        return new Response(loginHtml, { headers: { 'Content-Type': 'text/html', 'Cache-Control': 'no-store' }});
    }

    return context.next();
}

export const onRequest = [errorHandling, authentication];
