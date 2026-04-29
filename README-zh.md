# Telegraph-Image-Enhanced 🖼️

免费的图床解决方案，基于 Cloudflare Pages 和 Telegram Bot API 构建。本项目是 Telegraph-Image 的深度增强分支，提供更现代的管理后台与极致的鉴权体验。

[English](./README.md) | 中文

## ✨ 核心增强特性

- **现代化管理后台**：彻底移除了浏览器原生且简陋的 Basic Auth 弹窗，采用基于 Vue + Element-UI 构建的漂亮内置登录页！告别双重登录冲突。
- **双视图与大图预览**：后台不仅支持列表视图与网格视图的无缝切换，更完美修复了组件引入逻辑，支持直接点击放大预览图片。
- **稳定存储**：原 Telegraph API 已失效，本项目已全面切换至 Telegram Channel 作为存储后端，无限容量，稳定可靠。
- **白嫖到底**：完全依托 Cloudflare 强大的边缘网络与 Telegram 服务器，无需购买任何服务器与域名即可零成本搭建。
- **全功能图片管理**：支持黑白名单机制、图片鉴黄拦截（接入 ModerateContent API）、在线删除、一键复制链接。

---

## 🚀 部署指南

### 1. 准备 Telegram 机器人与频道
1. 在 Telegram 中向 [@BotFather](https://t.me/BotFather) 发送 `/newbot` 创建机器人，获取并保存 `TG_Bot_Token`。
2. 创建一个新的 Telegram 频道（Channel），进入频道设置，将刚才创建的机器人设为**管理员**（给予发送消息权限）。
3. 向 [@GetTheirIDBot](https://t.me/GetTheirIDBot) 转发频道内的任意一条消息，获取频道的 `TG_Chat_ID`（通常带有一个负号，如 `-100123456789`）。

### 2. 部署到 Cloudflare Pages
1. 点击右上角 Fork 本仓库到你自己的 GitHub。
2. 登录 [Cloudflare 控制台](https://dash.cloudflare.com/)，进入 `Workers 和 Pages` -> `Pages` -> `连接到 Git`。
3. 授权 GitHub 并选择你 Fork 的仓库，点击部署即可。

### 3. 配置环境变量与 KV 空间
为了使图床和漂亮的后台管理系统正常工作，请在 Cloudflare Pages 项目的 `设置` -> `环境变量` -> `为生产环境定义变量` 中添加以下变量：

| 变量名 | 是否必填 | 示例值 | 说明 |
| --- | --- | --- | --- |
| `TG_Bot_Token` | **必填** | `123456:AA...` | 你的 Telegram 机器人 Token |
| `TG_Chat_ID` | **必填** | `-100123...` | 你的 Telegram 频道 ID |
| `ADMIN_USER` | 选填 | `admin` | 管理后台的登录账号（设置后即开启后台页面密码保护） |
| `ADMIN_PASS` | 选填 | `password` | 管理后台的登录密码 |
| `ModerateContentApiKey` | 选填 | `...` | 图片鉴黄 API Key，在 [moderatecontent.com](https://moderatecontent.com/) 免费申请 |

**绑定 KV 空间（必须操作以开启后台管理功能）**：
1. 前往 Cloudflare `存储` -> `KV`，创建一个命名空间（比如叫 `tg-image-kv`）。
2. 回到你的 Pages 项目，点击 `设置` -> `函数` -> `KV 命名空间绑定`。
3. 添加一个绑定：
   - 变量名称：填入 `img_url` （必须是这个名字）
   - KV 命名空间：选择你刚才创建的空间。

> 💡 **重要提示**：在 Cloudflare 中修改任何环境变量或 KV 绑定后，都需要前往 `部署` 页面，点击**创建新部署**（或重试部署）才能让新配置生效！

## 👨‍💻 访问后台
全部配置完成并重新部署后，在浏览器访问 `https://你的域名.pages.dev/admin`，即可看到全新的管理页面登录框。输入你设置的 `ADMIN_USER` 和 `ADMIN_PASS` 即可进入图床控制台。
