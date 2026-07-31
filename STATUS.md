# Project status

**Version:** 1.5.0  
**Stability:** usable for demo / portfolio / local deployment

## What works (manual checklist)

| Feature | How to verify |
|---------|----------------|
| Server + static UI | `npm start` → http://localhost:5000 |
| Health | `GET /api/v1/health` returns `success: true` |
| Map | Open home page; tiles and markers visible |
| Location sidebar | Click a marker |
| Timeline | Sidebar → time capsule / timeline button |
| Search | Header search for a known place (e.g. piramida) |
| Register / login | Auth modal on the main site |
| Photo upload | Submit image → status pending |
| Admin moderation | http://localhost:5000/admin → approve/reject |
| Contact form | Submit contact → stored in MongoDB |
| Comments | Open location comments if UI exposes them |
| PWA bits | `manifest.json` + `sw.js` present |

## Admin (default after seed)

- Email: `admin@kujtotiranen.al`
- Password: `Admin123!` (or `ADMIN_PASSWORD` in `.env`)

## Known limits (not bugs)

- Full production hardening (CDN, object storage, CI) is out of scope for this repo layout.
- Google OAuth needs `GOOGLE_CLIENT_ID` in `.env`.
- SMTP email is optional; contact still saves to DB without SMTP.

## Smoke script

With the server running:

```bash
npm run smoke
# or: sh scripts/smoke.sh
```
