# Telegraph-Image-Enhanced 🚀

这是一个基于 [Telegraph-Image](https://github.com/cf-pages/Telegraph-Image) 深度改进的图像托管方案。我们保留了原项目的轻量化特质，并引入了更稳健的鉴权机制和更直观的管理流程。

## 🌟 增强功能

- **强制 HTTP Basic Auth**: 放弃了不稳定的 Session 登录，采用浏览器原生鉴权，彻底杜绝后台泄露风险。
- **一键自动化部署**: 提供 `deploy.sh` 脚本，仅需提供 Token 即可完成从 KV 创建到代码上线的全流程。
- **管理入口集成**: 首页通过 JS 注入隐蔽的管理入口，兼顾美观与实用。
- **多媒体支持**: 后端逻辑优化，支持图片、视频、音频甚至 ZIP 压缩包的上传与 Telegram 备份。

## 🛠️ 快速开始：一键部署

我们提供了一个全自动部署脚本，你只需要准备好以下信息：

1. **Cloudflare API Token**: 需要 Pages 和 KV 的编辑权限。
2. **Cloudflare Account ID**: 在 CF 控制台右侧可以找到。
3. **Telegram Bot Token**: 从 [@BotFather](https://t.me/BotFather) 获取。
4. **Telegram Chat ID**: 从 [@userinfobot](https://t.me/userinfobot) 获取。

### 运行部署脚本

```bash
chmod +x deploy.sh
./deploy.sh <CF_API_TOKEN> <ACCOUNT_ID> <TG_BOT_TOKEN> <TG_CHAT_ID>
```

部署完成后，你将获得一个 `https://telegraph-image-enhanced.pages.dev` 的域名。

## 🔐 后台管理

- **管理地址**: `/admin`
- **默认账号**: `admin`
- **默认密码**: `admin123`
*(请在部署后通过 Cloudflare Pages 控制台的环境变量立即修改 `ADMIN_USER` 和 `ADMIN_PASS`)*

## 🙏 致谢

核心逻辑源自 [cf-pages/Telegraph-Image](https://github.com/cf-pages/Telegraph-Image)。感谢原作者为社区提供的优秀基础，让图像分发变得如此简单。

---
由 **opengaoling** 维护增强。
