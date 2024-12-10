import { prismaClient } from '@core/db-client/prisma.client';
import { Prisma } from '@prisma/client';
import {
  BaseRepository,
  DelegateArgs,
  DelegateReturnTypes,
} from '@core/base/repository/base.repository';
import { DefaultArgs } from '@prisma/client/runtime/library';

type TodoDelegate = Prisma.TodoDelegate<DefaultArgs>;

export class TodoRepository extends BaseRepository<
  TodoDelegate,
  DelegateArgs<TodoDelegate>,
  DelegateReturnTypes<TodoDelegate>
> {
  constructor() {
    super(prismaClient.todo);
  }
}
