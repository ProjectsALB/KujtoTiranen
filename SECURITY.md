# Security

## Implemented

- Passwords hashed with **bcrypt** (never stored in localStorage)
- **JWT** auth with configurable expiry
- **Helmet** HTTP headers
- **Rate limiting** on sensitive routes
- **express-validator** on inputs
- Upload limits via **multer** (type/size)
- Server + client **content moderation** (profanity / gibberish, EN & SQ)
- Admin-only moderation endpoints
- CORS with credentials; CSP disabled only where map tiles require it

## Operational rules

1. Do not commit `backend/.env`
2. Rotate `JWT_SECRET` if leaked
3. Use a unique strong `ADMIN_PASSWORD` in production
4. Prefer MongoDB Atlas network IP allowlisting
5. Keep dependencies updated (`npm audit`)
6. Serve only over HTTPS in production

## Auth notes

- Logout clears `KT_TOKEN` / `KT_USER`
- Admin panel rejects non-admin roles
- Google OAuth is optional and requires `GOOGLE_CLIENT_ID`
