# 📝 TodoFlow — Full Stack Todo Application

![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-336791?logo=postgresql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

> A modern, full-stack productivity application for managing tasks — built with React + Vite on the frontend and Node.js + Express + PostgreSQL on the backend. Persistent, fast, and fully typed end-to-end in TypeScript.

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Live Demo](#-live-demo)
- [Features](#-features)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [Running the App](#-running-the-app)
- [API Reference](#-api-reference)
- [Database Schema](#-database-schema)
- [Build & Deployment](#-build--deployment)
- [Security Notes](#-security-notes)
- [Contributing](#-contributing)
- [Author](#-author)

---

## 🔍 Project Overview

**TodoFlow** is a full-stack To-Do application that helps users organise tasks, manage time efficiently, and achieve their goals. By providing a structured approach to task management, it reduces the likelihood of forgotten responsibilities and contributes to greater personal and professional effectiveness.

The app follows a clean **client-server architecture**: a React frontend communicates with an Express REST API, which persists data in a PostgreSQL database. Every todo is stored persistently — tasks survive page refreshes and browser restarts.

---

## 🌐 Live Demo

> Open your browser at **http://localhost:5173** after running the app locally (see [Running the App](#-running-the-app)).

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| ✅ **Create Todos** | Add new tasks instantly via the input field |
| 📋 **View All Todos** | Fetches and displays all tasks from the database on load |
| ✏️ **Edit Todos** | Update the text of any existing task inline |
| ☑️ **Toggle Complete** | Mark tasks as done or reopen them with one click |
| 🗑️ **Delete Todo** | Remove any individual task permanently |
| 🧹 **Clear Completed** | Bulk-delete all completed tasks in one action |
| 💾 **Persistent Storage** | All data stored in PostgreSQL — survives refreshes |
| 🏥 **Health Check** | Backend exposes `/api/health` for monitoring |
| 🔷 **Fully Typed** | End-to-end TypeScript on both frontend and backend |
| ⚡ **Fast Dev Experience** | Vite HMR for instant frontend updates during development |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     BROWSER                             │
│                                                         │
│   ┌──────────────────────────────────────────────┐      │
│   │         React App  (localhost:5173)          │      │
│   │                                              │      │
│   │   App.tsx  ──────►  api/todosApi.ts          │      │
│   │   (UI + State)         (fetch layer)         │      │
│   └───────────────────────┬──────────────────────┘      │
└───────────────────────────┼─────────────────────────────┘
                            │ HTTP (REST)
                            ▼
┌─────────────────────────────────────────────────────────┐
│              Express Server  (localhost:3001)           │
│                                                         │
│   server/index.ts  ──►  server/routes/todos.ts          │
│   (entry, CORS)          (CRUD route handlers)          │
│                                │                        │
│                    server/db.ts (pg Pool)               │
└───────────────────────────┬─────────────────────────────┘
                            │ SQL queries
                            ▼
┌─────────────────────────────────────────────────────────┐
│              PostgreSQL Database  (port 5432)           │
│                                                         │
│                    Table: todos                         │
│   id | text | completed | created_at                    │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
Davis.github.io/
│
├── server/                        # Backend (Node.js + Express)
│   ├── index.ts                   # Server entry point — port 3001, CORS, routes
│   ├── db.ts                      # PostgreSQL pool + auto-creates todos table
│   └── routes/
│       └── todos.ts               # All 6 REST API route handlers
│
├── src/                           # Frontend (React + Vite)
│   ├── App.tsx                    # Main React component — UI, state, interactions
│   └── api/
│       └── todosApi.ts            # API service layer — all fetch() calls
│
├── index.html                     # Vite HTML entry point
├── vite.config.ts                 # Vite config (React + Tailwind + SingleFile)
├── tsconfig.json                  # TypeScript compiler configuration
├── nodemon.json                   # Nodemon watch config for backend dev
├── package.json                   # Scripts + all dependencies
├── package-lock.json              # Locked dependency tree
├── .env                           # Environment variables (DB credentials)
├── node_modules/                  # Installed packages
└── README.md                      # Project documentation
```

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2.3 | UI component framework |
| **TypeScript** | 5.9.3 | Type-safe JavaScript |
| **Vite** | 7.2.4 | Build tool with lightning-fast HMR |
| **Tailwind CSS** | 4.x | Utility-first styling |
| **clsx** | 2.1.1 | Conditional class name utility |
| **tailwind-merge** | 3.4.0 | Merge conflicting Tailwind classes |
| **vite-plugin-singlefile** | 2.3.0 | Bundle entire app into one HTML file |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18+ | JavaScript runtime |
| **Express** | 5.2.1 | Web framework for REST API |
| **TypeScript** | 5.9.3 | Type-safe server code |
| **ts-node** | 10.9.2 | Run TypeScript directly without compiling |
| **nodemon** | 3.1.14 | Auto-restart server on file changes |

### Database & Auth

| Technology | Version | Purpose |
|------------|---------|---------|
| **PostgreSQL** | 14+ | Relational database for persistent storage |
| **pg** | 8.20.0 | PostgreSQL Node.js client |
| **better-sqlite3** | 12.8.0 | SQLite (lightweight local/dev DB option) |
| **uuid** | 13.0.0 | Generate unique IDs for todos |
| **dotenv** | 17.3.1 | Load environment variables from `.env` |
| **cors** | 2.8.6 | Enable cross-origin requests |
| **bcryptjs** | 3.0.3 | Password hashing (auth feature) |
| **google-auth-library** | 10.6.1 | Google OAuth integration (auth feature) |

---

## ⚙️ Prerequisites

Before running this project, make sure you have the following installed:

- [Node.js](https://nodejs.org) **v18 or higher**
- [PostgreSQL](https://www.postgresql.org/download/) **v14 or higher**
- [npm](https://www.npmjs.com/) (comes with Node.js)
- A PostgreSQL GUI like [pgAdmin](https://www.pgadmin.org/) *(optional but recommended)*

---

## 🚀 Installation & Setup

### Step 1 — Clone the Repository

```bash
git clone https://github.com/albertdarko0214-glitch/Davis.github.io.git
cd Davis.github.io
```

### Step 2 — Install Dependencies

```bash
npm install
```

### Step 3 — Create the PostgreSQL Database

Open **pgAdmin** or the `psql` CLI and run:

```sql
CREATE DATABASE tododb;
```

### Step 4 — Configure Environment Variables

Edit the `.env` file in the project root with your PostgreSQL credentials:

```env
PORT=3001
PG_HOST=localhost
PG_PORT=5432
PG_USER=postgres
PG_PASSWORD=your_password_here
PG_DATABASE=tododb
```

> ✅ The `todos` table will be **automatically created** the first time the server starts — no manual migration needed.

---

## 🔐 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | Port the Express server runs on |
| `PG_HOST` | `localhost` | PostgreSQL host address |
| `PG_PORT` | `5432` | PostgreSQL port |
| `PG_USER` | `postgres` | PostgreSQL username |
| `PG_PASSWORD` | *(required)* | PostgreSQL password |
| `PG_DATABASE` | `tododb` | Name of the database |

---

## ▶️ Running the App

The frontend and backend run as **two separate processes**. Open two terminals:

### Terminal 1 — Start the Backend Server

```bash
npm run server
```

The Express API will start at: **http://localhost:3001**

For development with auto-restart on file changes:

```bash
npm run server:dev
```

### Terminal 2 — Start the Frontend

```bash
npm run dev
```

The React app will start at: **http://localhost:5173**

Open your browser at **http://localhost:5173** to use the app.

---

### Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `vite` | Start Vite dev server with HMR |
| `build` | `vite build` | Build frontend for production |
| `preview` | `vite preview` | Preview the production build |
| `server` | `node --loader ts-node/esm server/index.ts` | Start the backend server |
| `server:dev` | `nodemon` | Start backend with auto-reload |

---

## 📡 API Reference

All endpoints are prefixed with `/api`. The backend runs on `http://localhost:3001`.

### Todos

#### `GET /api/todos`
Fetch all todos, ordered by creation date.

**Response:**
```json
[
  {
    "id": "uuid-string",
    "text": "Buy groceries",
    "completed": false,
    "created_at": "2026-06-10T10:00:00.000Z"
  }
]
```

---

#### `POST /api/todos`
Create a new todo.

**Request Body:**
```json
{ "text": "Buy groceries" }
```

**Response:** `201 Created` — the newly created todo object.

---

#### `PATCH /api/todos/:id`
Update a todo's text and/or completed status.

**Request Body:**
```json
{ "text": "Buy groceries and milk", "completed": false }
```

**Response:** The updated todo object.

---

#### `DELETE /api/todos/:id`
Delete a single todo by ID.

**Response:** `204 No Content`

---

#### `DELETE /api/todos/completed/clear`
Delete all todos where `completed = true`.

**Response:** `204 No Content`

---

### Health

#### `GET /api/health`
Check that the server is running.

**Response:**
```json
{ "status": "ok" }
```

---

## 🗄️ Database Schema

The `todos` table is auto-created by `server/db.ts` on first server start:

```sql
CREATE TABLE IF NOT EXISTS todos (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text        TEXT        NOT NULL,
  completed   BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMP   NOT NULL DEFAULT NOW()
);
```

| Column | Type | Description |
|--------|------|-------------|
| `id` | `UUID` | Primary key — auto-generated unique identifier |
| `text` | `TEXT` | The todo task content |
| `completed` | `BOOLEAN` | Whether the task is done (default: `false`) |
| `created_at` | `TIMESTAMP` | When the todo was created (auto-set) |

---

## 📦 Build & Deployment

### Build for Production

```bash
npm run build
```

This generates a `dist/` folder. Because `vite-plugin-singlefile` is enabled, the **entire frontend app is bundled into a single `index.html`** file — all JavaScript and CSS are inlined. This makes it extremely portable.

### Deploying the Backend

The Express server can be deployed to any Node.js hosting platform:

- **Railway** — connect your GitHub repo and set environment variables in the dashboard
- **Render** — set build command to `npm install` and start command to `npm run server`
- **Heroku** — add the Heroku Postgres addon and configure `DATABASE_URL`
- **VPS / Ubuntu** — use PM2 to keep the server running: `pm2 start "npm run server" --name todoflow`

### Deploying the Frontend

The built `index.html` can be hosted on any static site platform:

- **GitHub Pages** — push `dist/` contents to the `gh-pages` branch
- **Netlify / Vercel** — connect your repo, set build command to `npm run build`

> ⚠️ Remember to update the API base URL in `src/api/todosApi.ts` to point to your production backend URL before building.

---

## 🔒 Security Notes

> **Important:** The `.env` file containing database credentials is currently committed to the repository. This is a security risk and should be addressed immediately.

Recommended fixes:

1. Add `.env` to `.gitignore`:
   ```
   echo ".env" >> .gitignore
   ```
2. Remove the `.env` file from git history:
   ```bash
   git rm --cached .env
   git commit -m "Remove .env from tracking"
   ```
3. Create a `.env.example` file with placeholder values for documentation:
   ```env
   PORT=3001
   PG_HOST=localhost
   PG_PORT=5432
   PG_USER=postgres
   PG_PASSWORD=your_password_here
   PG_DATABASE=tododb
   ```
4. **Rotate your PostgreSQL password** if this repo has ever been public.
5. Also add `node_modules/` to `.gitignore` if not already — it should never be committed.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "Add: your feature description"`
4. Push to your branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

### Ideas for Future Enhancements

- 🔐 Complete user authentication (sign up / login) using `bcryptjs` + `google-auth-library` already in the project
- 🏷️ Todo categories or tags for better organisation
- 📅 Due dates and deadline reminders
- 🔍 Search and filter todos by status or keyword
- 📊 Productivity dashboard with task completion stats
- 🌙 Dark mode toggle
- 📱 Mobile-responsive design improvements
- 🔄 Drag-and-drop task reordering

---

## 👤 Author

**albertdarko0214-glitch**

- GitHub: [@albertdarko0214-glitch](https://github.com/albertdarko0214-glitch)
- Repository: [Davis.github.io](https://github.com/albertdarko0214-glitch/Davis.github.io)
- Live App: [https://albertdarko0214-glitch.github.io/Davis.github.io](https://albertdarko0214-glitch.github.io/Davis.github.io)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

> *"A task without a deadline is just a dream. TodoFlow turns your dreams into done."*
