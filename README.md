# Telegraph-Image-Enhanced 🚀

这是一个基于 [Telegraph-Image](https://github.com/cf-pages/Telegraph-Image) 深度改进的图像托管方案。我们保留了原项目的轻量化特质，并引入了更稳健的鉴权机制和更直观的管理流程。

## 🌟 增强功能

- **正经登录页面**: 告别原始的浏览器弹窗，提供 Ant Design 风格的现代登录界面 (`login.html`)。
- **强制鉴权与自动跳转**: 完善的中间件逻辑。未登录访问后台会自动重定向至登录页，API 接口严格校验，杜绝数据泄露。
- **一键自动化部署**: 提供交互式 `deploy.sh` 脚本，支持参数传入或向导式输入，自动获取 Account ID，小白也能轻松上线。
- **管理入口集成**: 首页底部隐蔽集成管理入口，兼顾美观与操作便利性。
- **多媒体支持**: 优化后端逻辑，支持图片、视频、音频及 ZIP 压缩包的上传，并同步备份至 Telegram。

## 🛠️ 快速开始：一键部署

我们提供了一个全自动部署脚本。你只需准备好 Cloudflare API Token、Telegram Bot Token 和 Chat ID。

### 运行部署脚本

```bash
chmod +x deploy.sh
./deploy.sh
```
*脚本会启动交互式向导，引导你完成所有配置。*

## 🔐 后台管理

- **管理地址**: `/admin` (会自动重定向至 `/login.html`)
- **默认账号**: `admin`
- **默认密码**: `admin123`
*(请在部署后通过 Cloudflare Pages 控制台的环境变量立即修改 `ADMIN_USER` 和 `ADMIN_PASS`)*

## 🙏 致谢

核心逻辑源自 [cf-pages/Telegraph-Image](https://github.com/cf-pages/Telegraph-Image)。感谢原作者为社区提供的优秀基础，让图像分发变得如此简单。

---
由 **opengaoling** 维护增强。
