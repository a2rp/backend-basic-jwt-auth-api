# Backend Basic JWT Auth API

A lightweight REST API for user registration, login, and protected profile access using Node.js, Express, MongoDB, bcrypt, and JSON Web Tokens (JWT).

## Features

- User registration with password hashing
- User login with JWT access-token generation
- Protected `GET /api/auth/me` profile endpoint
- Email normalization and duplicate-user checks
- MongoDB persistence through Mongoose
- CORS and JSON request-body support
- Simple logout response for this basic JWT implementation

## Tech Stack

- Node.js
- Express.js
- MongoDB and Mongoose
- bcryptjs
- jsonwebtoken
- dotenv
- cors

## Project Structure

```text
backend-basic-jwt-auth-api/
├── src/
│   ├── config/db.js                 # MongoDB connection
│   ├── controllers/auth.controller.js
│   ├── middlewares/auth.middleware.js
│   ├── models/User.js
│   ├── routes/auth.routes.js
│   └── app.js
├── index.js                         # Application entry point
├── requests.rest                    # REST Client examples
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18 or newer
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
JWT_SECRET=replace_this_with_a_long_random_secret
```

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
  "password": "123456"
}
```

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "ashish@example.com",
  "password": "123456"
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

- Passwords are stored as bcrypt hashes and are never returned in API responses.
- JWTs are signed using `JWT_SECRET` and expire after seven days.
- This basic logout endpoint does not revoke or blacklist an already-issued token. A production application should use short-lived access tokens with refresh-token rotation, or HttpOnly cookie-based authentication with server-side revocation.
- Keep `.env` out of version control and use a strong, unique JWT secret in deployed environments.

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
