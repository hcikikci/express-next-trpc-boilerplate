import { z } from 'zod';
import { router, procedure } from '../../core/server/trpc';
import { TodoService } from './todo.service';
import { TodoRepository } from './todo.repository';
import { Request } from 'express';
import { QueryOptions, parseQuery } from '@core/base/api/parseFilters';
import { TodoStatus } from '@prisma/client';

const todoService = new TodoService(new TodoRepository());

const todoQueryOptions: QueryOptions = {
  searchableFields: ['title', 'description'],
  sortOptions: {
    defaultField: 'createdAt',
    defaultOrder: 'desc',
  },
  paginationOptions: {
    defaultPageSize: 5,
    maxPageSize: 100,
  },
};

export const todoRouter = router({
  getAllTodos: procedure
    .input(
      z.object({
        search: z.string().optional(),
        filter: z.string().optional(),
        sortBy: z.string().optional(),
        sortOrder: z.enum(['asc', 'desc']).optional(),
        page: z.number().optional(),
        pageSize: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const req = ctx.req as Request;
      Object.assign(req.query, input);
      const { filters, sort, pagination } = parseQuery(req, todoQueryOptions);
      const { page, pageSize } = pagination;
      return todoService.getAll({ page, pageSize }, filters, sort);
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
