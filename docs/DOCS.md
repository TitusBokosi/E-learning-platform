# E-learning-platform

This repository contains the backend for an E-Learning Platform built using **Node.js**, **Express**, and **Prisma ORM**.  
The goal of the platform is to allow users (students and instructors) to register, enroll in courses, upload content, and track learning progress.

---

## 🚀 Tech Stack

| Component | Technology |
|----------|------------|
| Runtime Environment | Node.js |
| Backend Framework | Express |
| Database ORM | Prisma |
| Database | PostgreSQL / MySQL (Team can decide) |
| Authentication | JWT (Access + Refresh tokens) |
| Environment Variables | dotenv |

---

## 📂 Project Structure

├── prisma/
│ ├── schema.prisma # Database schema definition
│ ├── migrations/ # Auto-generated DB migrations
├── src/
│ ├── config/ # Database + env configs
│ ├── controllers/ # Route handlers (course, auth, user…)
│ ├── middleware/ # Auth guards, error handlers
│ ├── routes/ # Express routes for APIs
│ ├── utils/ # Helper utilities (token, email…)
│ └── server.js # App entry point
├── .env # Local environment variables (not committed)
├── package.json
└── docs.md # Documentation for the team

## 🧩 Contribution Workflow

To ensure smooth teamwork and avoid merge conflicts, follow this workflow for all tasks:

---

## Installations

After cloning the repo, run: 
```bash
npm install
```
### 🔀 1️⃣ Create a New Feature Branch

Always branch from the latest `main`:

```bash
git checkout main
git pull origin main
git checkout -b feature/<short-feature-name>

```
