# Caera talk (Reenbit-test-task)

This repository contains the solution for the Reenbit test task, developed by Ivan Karpov. It showcases a simple chat application written with the MEAN tech stack. The main goal is to automatically responding to users' messages with quotes from the [quotes API](https://stoic.tekloon.net/stoic-quote).

## Tech Stack

- **Client:** Angular, HTML/CSS;

- **Server:** Express.js, MongoDB (Atlas).

## Installation

### Clone the project repo

```bash
  git clone https://github.com/IvanKarpov-1/Reenbit-test-task.git
  cd Reenbit-test-task
```

### Install dependencies

For the backend

```bash
  cd Reenbit-test-task.BE
  npm install
```

For the frontend

```bash
  cd ..
  cd Reenbit-test-task.FE
  npm install
```

## Run Locally

### Pre-requisites

Make sure you have the [Angular CLI](https://github.com/angular/angular-cli?tab=readme-ov-file#development-setup) and [Node.js](https://nodejs.org/uk) installed globally.

#### Auth0

This project uses [Auth0](https://auth0.com/) for authentication, so you must create a tenant with one `Application` and one `API`.

The `Application` settings should be next:

Settings tab:

- Application URLs/Allowed Callabck URLs: `http://localhost:4200`, `http://localhost:4200/callback`;
- Application URLs/Allowed Logout URLs: `http://localhost:4200`;
- Application URLs/Allowed Web Origins: `http://localhost:4200`;
- ID Token Expiration/Maximum ID Token Lifetime: `36000`;
- Refresh Token Expiration/Set Idle Refresh Token Lifetime: `On`;
- Refresh Token Expiration/Idle Refresh Token Lifetime: `2592000`;
- Refresh Token Expiration/Maximum Refresh Token Lifetime: `31557600`;
- Refresh Token Rotation/Allow Refresh Token Rotation: `On`;
- Refresh Token Rotation/Rotation Overlap Period: `120`.

Credentials tab:

- Application authentication/authentication Method: `None`.

The `API` settings should be next:

- Access Token Settings/Maximum Access Token Lifetime: `600`;
- Access Settings/Allow Offline Access: `On`.

#### .env

Next, you need to create a `.env` files in the `Reenbit-test-task.BE` and `Reenbit-test-task.FE` directories.

Reenbit-test-task.BE/.env:

```
  PORT=3000
  MONGO_DB_URI=<YOUR_MONGODB_CONNECTION>
  AUTH0_ISSUER_BASE_URL=<YOUR_AUTH0_DOMAIN>
  AUTH0_AUDIENCE=<YOUR_AUTH0_AUDIENCE>
  CORS_ORIGIN=http://localhost:4200
```

Reenbit-test-task.FE/.env:

```
  NG_APP_API_SERVER_URL=http://localhost:3000
  NG_APP_AUTH0_DOMAIN=<YOUR_AUTH0_DOMAIN>
  NG_APP_AUTH0_CLIENT_ID=<YOUR_AUTH0_CLIENT_ID>
  NG_APP_AUTH0_CALLBACK_URI=http://localhost:4200/callback
  NG_APP_AUTH0_AUDIENCE=<YOUR_AUTH0_AUDIENCE>
```

`<YOUR_MONGODB_CONNECTION>` must be replaced with your MongoDB connection string. `<YOUR_AUTH0_AUDIENCE>` must be replaced with your Auth0 API Identifier (General Settings/Identifier). `<YOUR_AUTH0_DOMAIN>` must be replaced with your Auth0 Application Domain (Basic Information/Domain). `<YOUR_AUTH0_CLIENT_ID>`must be replaced with your Auth0 Application Client ID (Basic Information/Client ID).

### Run

Navigate to `Reenbit-test-task.BE` and run:

```bash
  npm run start:dev
```

Then navigate to `Reenbit-test-task.FE` and run:

```bash
  npm run start:dev
```

Now you can open `http://localhost:4200` and see the application running.

## License

[MIT](https://github.com/IvanKarpov-1/Reenbit-test-task/blob/main/LICENSE)
