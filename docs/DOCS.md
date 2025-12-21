# E-learning-platform

This repository contains the backend for an E-Learning Platform built using **Node.js**, **Express**, and **Prisma ORM**.  
The goal of the platform is to allow users (students and instructors) to register, enroll in courses,instructors to upload content(course, topics, lesons), and track learning progress for students. Y ou can reference this to the W3schools platform, codeacadamy, GeeksForGeeks, and mainly THE ODIN PROJECT.

---
### Objects in our platform
1. Students, users
2. Adminstrators
3. Courses eg.(Javascript, React)
4. Topics eg. (functions, Objects and classes, variables--- Lessons under Javascript course)
5. Lessons eg. (Asynchronous Javascript, synchronous javascript--- Lessons under functions Topic)

----------------------------------------------------------------
Visit the odin project site for inspo [The odin project](https://www.theodinproject.com/)
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
git checkout -b feat/<short-feature-name-(issue_number)>
eg git checkout -b feat/user-models-4

```
### commit message
```bash
git commit -m "feat(name):commit message (#issuesNumber)"
eg
git commit -m "feat(user):changed user models (#4)"

```
### Pull request naming

TTILE
``` bash
feat: pr_name (closes #issueNumber)
eg
feat: user-controller (closes #5)

```
