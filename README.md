# Kujto Tiranën

**Digital time-capsule for Tirana** — an interactive platform that preserves the city’s visual memory through maps, historical photo timelines, and community contributions.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-199900?logo=leaflet&logoColor=white)](https://leafletjs.com/)

---

## Overview

Tirana is changing rapidly. Buildings, streets, and landmarks evolve every year.

**Kujto Tiranën** is a full-stack web application designed to preserve the visual history of the city. Users can explore historical photographs on an interactive map, browse timelines by year, and contribute new images that are published only after moderation.

The project combines modern web technologies with a strong focus on local cultural preservation.

---

## Features

- Interactive Leaflet map with photo markers
- Historical photo timelines per location
- Community photo uploads with admin moderation
- User authentication (JWT + optional Google OAuth)
- Comments system (Albanian & English)
- Favorites functionality
- Progressive Web App (PWA) support
- Search and filtering system
- Admin panel for content management

---

## Tech Stack

| Layer            | Technology                     |
|------------------|--------------------------------|
| Frontend         | HTML, CSS, JavaScript, Leaflet |
| Backend          | Node.js, Express.js            |
| Database         | MongoDB                        |
| Authentication   | JWT, Google OAuth              |
| Other            | Docker, PWA                    |

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
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
