# Task Manager API

A RESTful API for managing tasks with user authentication, built with Node.js, Express, PostgreSQL and Sequelize.

The API supports full CRUD for tasks, JWT-based authentication with access & refresh tokens, and session management.

---

## Tech Stack

- **Node.js**
- **Express**
- **PostgreSQL**
- **Sequelize**
- **JWT (Access + Refresh tokens)**

---

## Features

- User registration and login
- JWT authentication
- Access & refresh token flow
- Secure session storage in database
- Task CRUD operations
- Protected routes
- Multiple sessions per user
- Logout with session cleanup

---

## Installation

```bash
git clone https://github.com/n180688/task_manager_api.git
cd task_manager_api
npm install
```

---

## Environment Variables

Create a `.env` file in the root directory:

```env

JWT_ACCESS_SECRET="your_access_secret"
JWT_ACCESS_EXPIRES="1h"
DBNAME="tasks_db" 
DBUSER="postgres"
DBPASS="your_password"
DBHOST="localhost"
DBPORT="5432"
DOMAIN="http://localhost"
PORT="3000"
```

---

## Database Setup

Make sure PostgreSQL is running, then start the server:

```bash
npm run server
```

(Sequelize will sync models automatically.)

---

## Authentication Flow

### Access Token
- Short-lived JWT
- Sent in `Authorization: Bearer <token>`
- Used for all protected routes

### Refresh Token
- Random string (not JWT)
- Stored as **httpOnly cookie**
- Saved **hashed** in database
- Used to issue new access tokens
- One user can have multiple active sessions

---

## API Routes

### Auth

| Method | Route | Description |
|------|------|------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Logout and remove session |

---

### Tasks (Protected)

| Method | Route | Description |
|------|------|------------|
| GET | `/api/tasks` | Get all user tasks |
| GET | `/api/tasks/:id` | Get task by ID |
| POST | `/api/tasks` | Create new task |
| PUT | `/api/tasks/:id` | Update task (full) |
| PATCH | `/api/tasks/:id` | Update task (partial) |
| DELETE | `/api/tasks/:id` | Delete task |

---

## License

MIT License
