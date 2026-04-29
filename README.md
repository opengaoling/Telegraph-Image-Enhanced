# Telegraph-Image-Enhanced 🖼️

A free image hosting solution built on Cloudflare Pages and the Telegram Bot API. This is a deeply enhanced fork of Telegraph-Image, featuring a modernized admin dashboard and a seamless authentication experience.

English | [中文](./README-zh.md)

## ✨ Core Enhancements

- **Modernized Admin Dashboard**: The ugly native browser Basic Auth popup has been completely removed. We now feature a beautiful, built-in login page constructed with Vue + Element-UI! Say goodbye to double-login conflicts.
- **Dual Views & Large Image Preview**: The dashboard seamlessly supports switching between list and grid views, with perfectly fixed component imports allowing direct click-to-enlarge image previews.
- **Stable Storage**: The original Telegraph API is deprecated. This project fully migrates to Telegram Channels as the storage backend—unlimited capacity, stable, and reliable.
- **100% Free Forever**: Fully relying on Cloudflare's powerful edge network and Telegram's servers. You can deploy this with zero cost—no server or domain purchase required.
- **Full-Featured Image Management**: Supports black/whitelists, adult content moderation (via ModerateContent API), online deletion, and one-click link copying.

---

## 🚀 Deployment Guide

### 1. Prepare Your Telegram Bot and Channel
1. Message [@BotFather](https://t.me/BotFather) on Telegram and send `/newbot` to create a bot. Obtain and save your `TG_Bot_Token`.
2. Create a new Telegram Channel. Go to the channel settings and add the bot you just created as an **Administrator** (with message sending permissions).
3. Forward any message from that channel to [@GetTheirIDBot](https://t.me/GetTheirIDBot) to get your channel's `TG_Chat_ID` (it usually starts with a minus sign, e.g., `-100123456789`).

### 2. Deploy to Cloudflare Pages
1. Click the "Fork" button in the top right to copy this repository to your GitHub account.
2. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/), navigate to `Workers & Pages` -> `Pages` -> `Connect to Git`.
3. Authorize GitHub, select your forked repository, and click Deploy.

### 3. Configure Environment Variables and KV Namespace
To make the image host and the beautiful admin dashboard work properly, go to your Cloudflare Pages project's `Settings` -> `Environment variables` -> `Production` and add the following variables:

| Variable Name | Required | Example | Description |
| --- | --- | --- | --- |
| `TG_Bot_Token` | **Yes** | `123456:AA...` | Your Telegram Bot Token |
| `TG_Chat_ID` | **Yes** | `-100123...` | Your Telegram Channel ID |
| `ADMIN_USER` | Optional | `admin` | Admin dashboard username (enables dashboard password protection) |
| `ADMIN_PASS` | Optional | `password` | Admin dashboard password |
| `ModerateContentApiKey`| Optional | `...` | Image moderation API Key, get it free at [moderatecontent.com](https://moderatecontent.com/) |

**Bind KV Namespace (Required to enable the Admin Dashboard)**:
1. Go to Cloudflare `Storage` -> `KV` and create a namespace (e.g., `tg-image-kv`).
2. Go back to your Pages project, click `Settings` -> `Functions` -> `KV namespace bindings`.
3. Add a binding:
   - Variable name: Enter `img_url` (must be exactly this)
   - KV namespace: Select the space you just created.

> 💡 **Important Note**: Whenever you modify environment variables or KV bindings in Cloudflare, you must go to the `Deployments` page and trigger a **New Deployment** (or Retry deployment) for the changes to take effect!

## 👨‍💻 Access the Admin Dashboard
Once everything is configured and redeployed, simply visit `https://your-domain.pages.dev/admin` in your browser. You will be greeted by the brand-new login screen. Enter your `ADMIN_USER` and `ADMIN_PASS` to access your image hosting console.

---

## 📜 Acknowledgements & Disclaimer

**🌟 Acknowledgements**
- Special thanks to the upstream project [cf-pages/Telegraph-Image](https://github.com/cf-pages/Telegraph-Image) and the original concept contributors (Hostloc @feixiang and @乌拉擦). This project is a deeply refactored and UI-enhanced fork based on their excellent foundation.
- Thanks to [Cloudflare](https://www.cloudflare.com/) for providing fantastic Pages hosting and an unparalleled global edge network.
- Thanks to [Telegram](https://telegram.org/) for offering the incredibly generous Bot API and limitless Channel storage space.

**⚖️ Disclaimer**
- This project is provided for educational and research purposes only. It is **strictly prohibited** to use this project for hosting or distributing illegal, copyrighted, or adult content that violates local laws and regulations.
- The deployer assumes full responsibility for moderating and managing all user-uploaded content (enabling the Image Moderation API is highly recommended).
- The developers assume absolutely no liability for any data loss, abuse, platform account bans (e.g., Telegram channel suspensions or Cloudflare account restrictions), or legal disputes arising from the use of this project. By deploying this project, you agree to these terms.

**📝 License**
This project continues the open-source spirit of its upstream and is released under the **MIT License**.
