# Architecture

```
Browser
  ├── index.html (+ css/, js/)     UI: map, timeline, upload, search
  ├── admin.html                  Moderation panel
  └── PWA (sw.js, manifest.json)
           │
           │  HTTP /api/v1/*
           ▼
Express (backend/src/server.js)
  ├── Static files (project root)
  ├── /api/v1/auth      JWT + optional Google
  ├── /api/v1/photos    upload, list, moderate
  ├── /api/v1/comments  moderated comments
  ├── /api/v1/contact   contact inbox
  └── /uploads          user images on disk
           │
           ▼
        MongoDB
```

## Frontend modules (`js/`)

| File | Role |
|------|------|
| `api.js` | API base URL + fetch helpers |
| `photos.js` | Static archive + timeline helpers |
| `searchBar.js` | Location search → map pan + sidebar |
| `auth-ui.js` | Login / register UI |
| `moderation-client.js` | Client-side text checks |
| `features.js` | Tours / extras |
| `script.js` / `allscript.js` | Layout, sliders, shared UI |

Map init and timeline live primarily in `index.html` (Leaflet boot, markers, polaroid viewer).

## Backend layers

- **routes** → **controllers** → **models** (Mongoose)
- **middleware**: auth (JWT), upload (multer), errors
- **utils**: moderation, mailer

## Design choices

- Single origin in dev: Express serves API + static UI on port 5000 (avoids CORS issues).
- Photos: only `status: approved` appear on the public timeline.
- Admin actions require JWT + `role: admin`.
