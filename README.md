```markdown
# Kujto Tiranën

**A full-stack digital time-capsule platform for Tirana**  
Preserving the city’s visual memory through interactive maps, historical photo archives, and community-driven contributions.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-199900?logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![PWA](https://img.shields.io/badge/PWA-Ready-purple.svg)](#)

---

## Project Overview

Tirana is one of the fastest-changing cities in the region. Streets are redesigned, buildings are replaced, and entire neighborhoods transform within a few years. As a result, visual records of the city’s past are scattered, incomplete, or slowly disappearing.

**Kujto Tiranën** is a full-stack web application built to address this problem.  
It functions as a digital time-capsule that allows users to explore historical photographs of Tirana on an interactive map, compare how locations have changed over time, and contribute new visual material to a moderated public archive.

The platform is designed both for local citizens who want to preserve personal and collective memory, and for visitors interested in understanding the evolution of the city.

---

## Main Objectives

- Create a centralized digital archive of Tirana’s visual history
- Allow users to explore locations through an interactive map interface
- Enable community participation through moderated photo uploads
- Provide a reliable admin system for content review and management
- Deliver a responsive and installable Progressive Web App experience

---

## Core Features

### Public Application
- Interactive map powered by Leaflet
- Location-based photo markers
- Historical timeline view for each location
- Search and filtering functionality
- Photo upload system with pending approval workflow
- User registration and authentication
- Comments system (Albanian and English)
- Favorites / saved locations
- Fully responsive design
- Progressive Web App support (installable on mobile devices)

### Admin Panel
- Secure admin authentication
- Review and moderation of uploaded photos
- Approve / reject content workflow
- User and content management tools
- System monitoring endpoints

---

## Technology Stack

### Frontend
- HTML5
- CSS3
- Vanilla JavaScript
- Leaflet.js (interactive maps)
- Progressive Web App (Service Worker + Web Manifest)

### Backend
- Node.js
- Express.js
- RESTful API architecture
- JWT Authentication
- Optional Google OAuth integration

### Database
- MongoDB
- Mongoose ODM

### DevOps & Tooling
- Docker & Docker Compose
- Environment-based configuration
- Seed scripts for initial data
- Basic testing and smoke checks

---

## System Architecture

The application follows a classic full-stack structure:

- **Client Layer** → Public interface (`index.html`) and Admin interface (`admin.html`)
- **API Layer** → Express.js backend handling authentication, uploads, moderation, and data retrieval
- **Data Layer** → MongoDB for storing users, locations, photos, comments, and moderation states

Key design principles:
- Separation between public and administrative interfaces
- Secure authentication flow
- Content moderation before publication
- Clean and documented API endpoints

For a deeper technical overview, see [`ARCHITECTURE.md`](ARCHITECTURE.md).

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js **18+**
- npm
- MongoDB (local installation or MongoDB Atlas)
- Git

### Installation Steps

```bash
# 1. Clone the repository
git clone https://github.com/ProjectsALB/KujtoTiranen.git
cd KujtoTiranen

# 2. Enter backend directory
cd backend

# 3. Configure environment variables
cp .env.example .env

# 4. Install dependencies
npm install

# 5. Seed the database with initial data
npm run seed

# 6. Start the development server
npm start
```

### Application URLs

| Interface            | URL                                      |
|----------------------|------------------------------------------|
| Public Application   | http://localhost:5000                    |
| Admin Panel          | http://localhost:5000/admin              |
| API Health Check     | http://localhost:5000/api/v1/health      |

### Default Admin Account

After seeding the database, you can log in with:

- **Email:** `admin@kujtotiranen.al`
- **Password:** `Admin123!`

> Important: Change these credentials before any production deployment.

---

## Project Structure

```text
KujtoTiranen/
├── index.html                 # Main public application
├── admin.html                 # Admin moderation dashboard
├── css/                       # Stylesheets
├── js/                        # Frontend JavaScript logic
├── backend/                   # Express.js API
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── controllers/
│   └── ...
├── docs/                      # Technical documentation
├── fotot/                     # Media storage
├── images/                    # Static assets
├── docker-compose.yml
├── Dockerfile
├── ARCHITECTURE.md
├── DEPLOY.md
├── SECURITY.md
├── STATUS.md
└── README.md
```

---

## Environment Configuration

Create a `.env` file inside the `backend` folder using `.env.example` as a template.

| Variable              | Description                                |
|-----------------------|--------------------------------------------|
| `MONGODB_URI`         | MongoDB connection string                  |
| `JWT_SECRET`          | Secret key used for signing JWT tokens     |
| `ADMIN_EMAIL`         | Default administrator email                |
| `ADMIN_PASSWORD`      | Default administrator password             |
| `GOOGLE_CLIENT_ID`    | Optional Google OAuth client ID            |
| `SMTP_HOST`           | Optional SMTP host for contact form        |
| `SMTP_USER`           | Optional SMTP username                     |
| `SMTP_PASS`           | Optional SMTP password                     |

Never commit real credentials to the repository.

---

## Running with Docker

If you prefer containerized setup:

```bash
docker compose up --build
```

---

## Documentation

| File | Purpose |
|------|---------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | High-level system design |
| [docs/API.md](docs/API.md) | API endpoint documentation |
| [DEPLOY.md](DEPLOY.md) | Deployment guidelines |
| [SECURITY.md](SECURITY.md) | Security considerations |
| [STATUS.md](STATUS.md) | Current implementation status |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Contribution guidelines |

---

## Roadmap

### Short-term
- Add real screenshots and demo media
- Improve mobile UI/UX
- Deploy a public live demo

### Medium-term
- Advanced filtering and search
- Better image optimization
- Expanded multilingual support

### Long-term
- Public contribution analytics
- Partnership with local cultural institutions
- Open data export features

---

## Contributing

Contributions are welcome and appreciated.

If you want to improve the project:

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

Please read [`CONTRIBUTING.md`](CONTRIBUTING.md) before submitting major changes.

---

## Security

If you discover a security vulnerability, please review the guidelines in [`SECURITY.md`](SECURITY.md) before creating a public issue.

---

## License

This project is licensed under the **MIT License**.  
You are free to use, modify, and distribute it under the terms of the license.

See the [LICENSE](LICENSE) file for full details.

---

## Author

**ProjectsALB**  
Full-Stack Developer & Data Analyst based in Albania

Focus areas:
- Web Development
- Data Analysis
- Practical applications with local impact

---

## Final Note

Kujto Tiranën is more than a technical project.  
It is an attempt to protect the visual memory of a city that is changing faster than it can be documented.

If you find this project useful, consider starring the repository and contributing to its growth.
```
