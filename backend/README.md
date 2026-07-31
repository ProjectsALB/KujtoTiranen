# Kujto Tiranën API (Backend)

Node.js + Express + MongoDB

## Setup (Windows / Mac / Linux)

### 1. Instalo MongoDB
- Local: https://www.mongodb.com/try/download/community
- OSE MongoDB Atlas (cloud free): https://www.mongodb.com/cloud/atlas  
  Pastaj vendos URI në `.env`: `MONGODB_URI=mongodb+srv://user:pass@cluster...`

### 2. Instalo varësitë
```bash
cd backend
npm install
```

### 3. Krijo admin
```bash
npm run seed
```
Admin: `admin@kujtotiranen.al` / `Admin123!`

### 4. Nis serverin
```bash
npm start
```
API: http://localhost:5000  
Health: http://localhost:5000/api/v1/health

### 5. Frontend
Hap `index.html` me Live Server (port 5500) ose çdo static server.
Admin panel: hap `admin.html`

## Endpoints

| Method | Path | Përshkrim |
|--------|------|-----------|
| GET | /api/v1/health | Status |
| GET | /api/v1/photos/:locationKey | Foto të aprovuara |
| POST | /api/v1/photos | Ngarko foto (multipart) |
| GET | /api/v1/photos/admin/pending | Pending (admin) |
| PATCH | /api/v1/photos/:id/moderate | Approve/reject |
| POST | /api/v1/contact | Formular kontakti |
| POST | /api/v1/auth/register | Regjistrim |
| POST | /api/v1/auth/login | Login |
| GET | /api/v1/auth/me | Profili |

## Upload fields (multipart)
- `image` (file)
- `locationKey`, `year`, `caption`, `firstName`, `lastName`, `email`
