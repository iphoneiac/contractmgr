# ContractManager

A full-stack app for managing post-procurement contracts: dashboards, payments, uploads, email reminders, RBAC, Arabic/English UI (RTL), audit logs, Admin (assignments, roles, owner transfer).

## Fresh Install (Prereqs)
- Ubuntu 22.04+/macOS 13+/Windows 10+
- Docker & Compose (recommended) OR Node 18+ & MongoDB 6+
- Optional Nginx + Certbot for HTTPS

## Quick Start (Docker)
```bash
# in project root
bash deployment/setup-docker.sh
# App: http://<server-ip>:4000
```
## Quick Start (PM2)
```bash
bash deployment/setup-pm2.sh
# App: http://127.0.0.1:4000
```

## Seed Admin + Sample Contract
### Bare metal
```bash
cd server
ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=ChangeMe! npm run seed
```
### Docker
```bash
docker compose exec -e ADMIN_EMAIL=admin@example.com -e ADMIN_PASSWORD=ChangeMe! contractmanager node /app/server/src/scripts/seed.js
```

See `deployment/DEPLOYMENT.md` for full instructions.
