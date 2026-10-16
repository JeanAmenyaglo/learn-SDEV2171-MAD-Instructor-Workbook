# Gig Economy Auth Backend

## Purpose

This project is a local Node.js and Express backend for teaching:

- read-only fetches for Assignment 2
- authentication and protected API access for Assignment 3
- persistent gig-record creation for later assignments

It is intentionally simple:

- local development only
- JSON file persistence
- JWT access tokens only
- no email verification or forgot-password flow
- no database server

## Tech Stack

- Node.js
- Express
- JavaScript
- bcrypt
- jsonwebtoken
- dotenv
- cors
- nodemon

## Project Structure

```text
backend/
├── package.json
├── .env.example
├── .gitignore
├── README.md
├── server.js
└── src/
    ├── app.js
    ├── server.js
    ├── config/
    │   └── env.js
    ├── controllers/
    │   ├── authController.js
    │   ├── recordController.js
    │   └── sampleController.js
    ├── data/
    │   └── db.json
    ├── middleware/
    │   ├── auth.js
    │   ├── errorHandler.js
    │   └── notFound.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── recordRoutes.js
    │   └── sampleRoutes.js
    └── utils/
        ├── db.js
        ├── jwt.js
        └── validators.js
```

## Setup

1. Open a terminal and navigate to this folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` from `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

For a plain Node run:

```bash
npm start
```

## Environment Variables

Use a `.env` file with:

- `PORT`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`

Example:

```env
PORT=4000
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=1h
```

## Seed Data

Seed data lives in `src/data/db.json`.

Seeded user credentials:

- Email: `student1@example.com`
- Password: `Password123!`

The file contains:

- one seeded authenticated user
- seeded protected gig records owned by that user
- a separate public sample dataset for Assignment 2 read-only fetches

## How the Backend can be Used

The backend intentionally exposes two different collection routes:

- `GET /sample-entries` for read-only work that does not require authentication
- `/entries` for authenticated user-owned data

This split is deliberate and matches course lesson progression.

### Assignment 2

Students can fetch sample records from a public read-only endpoint:

- `GET /sample-entries`
- `GET /sample-entries/:id`

These routes do not require auth and are intended for read-only fetching and derived metric work before authentication is introduced.

### Assignment 3 and beyond

Students authenticate and then use protected gig-record routes:

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `GET /entries`
- `GET /entries/:id`
- `POST /entries`
- `PUT /entries/:id`
- `DELETE /entries/:id`

Protected routes require:

```http
Authorization: Bearer <token>
```

Use `/entries` for any assignment task that requires authenticated user-specific data or record creation.

## Gig Record Shape

```json
{
  "id": 1,
  "userId": "user_seed_001",
  "date": "2026-02-10",
  "title": "Downtown lunch delivery",
  "category": "Food Delivery",
  "value": 24.5,
  "rating": 4,
  "notes": "Busy lunch rush and quick handoff",
  "details": {
    "platform": "SwiftDrop",
    "location": "Downtown",
    "durationMinutes": 55
  }
}
```

Validation rules:

- `date` is required and must be `YYYY-MM-DD`
- `title` is required
- `category` is required
- `value` is required and must be a non-negative number
- `rating` is required and must be an integer from 1 to 5
- `notes` is optional string
- `details` is optional object

## API Summary

### Health

- `GET /`

### Public sample data

- `GET /sample-entries`
- `GET /sample-entries/:id`

### Public auth

- `POST /auth/register`
- `POST /auth/login`

### Protected auth

- `GET /auth/me`

### Protected gig records

- `GET /entries`
- `GET /entries/:id`
- `POST /entries`
- `PUT /entries/:id`
- `DELETE /entries/:id`

## Example Requests

Register:

```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Student Two","email":"student2@example.com","password":"Password123!"}'
```

Login:

```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student1@example.com","password":"Password123!"}'
```

Create record after login:

```bash
curl -X POST http://localhost:4000/entries \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"date":"2026-02-13","title":"Afternoon parcel run","category":"Food Delivery","value":22,"rating":4,"notes":"Good parking near pickup","details":{"platform":"SwiftDrop","durationMinutes":44}}'
```

## Networking Notes for React Native

When connecting from Expo or React Native:

- Android emulator usually needs `http://10.0.2.2:<port>`
- iOS simulator can usually use `http://localhost:<port>`
- physical devices should use your computer's LAN IP

If the Android app blocks HTTP during development, allow cleartext traffic in the Android manifest for local testing.

## Disclaimer

This backend is for instructional use in a local classroom or lab context. **It is not production-ready.**
