# Backend Server Guide

This backend is a small Node.js HTTP server that serves read-only study-step data from `study-steps.json`.

> Run this server in a new terminal window, not the same one as your mobile application.

## Requirements

- Node.js 18+ (Node.js 22+ recommended)
- npm

## Install

From the `example/backend` folder in this lesson:

```bash
npm install
```

## Run

From the same `example/backend` directory:

```bash
npm start
```

The server runs on:

- `http://localhost:3000`

You should see:

```text
Server is running on port 3000
```

## API Endpoints

All responses are JSON. CORS is enabled for all origins.

### 1. Get All Study Steps

- Method: `GET`
- Paths:
  - `/study-steps`
  - `/api/study-steps`
- Success: `200 OK`
- Response body: array of study-step objects

Example:

```bash
curl http://localhost:3000/study-steps
```

Example response:

```json
[
  {
    "id": "1",
    "label": "Charge laptop before class"
  }
]
```

### 2. Get One Study Step by ID

- Method: `GET`
- Paths:
  - `/study-steps/:id`
  - `/api/study-steps/:id`
- Success: `200 OK`
- Response body: one study-step object

Example:

```bash
curl http://localhost:3000/study-steps/2
```

Example response:

```json
{
  "id": "2",
  "label": "Review yesterday's API notes"
}
```

### 3. Simulate Slow Responses

- Add `?delay=<milliseconds>` to either route.
- Example:

```bash
curl "http://localhost:3000/study-steps?delay=1500"
```

### 4. Simulate A Server Error

- Add `?error=1` to either route.
- Example:

```bash
curl "http://localhost:3000/study-steps?delay=1200&error=1"
```

## Error Responses

- `400 Bad Request`
  - Returned when `:id` is missing for the single-item route.
  - Body:
    ```json
    { "error": "A study step id is required" }
    ```
- `404 Not Found`
  - Returned for unknown routes or when a step ID does not exist.
  - Bodies:
    ```json
    { "error": "Endpoint not found" }
    ```
    ```json
    { "error": "No study step found for id <id>" }
    ```
- `500 Internal Server Error`
  - Returned when data file cannot be read, has invalid shape, or when `?error=1` is used for lesson-14 error practice.
  - Bodies:
    ```json
    { "error": "Failed to read database" }
    ```
    ```json
    { "error": "Invalid study step data shape" }
    ```
    ```json
    { "error": "Simulated request failure for lesson 14" }
    ```

## Data Source

The server reads from:

- `study-steps.json`

Expected file shape:

```json
{
  "steps": [
    {
      "id": "1",
      "label": "One short study step"
    }
  ]
}
```
