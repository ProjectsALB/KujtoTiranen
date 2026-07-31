# Contributing

## Local setup

```bash
cd backend
cp .env.example .env
npm install
npm run seed
npm start
```

## Guidelines

1. Do not commit `backend/.env` or secrets.
2. Keep Albanian and English user-facing messages consistent where both exist.
3. Photo uploads must stay in **pending** until an admin approves them.
4. Prefer small, focused changes; do not rewrite working map/timeline logic without a clear reason.
5. After backend changes, hit `GET /api/v1/health` and open the map once.

## Code layout

See [ARCHITECTURE.md](ARCHITECTURE.md).
