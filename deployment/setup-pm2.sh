#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"
need(){ command -v "$1" >/dev/null 2>&1 || { echo "Missing: $1"; exit 1; }; }
need node; need npm
[ -f server/.env ] || cat > server/.env <<'EOF'
PORT=4000
MONGO_URI=mongodb://localhost:27017/contractmanager
JWT_SECRET=replace_with_long_random_string
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=app_password
SMTP_FROM="ContractManager <no-reply@yourdomain.com>"
BASE_URL=http://localhost:4000
UPLOAD_DIR=uploads
REMINDER_DAYS_BEFORE=7
CORS_ORIGIN=http://localhost:5173
EOF
pushd client >/dev/null
npm ci || npm install
npm run build
popd >/dev/null
rm -rf server/public; mkdir -p server/public
cp -r client/dist/* server/public/ || true
pushd server >/dev/null
npm ci || npm install
if ! command -v pm2 >/dev/null 2>&1; then npm i -g pm2; fi
pm2 start ecosystem.config.js || pm2 restart ecosystem.config.js || node src/index.js
pm2 save; pm2 startup -u "$USER" --hp "$HOME" || true
popd >/dev/null
echo 'OK'