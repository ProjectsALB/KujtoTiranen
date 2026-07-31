# Changelog

## 1.6.0

- Unit tests (`node --test`) for moderation + env contract
- GitHub Actions CI workflow
- Central `config/env.js` + storage abstraction (local / S3-ready)
- Health endpoint: uptime, memory, storage driver
- Frontend `js/config.js` for map defaults (less hardcode)
- PRODUCTION.md scale path
- Core map / timeline / admin / upload behaviour unchanged

## 1.5.0

- GitHub-oriented layout: richer README, STATUS.md, screenshots folder
- .gitattributes, expanded .gitignore
- Module file headers (comments only)
- Favicon / meta polish on index.html
- No changes to map, timeline, admin, or upload behaviour

## 1.4.0

- Portfolio polish: OpenAPI spec, CONTRIBUTING, editorconfig, nvmrc, robots.txt
- Accessibility CSS (focus-visible, skip link) + optional toast helper (additive)
- README feature matrix and clearer docs index
- Version 1.4.0 across packages and health endpoint
- No changes to core map / timeline / upload / admin business logic

## 1.3.0

- Architecture + API documentation
- Optional Docker / docker-compose
- Root package scripts (`npm start`, `npm run seed`, `npm run smoke`)
- MIT license
- Manual smoke script (not CI)
- Safer map distance-line helper
- Version bump across health endpoint and packages

## 1.2.0

- Professional documentation (README, DEPLOY, SECURITY)
- Environment template and gitignore hardening
- Admin seed driven by `ADMIN_EMAIL` / `ADMIN_PASSWORD`
- Leaflet tile CSS safeguards (map tiles display)
- Timeline open state CSS + robust `showTimeline(key)`
- Safer map/sidebar helpers (`window.map`, null checks)
- Admin login: clearer errors, Enter key, session restore
- Health endpoint reports version `1.2.0`
- package.json engines and metadata

## 1.0.0

- Initial full-stack release: map, timeline, upload moderation, auth, contact, comments, PWA
