import { Redis } from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

class RedisClient {
  private static instance: RedisClient;
  private client: Redis;

  private constructor() {
    const port = process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379;
    const host = process.env.REDIS_HOST ? process.env.REDIS_HOST : 'localhost';
    this.client = new Redis(port, host);
  }

  public static getInstance(): RedisClient {
    if (!RedisClient.instance) {
      RedisClient.instance = new RedisClient();
    }
    return RedisClient.instance;
  }

  public getClient() {
    return this.client;
  }
}

export const redisClient = RedisClient.getInstance();
