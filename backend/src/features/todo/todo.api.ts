import { z } from 'zod';
import { router, procedure } from '../../core/server/trpc';
import { TodoService } from './todo.service';
import { TodoRepository } from './todo.repository';
import { Request } from 'express';
import { FilterOptions, parseFilters } from '@core/base/api/parseFilters';
import { TodoStatus } from '@prisma/client';

const todoService = new TodoService(new TodoRepository());

export const todoRouter = router({
  getAllTodos: procedure.query(async ({ ctx }) => {
    const req = ctx.req as Request;
    const searchableFields: FilterOptions['searchableFields'] = ['title', 'description', 'status'];
    const { where, orderBy, skip, take } = parseFilters(req, { searchableFields });
    return todoService.getAll(skip, take, where, orderBy);
  }),

  getById: procedure.input(z.number()).query(async ({ input }) => {
    return todoService.getById(input);
  }),

  create: procedure
    .input(
      z.object({
        title: z.string().min(1, 'Title is required'),
        description: z.string().optional(),
        status: z.nativeEnum(TodoStatus).default('Pending'),
      }),
    )
    .mutation(async ({ input }) => {
      return todoService.create(input);
    }),

  update: procedure
    .input(
      z.object({
        id: z.number(),
        data: z.object({
          title: z.string().min(1).optional(),
          description: z.string().optional(),
          status: z.nativeEnum(TodoStatus).optional(),
        }),
      }),
    )
    .mutation(async ({ input }) => {
      return todoService.update(input.id, input.data);
    }),

  updateStatus: procedure
    .input(
      z.object({
        id: z.number(),
        status: z.nativeEnum(TodoStatus),
      }),
    )
    .mutation(async ({ input }) => {
      return todoService.update(input.id, { status: input.status });
    }),

  delete: procedure.input(z.number()).mutation(async ({ input }) => {
    return todoService.delete(input);
  }),
});
