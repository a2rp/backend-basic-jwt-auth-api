# Backend Basic JWT Auth API

A lightweight REST API for user registration, login, and protected profile access using Node.js, Express, MongoDB, bcrypt, and JSON Web Tokens (JWT).

## Features

- User registration with password hashing
- User login with JWT access-token generation
- Protected `GET /api/auth/me` profile endpoint
- Request validation, generic API errors, and hidden password hashes
- Rate limits for registration and login
- Helmet security headers and configurable browser-origin access
- Email normalization and duplicate-user checks
- MongoDB persistence through Mongoose
- Size-limited JSON request-body support
- Client-side logout response; issued tokens are not revoked

## Tech Stack

- Node.js
- Express.js
- MongoDB and Mongoose
- bcryptjs
- jsonwebtoken
- dotenv
- cors
- helmet
- express-rate-limit

## Project Structure

```text
backend-basic-jwt-auth-api/
|-- src/
|   |-- config/db.js
|   |-- controllers/auth.controller.js
|   |-- middlewares/auth.middleware.js
|   |-- models/User.js
|   |-- routes/auth.routes.js
|   `-- app.js
|-- index.js
|-- requests.rest
`-- package.json
```

## Getting Started

### Prerequisites

- A currently supported Node.js LTS release (Mongoose 9 requires Node.js 20.19 or newer)
- A running MongoDB instance or MongoDB Atlas database

### Installation

```bash
git clone https://github.com/a2rp/backend-basic-jwt-auth-api.git
cd backend-basic-jwt-auth-api
npm install
```

Create a `.env` file in the project root:

```env
PORT=1198
MONGO_URI=mongodb://127.0.0.1:27017/basic-jwt-auth
JWT_SECRET=
JWT_EXPIRES_IN=1h
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

Generate a secret with `node -e "console.log(require('node:crypto').randomBytes(48).toString('base64'))"` and paste the output into `JWT_SECRET`. The server refuses to start if the secret is missing or shorter than 32 bytes. Set `CORS_ORIGINS` to a comma-separated list of exact browser origins; non-browser clients do not use CORS. The server allows `localhost:3000` and `localhost:5173` by default.

Start the API:

```bash
# Development
npm run dev

# Production-style start
npm start
```

The server runs at `http://localhost:1198` by default.

## API Endpoints

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/` | No | Health/status response |
| `POST` | `/api/auth/register` | No | Create a new user |
| `POST` | `/api/auth/login` | No | Validate credentials and return a JWT |
| `GET` | `/api/auth/me` | Bearer token | Return the logged-in user's profile |
| `POST` | `/api/auth/logout` | No | Return a logout confirmation |

### Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Ashish",
  "email": "ashish@example.com",
  "password": "replace-with-a-strong-example-password"
}
```

Registration requires a password with at least 8 characters and no more than 72 UTF-8 bytes.

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "ashish@example.com",
  "password": "replace-with-a-strong-example-password"
}
```

The login response includes a JWT token. Send it with protected requests:

```http
GET /api/auth/me
Authorization: Bearer YOUR_TOKEN_HERE
```

## Testing the API

You can use the included [requests.rest](requests.rest) file with the VS Code REST Client extension, or use Postman or Thunder Client.

Recommended flow:

1. Register a user.
2. Log in with the same credentials.
3. Copy the returned token.
4. Call `/api/auth/me` with the Bearer token.
5. Call `/api/auth/logout` when finished.

## Important Notes

- Passwords are stored as bcrypt hashes and are never returned in API responses. Hashes are excluded from normal Mongoose queries.
- Registration is limited to 10 requests per IP every 15 minutes. Failed login attempts are limited to 10 per IP in the same window; successful logins do not count.
- JWTs use HS256 and expire after one hour by default. Set `JWT_EXPIRES_IN` to another `jsonwebtoken` duration when needed.
- Logout only tells the client to discard its token; this stateless demo cannot revoke an issued token before expiry. Use server-side sessions or refresh-token rotation when revocation is required.
- The in-memory rate limiter is intended for a single API process. Use a shared store and configure trusted proxy hops deliberately when deploying multiple instances behind a proxy.
- Keep `.env` out of version control, use HTTPS in deployment, and use a unique randomly generated JWT secret.

## Author

**Ashish Ranjan**
Full-Stack Web Developer

## Links

- Portfolio: [ashishranjan.net](https://www.ashishranjan.net)
- GitHub: [github.com/a2rp](https://github.com/a2rp)
- CodePen: [codepen.io/ash1198](https://codepen.io/ash1198)
- LinkedIn: [linkedin.com/in/aashishranjan](https://www.linkedin.com/in/aashishranjan)
- Facebook: [facebook.com/theash.ashish](https://www.facebook.com/theash.ashish/)
- YouTube: [Ashish Ranjan](https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1)
- Email: [ash.ranjan09@gmail.com](mailto:ash.ranjan09@gmail.com)

## Support

If this project helps you, you can support the work here:

- [Support page](https://a2rp-donation-page.netlify.app/)
- [Buy Me a Coffee](https://buymeacoffee.com/a2rp)
- [Patreon](https://www.patreon.com/a2rp)

## License

This project is distributed under the [MIT License](LICENSE).
