# Production notes (scale path)

## What you have now

- Single Node process + MongoDB
- Local disk uploads (`STORAGE_DRIVER=local`)
- Health endpoint with uptime + memory: `GET /api/v1/health`
- CI runs unit tests on push (GitHub Actions)

## When you need scale

| Concern | Next step |
|---------|-----------|
| File storage | Set `STORAGE_DRIVER=s3` + bucket (wire SDK in `utils/storage.js`) |
| Multiple instances | Put Node behind Nginx/Caddy; sticky not required for JWT |
| DB | MongoDB Atlas with backups |
| Secrets | Host env vars / secret manager — never commit `.env` |
| Monitoring | Scrape `/api/v1/health` or add APM (optional) |
| CI | Already: `.github/workflows/ci.yml` |

This keeps the current app working locally while documenting a clear upgrade path.
