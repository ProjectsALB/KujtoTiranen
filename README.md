# Kujto Tiranën

**Digital time-capsule for Tirana**  
Full-stack web application that preserves the visual memory of the city.

[![Version](https://img.shields.io/badge/version-1.6.0-0F2C1A)](CHANGELOG.md)
[![License: MIT](https://img.shields.io/badge/license-MIT-yellow.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](package.json)
[![Stack](https://img.shields.io/badge/stack-Express%20%7C%20MongoDB%20%7C%20Leaflet-blue)](ARCHITECTURE.md)

---

## Overview

Tirana’s urban landscape changes rapidly. **Kujto Tiranën** captures and preserves visual memory of its places through:

- An interactive **Leaflet map** with landmark markers
- **Historical photo timelines** organized by location and year
- **Community contributions** that go live only after admin moderation
- **Authentication** (JWT + optional Google OAuth)
- Comments, contact form, favorites, and a lightweight **PWA**

The public UI and API share a single origin in development, simplifying CORS and local setup.

---

## Features

| Area          | Capability                                              |
|---------------|---------------------------------------------------------|
| **Map**       | Leaflet map, markers, search → pan + sidebar            |
| **Archive**   | Historical photos grouped by location and year          |
| **Uploads**   | Multipart upload → `pending` → admin approve/reject     |
| **Auth**      | Register / login (JWT); optional Google OAuth           |
| **Community** | Comments with text moderation (EN / SQ)                 |
| **Contact**   | Contact form (persists to DB; optional SMTP)            |
| **Admin**     | Dedicated panel for pending photos and moderation       |
| **PWA**       | `manifest.json` + service worker (`sw.js`)               |
| **Ops**       | Health endpoint, seed script, Docker support, smoke tests |

---

## Architecture

Browser
├── index.html (+ css/, js/)     Map, timeline, upload, search
├── admin.html                   Moderation UI
└── PWA (sw.js, manifest.json)
│
│  HTTP /api/v1/*
▼
Express (backend/src/server.js)
├── Static files (project root)
├── /api/v1/auth                 JWT + optional Google
├── /api/v1/photos               Upload, list, moderate
├── /api/v1/comments             Moderated comments
├── /api/v1/contact              Contact inbox
└── /uploads                     User images on disk
│
▼
MongoDB


**Key design decisions**

- Single origin in development: Express serves both API and static frontend on port `5000`
- Public timeline shows only photos with `status: approved`
- Admin routes require JWT and `role: admin`
- Backend follows **routes → controllers → models** with dedicated middleware and utils

More detail: [`ARCHITECTURE.md`](ARCHITECTURE.md)

---

## Tech Stack

| Layer        | Technologies                              |
|--------------|-------------------------------------------|
| **Frontend** | HTML, CSS, vanilla JavaScript, Leaflet    |
| **Backend**  | Node.js 18+, Express                      |
| **Database** | MongoDB (Mongoose)                        |
| **Auth**     | JWT; optional Google OAuth                |
| **Uploads**  | Multer (disk storage under `uploads`)     |
| **Quality**  | Unit tests, health check, smoke script    |
| **Deploy**   | Dockerfile, process manager (e.g. PM2)    |

---

## Project Structure

KujtoTiranen/
├── index.html
├── admin.html
├── css/
├── js/
│   ├── api.js
│   ├── auth-ui.js
│   ├── photos.js
│   ├── searchBar.js
│   ├── moderation-client.js
│   ├── features.js
│   └── ...
├── fotot/ · images/
├── docs/
├── backend/
│   ├── package.json
│   ├── .env.example
│   ├── src/
│   │   ├── server.js
│   │   ├── config/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── seed.js
│   └── tests/
├── ARCHITECTURE.md
├── DEPLOY.md
├── SECURITY.md
├── STATUS.md
├── CHANGELOG.md
├── Dockerfile
└── package.json
text


---

## API Surface (summary)

| Method  | Path                              | Description                     |
|---------|-----------------------------------|---------------------------------|
| `GET`   | `/api/v1/health`                  | Health / version                |
| `GET`   | `/api/v1/photos/:locationKey`     | Approved photos for a location  |
| `POST`  | `/api/v1/photos`                  | Upload photo (multipart)        |
| `GET`   | `/api/v1/photos/admin/pending`    | Pending queue (admin)           |
| `PATCH` | `/api/v1/photos/:id/moderate`     | Approve / reject                |
| `POST`  | `/api/v1/auth/register`           | Register                        |
| `POST`  | `/api/v1/auth/login`              | Login                           |
| `GET`   | `/api/v1/auth/me`                 | Current user                    |
| `POST`  | `/api/v1/contact`                 | Contact form                    |
| —       | `/api/v1/comments`                | Comment create / list (moderated) |

**Upload fields:** `image`, `locationKey`, `year`, `caption`, `firstName`, `lastName`, `email`

---

## Getting Started

### Requirements

- Node.js **18+** (see `.nvmrc`)
- MongoDB (local or Atlas)

### Setup

```bash
git clone <your-repo-url>
cd KujtoTiranen
cd backend
cp .env.example .env
npm install
npm run seed
npm start
```

### Surface,URL
App,http://localhost:5000
Admin,http://localhost:5000/admin
Health,http://localhost:5000/api/v1/health

### Default admin credentials
admin@kujtotiranen.al / Admin123!

### Tests
npm test
npm run smoke

### Configuration
Configure the following variables in backend/.env:

### Variable,Description

MONGODB_URI,MongoDB connection string
JWT_SECRET,Secret for signing JWTs
ADMIN_EMAIL,Default admin email
ADMIN_PASSWORD,Default admin password
FRONTEND_URL,Frontend origin
SMTP_*,Optional email settings
GOOGLE_CLIENT_ID,Optional Google OAuth

### See DEPLOY.md and SECURITY.md for production guidance.

### Deployment

Set NODE_ENV=production
Use a strong JWT_SECRET and admin password
Use a managed MongoDB instance
Serve over HTTPS
Persist the backend/uploads directory

cd backend
npm install --omit=dev
npm run seed
pm2 start src/server.js --name kujto-tiranen

### Skills Demonstrated

Area,Evidence
Full-stack delivery,UI + Express API + MongoDB
REST API,"Versioned /api/v1, health check"
Auth,"JWT, admin role, optional OAuth"
Uploads,Multer + moderation workflow
Data modeling,Mongoose models
Frontend,"Modular JS, Leaflet map"
Ops,"Tests, Docker, deployment docs"

### Documentation

Document,Purpose
ARCHITECTURE.md,System design
DEPLOY.md,Deployment
SECURITY.md,Security
STATUS.md,Feature status
CHANGELOG.md,Version history
docs/API.md,API notes
backend/README.md,Backend setup

### Author
Kristina Spahi
Computer Engineer · Data Analyst · Full-Stack Developer

Email: 26spahikristi@gmail.com
GitHub: github.com/ProjectsALB


### License
MIT

