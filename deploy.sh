#!/bin/bash
COMMIT_MSG=$1
if [ -z "$COMMIT_MSG" ]; then COMMIT_MSG="Update from upstream"; fi
cd "$(dirname "$0")"
if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
    if [ -f ~/.cloudflare_token ]; then export CLOUDFLARE_API_TOKEN=$(cat ~/.cloudflare_token); else echo "Error: No Token"; exit 1; fi
fi
git add . && git commit -m "$COMMIT_MSG" && git push origin main --force
npx wrangler pages deploy . --project-name telegraph-image --commit-dirty=true
