# backend-basic-jwt-auth-api

A basic backend-only JWT authentication API built with Node.js, Express.js, MongoDB, bcryptjs, and jsonwebtoken.

---

## Features

- User registration
- User login
- Protected profile route
- Basic logout response
- Password hashing with bcryptjs
- JWT token generation
- MongoDB database connection with Mongoose

---

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- bcryptjs
- jsonwebtoken
- dotenv
- cors
- nodemon

---

## API Endpoints

### Home Route

- GET /

Response:

```json
{
    "success": true,
    "message": "Backend Basic JWT Auth API is running"
}
```

### Register User

- POST /api/auth/register

Request body:

```json
{
    "name": "Ashish",
    "email": "ashish@example.com",
    "password": "123456"
}
```

### Login User

- POST /api/auth/login

Request body:

```json
{
    "email": "ashish@example.com",
    "password": "123456"
}
```

### Get Logged In User

- GET /api/auth/me

Headers:

```bash
Authorization: Bearer YOUR_TOKEN_HERE
```

### Logout User

- POST /api/auth/logout

---

## Testing

You can test the API using:

- VS Code REST Client with requests.rest
- Postman
- Thunder Client

---

## Suggested test flow:

- Register user
- Login user
- Copy token from login response
- Access protected route with Bearer token
- Call logout route

---

## Important Note

This is a basic JWT authentication project.

- JWT token is returned in the login response
- Protected route checks token from Authorization header
- Logout is only a success response in this basic version
- Token is not blacklisted or invalidated on the server

For real production-style logout, refresh token flow or HttpOnly cookie auth is better.

---

## Follow Me

- GitHub: https://github.com/a2rp
- Portfolio: https://www.ashishranjan.net
- LinkedIn: https://www.linkedin.com/in/aashishranjan
- Facebook: https://www.facebook.com/theash.ashish/
- YouTube: https://www.youtube.com/@ashishranjan-ashz
