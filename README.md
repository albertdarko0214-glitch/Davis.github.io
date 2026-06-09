# 📝 TodoFlow — Full Stack Todo App

A full-stack Todo application built with **React + Vite** (frontend) and **Node.js + Express + PostgreSQL** (backend).

---

## 🗂️ Project Structure

```
├── server/
│   ├── index.ts          → Express server entry point (port 3001)
│   ├── db.ts             → PostgreSQL pool & table initialization
│   └── routes/todos.ts   → CRUD REST API routes
├── src/
│   ├── App.tsx           → Main React component
│   └── api/todosApi.ts   → Frontend API service layer
├── .env                  → Environment variables
└── README.md
```

---

## ⚙️ Prerequisites

- [Node.js](https://nodejs.org) v18+
- [PostgreSQL](https://www.postgresql.org/download/) v14+

---

## 🐘 PostgreSQL Setup

### 1. Install PostgreSQL
Download from: https://www.postgresql.org/download/

### 2. Create the Database
Open **pgAdmin** or **psql** and run:
```sql
CREATE DATABASE tododb;
```

### 3. Configure `.env`
Edit the `.env` file in the project root:
```env
PORT=3001
PG_HOST=localhost
PG_PORT=5432
PG_USER=postgres
PG_PASSWORD=your_password_here
PG_DATABASE=tododb
```
> Replace `your_password_here` with your actual PostgreSQL password.

> The `todos` table will be **auto-created** when the server starts.

---

## 🚀 Running the App

Open **two terminals** in VS Code:

### Terminal 1 — Start Backend
```bash
npm run server
```

### Terminal 2 — Start Frontend
```bash
npm run dev
```

Then open your browser at: **http://localhost:5173**

---

## 📡 API Endpoints

| Method | Endpoint                     | Description              |
|--------|------------------------------|--------------------------|
| GET    | `/api/todos`                 | Get all todos            |
| POST   | `/api/todos`                 | Create a new todo        |
| PATCH  | `/api/todos/:id`             | Update todo text/status  |
| DELETE | `/api/todos/:id`             | Delete a single todo     |
| DELETE | `/api/todos/completed/clear` | Clear all completed      |
| GET    | `/api/health`                | Health check             |
