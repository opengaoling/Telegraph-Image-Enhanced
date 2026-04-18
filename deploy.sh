#!/bin/bash

# 一键部署脚本：Telegraph-Image-Enhanced
# 用法: ./deploy.sh <CF_API_TOKEN> <ACCOUNT_ID> <TG_BOT_TOKEN> <TG_CHAT_ID>

CF_TOKEN=$1
ACCOUNT_ID=$2
TG_TOKEN=$3
TG_CHAT_ID=$4

PROJECT_NAME="telegraph-image-enhanced"
KV_NAME="img_url"

if [ -z "$TG_CHAT_ID" ]; then
    echo "用法: ./deploy.sh <CF_API_TOKEN> <ACCOUNT_ID> <TG_BOT_TOKEN> <TG_CHAT_ID>"
    exit 1
fi

echo "🚀 开始一键部署流程..."

# 1. 安装依赖
npm install -g wrangler

# 2. 创建 KV Namespace
echo "📦 创建 KV Namespace..."
export CLOUDFLARE_API_TOKEN=$CF_TOKEN
KV_OUTPUT=$(npx wrangler kv namespace create "$KV_NAME")
KV_ID=$(echo "$KV_OUTPUT" | grep "id =" | cut -d'"' -f2)

if [ -z "$KV_ID" ]; then
    echo "❌ KV 创建失败，请检查 Token 权限。"
    exit 1
fi
echo "✅ KV ID: $KV_ID"

# 3. 创建 Pages 项目
echo "🏗️ 创建 Pages 项目..."
npx wrangler pages project create "$PROJECT_NAME" --production-branch main

# 4. 配置环境变量和 KV 绑定
echo "⚙️ 注入配置信息..."
# 使用 API 直接注入，避免 wrangler 交互限制
curl -X PATCH "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/pages/projects/$PROJECT_NAME" \
     -H "Authorization: Bearer $CF_TOKEN" \
     -H "Content-Type: application/json" \
     --data '{
       "deployment_configs": {
         "production": {
           "kv_namespaces": { "img_url": { "namespace_id": "'"$KV_ID"'" } },
           "env_vars": {
             "TG_Bot_Token": { "value": "'"$TG_TOKEN"'" },
             "TG_Chat_ID": { "value": "'"$TG_CHAT_ID"'" },
             "ADMIN_USER": { "value": "admin" },
             "ADMIN_PASS": { "value": "admin123" }
           }
         }
       }
     }'

# 5. 执行部署
echo "📤 上传代码并部署..."
npx wrangler pages deploy . --project-name="$PROJECT_NAME" --commit-dirty=true

echo "🎉 部署完成！"
echo "访问地址: https://$PROJECT_NAME.pages.dev"
echo "初始后台账号: admin / admin123"
