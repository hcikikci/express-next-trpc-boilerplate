import { TodoRepository } from './todo.repository';
import { Todo, Prisma } from '@prisma/client';
import { BaseService } from '@core/base/service/base.service';
import { eventEmitter } from '@core/event/event.emitter';
import { EventTypes } from '@core/event/event.types';
import { logInfo } from '@core/logger/logger';

export class TodoService extends BaseService<
  Todo,
  Prisma.TodoWhereInput,
  Prisma.TodoOrderByWithRelationInput
> {
  constructor(private readonly todoRepository: TodoRepository) {
    super(todoRepository);
  }

  async create(data: Prisma.TodoCreateInput): Promise<Todo> {
    const todo = await super.create(data);
    logInfo('Todo created', { todo });
    await eventEmitter.emitEvent(EventTypes.OnTodoCreated, todo);
    return todo;
  }
}
