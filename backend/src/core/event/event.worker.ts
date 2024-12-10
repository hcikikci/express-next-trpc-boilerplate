import { eventEmitter } from './event.emitter';
import { redisClient } from '@core/db-client/redis.client';
import '@features/todo/events';
async function processEvents() {
  let _redisClient = redisClient.getClient();

  if (!_redisClient) {
    _redisClient = redisClient.getClient();
    await _redisClient.connect();
  }
  console.log('Event worker started');
  while (true) {
    const event = await _redisClient.lpop('eventQueue');
    if (event) {
      const { event: eventName, data } = JSON.parse(event);
      console.log('Processing event: ', eventName, data);
      eventEmitter.emit(eventName, data);
    } else {
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1 saniye bekle
    }
  }
}

processEvents().catch(console.error);
