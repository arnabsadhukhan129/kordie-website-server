# Custom API Code Templating
A simple initial setup of API in NodeJS.

## Tech Structure
### Server Platform:
- NodeJS
- Express Framework

### Database
- MongoDB
- Mongoose ORM

### Tests
- Jest

### Linting
- ESLint

## Setup
- **Install Dependencies**
```
npm install
```

- **Start in Dev**
```
npm run start:dev
```

- **Tests**
```
npm run test
```

- **Lint**
```
npm run lint
```

# Structure

```bash
.
├──__tests__
├── api         
│   └── v1      
│       ├── controllers
│       │   ├── auth.controller.js 
│       │   ├── security.controller.js 
│       │   └── user.controller.js 
│       ├── db
│       │   ├── database.js
│       │   ├── migrations
│       │   ├── models
│       │   │   ├── admin-config.model.js
│       │   │   ├── index.js
│       │   │   ├── otp.model.js
│       │   │   ├── role.model.js
│       │   │   ├── session.model.js
│       │   │   ├── signature-token.model.js
│       │   │   └── user.model.js
│       │   └── seeders
│       ├── index.js
│       ├── middlewares
│       │   ├── auth
│       │   │   ├── change-password.middleware.js
│       │   │   ├── register.middleware.js
│       │   │   └── reset-password.middleware.js
│       │   ├── index.js
│       │   └── security
│       │       └── security.middleware.js
│       ├── routes
│       │   ├── auth.route.js
│       │   ├── file.js
│       │   ├── index.js
│       │   ├── security.route.js
│       │   └── user.route.js
│       └── services
│           ├── auth.service.js
│           ├── index.js
│           ├── notification.service.js
│           ├── otp.service.js
│           ├── redis.service.js
│           ├── security.service.js
│           ├── test.js
│           ├── __tests__
│           │   └── redis-hset.test.js
│           └── user.service.js
├── app
│   └── app.js
├── config
│   ├── app.config.js
│   ├── enum.config.js
│   └── messages.config.js
├── connectors
│   ├── nodemailer.connector.js
│   └── redis.connector.js
├── endwares
│   ├── error-handler.endware.js
│   └── response.endware.js
├── errors
│   ├── base.error.js
│   └── http
│       └── http.errors.js
├── jest.config.js
├── languages
│   └── en.json
├── lib
│   ├── array.lib.js
│   ├── common.lib.js
│   ├── date.lib.js
│   ├── envs.lib.js
│   ├── index.js
│   ├── numbers.lib.js
│   ├── prototype.library.js
│   ├── security.lib.js
│   ├── string.lib.js
│   └── __tests__
│       ├── appendzero.test.js
│       └── modifydate.test.js
├── middlewares
│   ├── auth.middleware.js
│   └── security.middleware.js
├── package.json
├── README.md
├── README.md.save
├── server.js
├── templates
│   ├── generic.template.html
│   ├── register-new-by-otp.html
│   └── register-new-verify.html
└── __tests__
    └── generate-signature.js
```

# Environment Configuration

This section provides an overview of the environment variables required for setting up and configuring the application.

## General Configuration

- **NODE_ENV**: `development`
- **PORT**: `3001`

## Server Configuration

- **APP_SECURE**: `false`
- **KEY_FILE**: *(path to SSL key file)*
- **CERT_FILE**: *(path to SSL certificate file)*
- **CA_FILES**: *(comma-separated list of paths to SSL CA files)*

## Frontend Configuration

- **APP_FRONTEND_URL**: `http://localhost:3000`
- **APP_FORGET_PASSWORD_KEY**: `forget-password`

## Logging Configuration

- **PRINT_STACK_TRACE**: `false`

## Encryption Configuration

- **USE_ENCRYPTED_PIPE**: `false`
- **ENCRYPTION_KEY**: *(encryption key)*
- **CRYPTO_ENC_ALGO**: *(encryption algorithm)*
- **SECRET_KEY**: *(secret key)*
- **INIT_VECTOR**: *(initialization vector)*

## JWT Configuration

- **JWT_SECRET_KEY**: *(JWT secret key)*
- **REFRESH_TOKEN_SECRET_KEY**: *(refresh token secret key)*
- **OTP_TOKEN_EXP_TIME**: `1min`
- **OTP_REFRESH_TOKEN_EXP_TIME**: `15min`
- **OTP_TEST_MODE**: *(false/true # if true will send 123456)*
- **SMS_MODE**: *(false/true # If true then SMS send will be turn on)* 
- **AUTH_ACCESS_TOKEN_EXP_TIME**: `1d`
- **AUTH_REFRESH_TOKEN_EXP_TIME**: `7d`
- **AUTH_FORGET_PASSWORD_TIME_GAP**: `5min`

## Database Configuration

- **DATABASE_URL**: *(URL of the mongo db database)*

## Redis Configuration

- **REDIS_PASSWORD_PROTECTED**: `false`
- **REDIS_ENABLE**: `true`
- **USE_SEARCH_INDEX**: `false`

## Mail Configuration

- **MAIL_HOST**: *(mail host)*
- **MAIL_SENDER**: *(mail sender)*
- **MAIL_PWD**: *(mail password)*
- **MAIL_NAME**: *(mail name)*
- **MAIL_PORT**: `465`
- **MAIL_SECURE**: *(mail secure setting)*

## AWS Configuration

- **AWS_URL**: *(AWS URL)*
- **AWS_ACCESS_KEY_ID**: *(AWS access key ID)*
- **AWS_SECRET_ACCESS_KEY**: *(AWS secret access key)*
- **AWS_REGION**: *(AWS region)*
- **AWS_BUCKET**: *(AWS bucket)*
- **AWS_ACL**: *(AWS ACL)*

## File Limits Configuration

- **IMAGE_FILE_SIZE**: *(Image file size upload limit in bytes)*
- **PDF_FILE_SIZE**: *(PDF file size upload in bytes)*

## Security Token Configuration

- **X_TOKEN_EXP_TIME**: `1h`
- **TOKEN_SECURE_KEY**: *(Generate a random secure key of 16 bytes)*
- **UNIQUE_SIGNATURE_SESSION**: *(true or false. True:- one session per signature. False:- One session can be used for many signature, but until SESSION_EXPIRY_TIME)*
- **SESSION_EXPIRY_TIME**: `1h`
- **SINATURE_TOKEN_EXPIRY_LIMIT**: `1min`
- **ENABLE_X_TOKEN_LAYER**: *(true or false. True:- Security layer enabled. False:- Security layer will be off)*

