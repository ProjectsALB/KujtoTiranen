# API reference (v1)

Base URL (local): `http://localhost:5000/api/v1`

All JSON responses use shape:

```json
{ "success": true, "message": "...", "data": {} }
```

Errors: `{ "success": false, "message": "..." }` with appropriate HTTP status.

## Health

`GET /health` → status, version, time

## Auth

| Method | Path | Auth | Body |
|--------|------|------|------|
| POST | `/auth/register` | — | `{ name, email, password }` |
| POST | `/auth/login` | — | `{ email, password }` |
| GET | `/auth/me` | Bearer | — |
| POST | `/auth/change-password` | Bearer | `{ currentPassword, newPassword }` |
| POST | `/auth/google` | — | `{ credential }` (Google ID token) |
| GET | `/auth/oauth-config` | — | public Google client id flag |
| POST | `/auth/favorites` | Bearer | `{ locationKey }` |

## Photos

| Method | Path | Auth | Notes |
|--------|------|------|------|
| GET | `/photos/:locationKey` | — | approved only |
| POST | `/photos` | optional | multipart: `image`, `locationKey`, `year`, `caption`, names, email |
| GET | `/photos/admin/pending` | admin | pending queue |
| PATCH | `/photos/:id/moderate` | admin | `{ status: "approved" \| "rejected" }` |

## Comments

| Method | Path | Auth |
|--------|------|------|
| GET | `/comments/:locationKey` | — |
| POST | `/comments/:locationKey` | optional |

## Contact

| Method | Path | Body |
|--------|------|------|
| POST | `/contact` | `{ name, email, message }` |

## Auth header

```
Authorization: Bearer <JWT>
```
