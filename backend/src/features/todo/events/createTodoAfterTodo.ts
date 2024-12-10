import { eventEmitter } from '@core/event/event.emitter';
import { EventTypes } from '@core/event/event.types';
import { Todo } from '@prisma/client';

export const createTodoAfterTodo = (todo: Todo) => {
  console.log('event triggered', todo);
};

eventEmitter.on(EventTypes.OnTodoCreated, createTodoAfterTodo);
