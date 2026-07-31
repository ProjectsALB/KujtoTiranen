# Security & Validation Updates

## Implemented (requirements 1–16)

### Images (1–2)
- Every map marker uses a real photo (`js/photos.js` + `L.divIcon` / photo pins).
- Broken images fall back to `images/logo1.webp` (never blank white).
- Timeline uses web + local photos with onerror fallback.

### Content moderation (3–4, 6, 12)
- Server: `backend/src/utils/moderation.js` — gibberish detection + EN/SQ profanity.
- Applied to photo captions, comments, contact messages.
- Client: `js/moderation-client.js` — same rules before submit.
- Clear Albanian/English error messages.

### Upload autofill (5–6)
- Logged-in users: name/email auto-filled and read-only.
- User only enters year + caption; both validated.

### Authentication security (7–11)
- Login forms: `autocomplete="off"`, fields cleared on open/close/success.
- Admin: no default credentials in HTML.
- `saveAuth` stores only JWT + public user fields (id, name, email, role, favorites).
- **Passwords never stored** in localStorage/sessionStorage.
- Logout / clearAuth removes KT_TOKEN, KT_USER, session data, form values.
- New login clears previous session first (session isolation).

### Engineering (13–16)
- Modular moderation utils shared client/server patterns.
- Existing features preserved (map, gallery, admin, PWA, tours).
