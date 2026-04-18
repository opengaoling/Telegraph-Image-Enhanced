#!/bin/bash

# 一键部署脚本：Telegraph-Image-Enhanced
# 支持参数传入或交互式输入

CF_TOKEN=$1
ACCOUNT_ID=$2
TG_TOKEN=$3
TG_CHAT_ID=$4

PROJECT_NAME="telegraph-image-enhanced"
KV_NAME="img_url"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 欢迎使用 Telegraph-Image-Enhanced 一键部署工具${NC}"

# 交互式获取变量
if [ -z "$CF_TOKEN" ]; then
    read -p "请输入 Cloudflare API Token: " CF_TOKEN
fi

if [ -z "$ACCOUNT_ID" ]; then
    # 尝试自动获取 Account ID
    echo -e "${BLUE}正在尝试通过 Token 自动获取 Account ID...${NC}"
    ACCOUNT_ID=$(curl -s -X GET "https://api.cloudflare.com/client/v4/accounts" \
         -H "Authorization: Bearer $CF_TOKEN" \
         -H "Content-Type: application/json" | grep -oP '(?<="id":")[^"]*' | head -n 1)
    
    if [ -z "$ACCOUNT_ID" ]; then
        echo -e "${RED}无法自动获取 Account ID，请手动输入。${NC}"
        read -p "请输入 Cloudflare Account ID: " ACCOUNT_ID
    else
        echo -e "${GREEN}自动获取到 Account ID: $ACCOUNT_ID${NC}"
    fi
fi

if [ -z "$TG_TOKEN" ]; then
    read -p "请输入 Telegram Bot Token: " TG_TOKEN
fi

if [ -z "$TG_CHAT_ID" ]; then
    read -p "请输入 Telegram Chat ID: " TG_CHAT_ID
fi

if [ -z "$CF_TOKEN" ] || [ -z "$ACCOUNT_ID" ] || [ -z "$TG_TOKEN" ] || [ -z "$TG_CHAT_ID" ]; then
    echo -e "${RED}❌ 错误: 所有变量都必须提供才能继续。${NC}"
    exit 1
fi

export CLOUDFLARE_API_TOKEN=$CF_TOKEN

# 1. 安装依赖
if ! command -v wrangler &> /dev/null; then
    echo -e "${BLUE}📦 正在安装 wrangler...${NC}"
    npm install -g wrangler
fi

# 2. 创建 KV Namespace
echo -e "${BLUE}📦 创建 KV Namespace...${NC}"
KV_OUTPUT=$(npx wrangler kv namespace create "$KV_NAME" 2>/dev/null)
KV_ID=$(echo "$KV_OUTPUT" | grep "id =" | cut -d'"' -f2)

if [ -z "$KV_ID" ]; then
    # 尝试列出已有的
    KV_ID=$(npx wrangler kv namespace list 2>/dev/null | grep -v "\[" | grep -v "\]" | jq -r ".[] | select(.title | contains(\"$KV_NAME\")) | .id" 2>/dev/null | head -n 1)
fi

if [ -z "$KV_ID" ]; then
    echo -e "${RED}❌ KV 创建失败，请检查 Token 权限。${NC}"
    exit 1
fi
echo -e "${GREEN}✅ KV ID: $KV_ID${NC}"

# 3. 创建 Pages 项目
echo -e "${BLUE}🏗️ 创建 Pages 项目: $PROJECT_NAME...${NC}"
npx wrangler pages project create "$PROJECT_NAME" --production-branch main &>/dev/null

# 4. 配置环境变量和 KV 绑定
echo -e "${BLUE}⚙️ 正在通过 API 注入配置信息...${NC}"
curl -s -X PATCH "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/pages/projects/$PROJECT_NAME" \
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
     }' > /dev/null

# 5. 执行部署
echo -e "${BLUE}📤 正在上传代码并部署...${NC}"
npx wrangler pages deploy . --project-name="$PROJECT_NAME" --commit-dirty=true

echo -e "${GREEN}🎉 部署完成！${NC}"
echo -e "访问地址: ${BLUE}https://$PROJECT_NAME.pages.dev${NC}"
echo -e "初始后台账号: ${BLUE}admin / admin123${NC}"
echo -e "提示: 建议部署后立即在网页端修改账号密码。"
