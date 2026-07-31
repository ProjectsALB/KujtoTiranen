# Kujto Tiranën

**Digital time-capsule for Tirana** — interactive map, historical photo timelines, moderated community uploads, and an admin panel.

[![Version](https://img.shields.io/badge/version-1.6.0-0F2C1A)](CHANGELOG.md)
[![License: MIT](https://img.shields.io/badge/license-MIT-yellow.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](package.json)
[![Stack](https://img.shields.io/badge/stack-Express%20%7C%20MongoDB%20%7C%20Leaflet-blue)](ARCHITECTURE.md)

---

## Why this project

Tirana’s streets change fast. **Kujto Tiranën** keeps visual memory of landmarks in one place: open a pin on the map, browse photos by year, and contribute new images that go live only after moderation.

---

## Screenshots

> Place images in [`docs/screenshots/`](docs/screenshots/) then uncomment:

<!--
![Map](docs/screenshots/map.png)
![Timeline](docs/screenshots/timeline.png)
![Admin](docs/screenshots/admin.png)
-->

---

## Quick start

### Requirements

- Node.js **18+** (see `.nvmrc`)
- MongoDB local or [Atlas](https://www.mongodb.com/cloud/atlas)

### Run

```bash
git clone <your-repo-url>
cd Kujto-Tirane-Pro

cd backend
cp .env.example .env
npm install
npm run seed
npm start
```

| Surface | URL |
|---------|-----|
| App | http://localhost:5000 |
| Admin | http://localhost:5000/admin |
| Health | http://localhost:5000/api/v1/health |

**Default admin (after seed)**

| Field | Value |
|-------|--------|
| Email | `admin@kujtotiranen.al` |
| Password | `Admin123!` |

Change via `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `backend/.env`, then `npm run seed` again.

From the repo root:

```bash
npm run install:all
npm run seed
npm start
npm test          # unit tests (backend)
npm run smoke   # server must be running
```

---

## Feature matrix

| Area | Status |
|------|--------|
| Leaflet map + photo markers | Yes |
| Historical timeline per location | Yes |
| Search → map → sidebar | Yes |
| Upload → pending → admin approve/reject | Yes |
| JWT register / login | Yes |
| Google OAuth (optional) | Yes |
| Comments + moderation (EN/SQ) | Yes |
| Contact form (+ optional SMTP) | Yes |
| Favorites | Yes |
| PWA (`manifest.json`, `sw.js`) | Yes |

See also [STATUS.md](STATUS.md).

---

## Repository layout

```
Kujto-Tirane-Pro/
├── index.html              # Public app
├── admin.html              # Moderation UI
├── css/ · js/              # Frontend assets
├── fotot/ · images/        # Media
├── docs/                   # API + screenshots
├── scripts/smoke.sh        # Manual health check
├── docker-compose.yml      # Optional
└── backend/                # Express + MongoDB API
```

---

## Documentation

| Doc | Content |
|-----|---------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | System overview |
| [docs/API.md](docs/API.md) | HTTP API |
| [docs/openapi.yaml](docs/openapi.yaml) | OpenAPI 3 |
| [DEPLOY.md](DEPLOY.md) | Deploy checklist |
| [SECURITY.md](SECURITY.md) | Security notes |
| [STATUS.md](STATUS.md) | What works / how to verify |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Contribution guide |
| [CHANGELOG.md](CHANGELOG.md) · [PRODUCTION.md](docs/PRODUCTION.md) | Versions |

---

## Configuration

Copy `backend/.env.example` → `backend/.env` (never commit real secrets).

| Variable | Purpose |
|----------|---------|
| `MONGODB_URI` | Database connection |
| `JWT_SECRET` | JWT signing key |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seed admin |
| `GOOGLE_CLIENT_ID` | Optional Google login |
| `SMTP_*` | Optional contact email |

---

## Optional Docker

```bash
docker compose up --build
```

---

## License

[MIT](LICENSE)
