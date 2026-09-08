# Backend Basic JWT Auth API Documentation

## Overview

This project is a small Express API that demonstrates basic JWT authentication backed by MongoDB. It supports user registration, login, access to the authenticated user's profile, and a logout confirmation response.

The application entry point is `index.js`. Express configuration is in `src/app.js`, authentication routes are in `src/routes/auth.routes.js`, and the authentication logic is in `src/controllers/auth.controller.js`.

## Requirements

- Node.js
- npm
- MongoDB, either locally or through MongoDB Atlas

The project does not include a test script. The available npm scripts are:

```text
npm start    Starts the API with node index.js
npm run dev  Starts the API with nodemon
```

## Installation and configuration

Install dependencies from the project directory:

```bash
npm install
```

Create a `.env` file in the project root. The application reads these values:

```env
PORT=1198
MONGO_URI=mongodb://127.0.0.1:27017/basic-jwt-auth
JWT_SECRET=use-a-long-random-secret
```

`PORT` is optional and defaults to `1198`. `MONGO_URI` is passed to Mongoose. `JWT_SECRET` is used to sign and verify JWTs; the application cannot issue or verify tokens correctly without it.

Start the API with:

```bash
npm run dev
```

The root endpoint is available at `http://localhost:1198/` unless another port is configured.

## Request pipeline

1. `dotenv` loads environment variables.
2. The application attempts to connect to MongoDB.
3. Express enables CORS and JSON request parsing.
4. Authentication routes are mounted under `/api/auth`.
5. The `protect` middleware verifies Bearer tokens for `/api/auth/me`.

## API reference

### `GET /`

Returns the application status response.

Example response:

```json
{
  "success": true,
  "message": "Backend Basic JWT Auth API is running"
}
```

### `POST /api/auth/register`

Creates a user. The request body must contain `name`, `email`, and `password`.

```json
{
  "name": "Ashish",
  "email": "ashish@example.com",
  "password": "123456"
}
```

The email is trimmed and converted to lowercase before the duplicate-user check. The password is hashed with bcrypt before it is stored. A successful registration returns HTTP `201` and the user's id, name, and email; the password is not returned.

### `POST /api/auth/login`

Authenticates an existing user using `email` and `password`.

```json
{
  "email": "ashish@example.com",
  "password": "123456"
}
```

A successful login returns HTTP `200`, a JWT in `token`, and basic user information:

```json
{
  "success": true,
  "message": "Login successful",
  "token": "YOUR_JWT_TOKEN",
  "user": {
    "_id": "USER_ID",
    "name": "Ashish",
    "email": "ashish@example.com"
  }
}
```

The token is signed with `JWT_SECRET` and is configured to expire after seven days.

### `GET /api/auth/me`

Returns the currently authenticated user's profile. Send the login token in the request header:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

The middleware rejects a missing or invalid token with HTTP `401`. The profile query excludes the stored password.

### `POST /api/auth/logout`

Returns:

```json
{
  "success": true,
  "message": "Logout successful"
}
```

This endpoint does not revoke, blacklist, or otherwise invalidate an already-issued JWT. A client must discard its local token, and the token remains valid until it expires.

## Data model

The `User` model contains:

- `name`: required string, trimmed
- `email`: required, unique, lowercase string
- `password`: required string, minimum length six at the schema level; stored as a bcrypt hash by the registration controller
- `createdAt` and `updatedAt`: managed by Mongoose timestamps

## Testing manually

The [`requests.rest`](requests.rest) file contains requests for the root endpoint, registration, login, `/me`, and logout. These can be run with the VS Code REST Client extension. Postman or Thunder Client can also be used.

Recommended sequence:

1. Start MongoDB and the API.
2. Register a new user.
3. Log in and copy the returned token.
4. Add the token to the `Authorization` header for `/api/auth/me`.
5. Call logout and discard the token on the client.

## Current scope and limitations

This repository intentionally keeps authentication basic. It currently does not provide refresh tokens, server-side logout revocation, email verification, password reset, role-based authorization, request rate limiting, or an automated test suite. Those features should be added separately if the API is used beyond learning or a small internal example.

Do not commit `.env` or real JWTs. Use a strong secret in deployed environments, and configure CORS and additional security controls according to the application that consumes this API.
