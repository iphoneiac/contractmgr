#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"
need(){ command -v "$1" >/dev/null 2>&1 || { echo "Missing: $1"; exit 1; }; }
need docker; need docker compose
[ -f .env ] || cat > .env <<'EOF'
JWT_SECRET=@Alnuaimi80
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=ssralnuaimiapps@gmail.com
SMTP_PASS=sllsjpelshqhiley
SMTP_FROM="ContractManager <no-reply@yourdomain.com>"
BASE_URL=https://your.domain
CORS_ORIGIN=https://your.domain
REMINDER_DAYS_BEFORE=7
EOF
docker compose up -d --build
docker compose ps
echo 'OK'
