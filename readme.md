Here's the updated **README.md** with your environment variable descriptions:

---

# **Auth-JS-Token**

A secure, OTP-based authentication system with JWT token-based login, server health status monitoring, logging mechanisms, and refresh tokens. This API provides essential features for user authentication, audit logs, and real-time server status checks.

## **Table of Contents**
- [Project Overview](#project-overview)
- [Features](#features)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Folder Structure](#folder-structure)
- [Routes](#routes)
  - [Auth Routes](#auth-routes)
  - [Audit Log Routes](#audit-log-routes)
  - [Health Routes](#health-routes)
- [Usage](#usage)
  - [Starting the Server](#starting-the-server)
  - [Making Requests](#making-requests)
- [Testing](#testing)

---

## **Project Overview**

`Auth-JS-Token` is a Node.js application that provides secure user authentication via **OTP** (One-Time Password), JWT **token-based** login, and refresh tokens for session management. It also includes features like logging user activities, error logs, server health check, and audit logs. This project is highly suitable for secure user authentication in modern web applications and services.

## **Features**
- **OTP-based User Registration and Login**: Users can register and login via OTP for increased security.
- **JWT Authentication**: Tokens are issued for secure user authentication and can be refreshed.
- **Server Logs**: Includes logs for user activity, errors, and server health status.
- **Refresh Tokens**: Helps maintain sessions across multiple requests.
- **Health Monitoring**: Provides server health and error logs.

## **Installation**

1. **Clone the repository**:
   ```bash
   git clone https://github.com/letsbegincode/auth-token-service.git
   cd auth-token-service
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory and configure the following:

   ```bash
   MONGO_URI=mongodb://127.0.0.1:27017/db
   PORT=3000
   ACCESS_TOKEN_SECRET=<Your Access Token Secret>
   REFRESH_TOKEN_SECRET=<Your Refresh Token Secret>
   NODE_ENV=development
   EMAIL_USER=<Your Gmail Username>
   EMAIL_PASS=<Your Gmail App Password>
   ```

4. **Install the required dependencies**:
   ```bash
   npm install bcrypt cookie-parser cors crypto dotenv express express-validator helmet joi jsonwebtoken mongoose morgan nodemailer winston winston-mongodb
   ```

   Install the dev dependencies:
   ```bash
   npm install --save-dev jest nodemon supertest
   ```

## **Environment Variables**

Ensure you have the following environment variables in your `.env` file:

| Variable                    | Description                                                  |
|-----------------------------|--------------------------------------------------------------|
| `MONGO_URI`                 | MongoDB connection URI (default: `mongodb://127.0.0.1:27017/db`) |
| `PORT`                      | Port on which the server will run (default: `3000`)         |
| `ACCESS_TOKEN_SECRET`       | Secret key for signing JWT access tokens                     |
| `REFRESH_TOKEN_SECRET`      | Secret key for signing JWT refresh tokens                    |
| `NODE_ENV`                  | The environment in which the application is running (e.g., `development`, `production`) |
| `EMAIL_USER`                | Your Gmail email address (used for sending OTPs)            |
| `EMAIL_PASS`                | Your Gmail "less secure app" password (used for sending OTPs) |

> **Note:** To use Gmail for sending OTPs, make sure to enable **less secure app access** in your Gmail account settings, or better yet, use an App Password if 2-Step Verification is enabled.

## **Folder Structure**

```
Auth-JS-Token/
├── src/
│   ├── controllers/
│   │   ├── authController.js           // Handles authentication logic (signup, login, etc.)
│   │   ├── auditLogController.js      // Handles audit log operations
│   │   ├── healthController.js        // Handles server health check
│   ├── middlewares/
│   │   ├── authMiddleware.js          // Middleware for token verification
│   │   ├── errorHandler.js            // Global error handling middleware
│   │   ├── logger.js                  // Logger utility
│   │   ├── rateLimiter.js             // Rate limiting middleware
│   ├── models/
│   │   ├── User.js                    // User schema for MongoDB
│   │   ├── OTP.js                     // OTP model for one-time passwords
│   │   ├── Token.js                   // Token model for JWTs
│   │   └── log.js                     // Log schema for storing server logs
│   ├── routes/
│   │   ├── auditlogs.js               // Audit log routes
│   │   ├── auth.js                    // Authentication routes
│   │   ├── health.js                  // Health check routes
│   │   └── index.js                   // Root route for grouping
│   ├── utils/
│   │   ├── authHelpers.js             // Helper functions for authentication
│   │   ├── errorHandler.js            // Error handler utility
│   │   ├── logUserActivity.js        // Log user activity
│   │   ├── errorLogger.js             // Log errors
│   │   ├── otpHelpers.js             // Helper functions for OTP
│   │   └── otpService.js             // OTP-related services
│   ├── validations/
│   │   ├── userValidation.js         // Validation for user inputs
│   │   └── otpValidation.js          // Validation for OTP inputs
│   ├── config/
│   │   └── redis.js                  // Redis configuration for token storage (for future versions)
├── .env                             // Environment variables
├── .gitignore                       // Git ignore file
├── package.json                     // Project dependencies and scripts
├── package-lock.json                // Exact dependency versions
├── README.md                        // Project documentation
├── app.js                           // Express app setup
└── server.js                        // Server initialization and start
```

## **Routes**

### **Auth Routes (`/auth`)**
- **POST /signup**: Initiates OTP generation for user registration.
  - **Request Body**:
  ```json
  {
    "username": "user1",
    "email": "user1@gmail.com",
    "password": "p"
  }
  ```

- **POST /vsignup**: Verifies OTP and completes user registration.
  - **Request Body**:
  ```json
  {
    "username": "user1",
    "email": "user1@gmail.com",
    "password": "p",
    "otp": "468151"
  }
  ```

- **POST /login**: Initiates OTP generation for login.
  - **Request Body**:
  ```json
  {
    "email": "user1@gmail.com",
    "password": "p"
  }
  ```

- **POST /vlogin**: Verifies OTP and logs the user in.
  - **Request Body**:
  ```json
  {
    "username": "user1",
    "email": "user1@gmail.com",
    "otp": "130098",
    "password": "p"
  }
  ```

- **POST /updatePassword**: Allows users to change their password (using current password validation).
  - **Request Body**:
  ```json
  {
    "email": "user1@gmail.com",
    "confirmPassword": "q",
    "newPassword": "q",
    "currentPassword": "p"
  }
  ```

- **POST /logout**: Logs the user out and revokes the JWT.
  - **No Body**

- **POST /refresh-token**: Issues a new access token using a refresh token.
  - **No Body**

### **Audit Log Routes (`/audit-log`)**
- **GET /**: Retrieve all audit logs.
- **GET /username/:username**: Retrieve audit logs by username.
- **GET /:userId**: Retrieve audit logs by user ID.

### **Health Routes (`/health`)**
- **GET /error**: Retrieve error logs.
- **GET /status**: Retrieve server status logs.

## **Usage**

### **Starting the Server**

To start the application locally:
```bash
npm run dev
```

This will run the server on port `5000` (or the port specified in `.env`).

### **Making Requests**

Once the server is up, you can make requests using tools like **Postman** or **curl**.

#### Example: **User Signup**  
```bash
POST http://localhost:5000/api/auth/signup
Content-Type: application/json
{
  "username": "user1",
  "email": "user1@gmail.com",
  "password": "p"
}
```

#### Example: **User Login**
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json
{
  "email": "user1@gmail.com",
  "password": "p"
}
```

## **Testing**

The project uses **Jest** for unit testing.

### **Running Tests**

To run the tests:
```bash
npm test
```

### **Test Coverage**

Tests for the following module are included:
- **User Model**: Ensures correct functionality for user creation, password hashing, and password validation.
