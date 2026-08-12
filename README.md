# Kujto Tiranën

**A full-stack digital time-capsule for Tirana**  
Interactive map, historical photo timelines, moderated community uploads, and an admin panel.

[![Version](https://img.shields.io/badge/version-1.6.0-0F2C1A)](CHANGELOG.md)
[![License: MIT](https://img.shields.io/badge/license-MIT-yellow.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](package.json)
[![Stack](https://img.shields.io/badge/stack-Express%20%7C%20MongoDB%20%7C%20Leaflet-blue)](ARCHITECTURE.md)

---

## Overview

Tirana changes quickly. Buildings disappear, streets are redesigned, and the visual identity of the city evolves every year. Historical photographs are often scattered across personal archives, social media, or lost entirely.

**Kujto Tiranën** is a full-stack web platform built to preserve the visual memory of the city. It allows users to explore historical photos on an interactive map, browse timelines by year for specific locations, and contribute new images that are published only after moderation.

The project combines modern web technologies with a practical local purpose: documenting Tirana before it changes again.

---

## Features

### Public Application
- Interactive Leaflet map with photo markers
- Historical timeline view per location
- Search and location filtering
- Photo upload with pending approval workflow
- User registration and authentication (JWT)
- Optional Google OAuth login
- Comments system (Albanian and English)
- Favorites functionality
- Contact form
- Progressive Web App support (installable)

### Admin Panel
- Secure admin authentication
- Review and moderation of uploaded photos
- Approve / reject workflow
- Content and user management tools
- System health monitoring

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | HTML5, CSS3, JavaScript, Leaflet.js |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| Authentication | JWT, Google OAuth (optional) |
| Other | Docker, PWA (Service Worker + Manifest) |

---

## Getting Started

### Requirements
- Node.js **18+**
- MongoDB (local or [Atlas](https://www.mongodb.com/cloud/atlas))
- Git

### Installation

```bash
git clone https://github.com/ProjectsALB/KujtoTiranen.git
cd KujtoTiranen

cd backend
cp .env.example .env
npm install
npm run seed
npm start


Or from the repository root:

npm run install:all
npm run seed
npm start

Access Points

Interface,URL
Public Application,http://localhost:5000
Admin Panel,http://localhost:5000/admin
Health Check,http://localhost:5000/api/v1/health

Default Admin Credentials
After running the seed script:

Field,Value
Email,admin@kujtotiranen.al
Password,Admin123!


Project Structure

KujtoTiranen/
├── index.html              # Public application
├── admin.html              # Admin moderation interface
├── css/                    # Stylesheets
├── js/                     # Frontend logic
├── backend/                # Express API + business logic
├── docs/                   # API docs and screenshots
├── fotot/                  # Media assets
├── images/                 # Static images
├── docker-compose.yml
├── Dockerfile
├── ARCHITECTURE.md
├── DEPLOY.md
├── SECURITY.md
├── STATUS.md
└── README.md


Environment Variables
Create a .env file inside the backend folder based on .env.example:

Variable,Description
MONGODB_URI,MongoDB connection string
JWT_SECRET,Secret key for JWT signing
ADMIN_EMAIL,Default admin email
ADMIN_PASSWORD,Default admin password
GOOGLE_CLIENT_ID,Optional Google OAuth client ID
SMTP_*,Optional email configuration for contact form
FRONTEND_URL,Public frontend origin (for production)

Never commit real credentials to the repository.

Docker

docker compose up --build

Documentation

Document,Description
ARCHITECTURE.md,System architecture overview
docs/API.md,API reference
DEPLOY.md,Deployment guide
SECURITY.md,Security notes
STATUS.md,Current project status
CHANGELOG.md,Version history
CONTRIBUTING.md,Contribution guidelines

Scripts

Command,Description
npm start,Start the application
npm run seed,Seed database with initial data
npm test,Run backend unit tests
npm run smoke,Run smoke checks (server must be running)
npm run install:all,Install all dependencies

Roadmap

Add real screenshots and live demo
Improve mobile experience
Expand search and filtering capabilities
Image optimization pipeline
Broader multilingual support
Public contribution analytics


Contributing
Contributions are welcome.

Fork the repository
Create a feature branch
Make your changes
Open a pull request

Please read CONTRIBUTING.md before submitting major changes.

Security
If you discover a security issue, please follow the process described in SECURITY.md before opening a public issue.

License
This project is licensed under the MIT License.
See the LICENSE file for details.

Author
ProjectsALB
Full-Stack Developer & Data Analyst based in Albania

Built to preserve Tirana’s visual memory for future generations.
