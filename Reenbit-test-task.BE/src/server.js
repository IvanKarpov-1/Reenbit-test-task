import createError from 'http-errors';
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import { auth } from 'express-oauth2-jwt-bearer';
import helmet from 'helmet';
import http from 'http';

import routes from './app/routes/index.js';
import initializeSocket from './app/sockets/index.socket.js';

const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);

const checkJwt = auth({
  issuerBaseURL: `https://${process.env.AUTH0_ISSUER_BASE_URL}`,
  audience: process.env.AUTH0_AUDIENCE,
});

app.use(checkJwt);

app.use('/api', routes);

app.use((req, res, next) => {
  next(createError(404));
});

const server = http.createServer(app);

initializeSocket(server);

export { app, server };
