import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import session from 'express-session';
import RedisStore from 'connect-redis';
import { redisClient } from '@core/db-client/redis.client';

declare module 'express-session' {
  export interface SessionData {
    userId: number;
  }
}

dotenv.config();

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(
  session({
    name: process.env.SESSION_NAME,
    store: new RedisStore({ client: redisClient.getClient(), ttl: 3600 }),
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
    },
  }),
);

const httpServer = createServer(app);

export { app, httpServer };
