# Deployment

## Local

1. Install Node 18+ and MongoDB
2. `cd backend && cp .env.example .env && npm install && npm run seed && npm start`
3. Open http://localhost:5000

The Express server serves both the API and the static frontend from the project root.

## Production checklist

1. Set `NODE_ENV=production`
2. Generate a strong `JWT_SECRET` (48+ characters)
3. Set a strong `ADMIN_PASSWORD` and run `npm run seed`
4. Use a managed MongoDB (`MONGODB_URI`)
5. Set `FRONTEND_URL` to your public origin
6. Put the app behind HTTPS (reverse proxy: Nginx, Caddy, or a PaaS)
7. Optionally configure `SMTP_*` and `GOOGLE_CLIENT_ID`
8. Restrict CORS if you split frontend/API hosts
9. Persist `backend/uploads` (volume / object storage)

## Process manager

Example with systemd or PM2:

```bash
cd backend
npm install --omit=dev
npm run seed
pm2 start src/server.js --name kujto-tiranen
```

## Health

`GET /api/v1/health` should return `{ success: true, version: "1.2.0", ... }`.
