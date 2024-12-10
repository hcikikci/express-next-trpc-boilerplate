import { EventEmitter } from 'events';
import { redisClient } from '@core/db-client/redis.client';
import { EventTypes } from './event.types';

class CustomEventEmitter extends EventEmitter {
  private static instance: CustomEventEmitter;
  private redisClient;

  private constructor() {
    super();
    this.redisClient = redisClient.getClient();
  }

  public static getInstance(): CustomEventEmitter {
    if (!CustomEventEmitter.instance) {
      CustomEventEmitter.instance = new CustomEventEmitter();
    }
    return CustomEventEmitter.instance;
  }

  public async emitEvent(event: EventTypes, data: unknown) {
    console.log('Emitting event: ', event);
    await this.redisClient.rpush('eventQueue', JSON.stringify({ event, data }));
  }
}

export const eventEmitter = CustomEventEmitter.getInstance();
