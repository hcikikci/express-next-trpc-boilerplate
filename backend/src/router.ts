import { router } from './core/server/trpc';
import { todoRouter } from './features/todo/todo.api';

export const appRouter = router({
  todo: todoRouter,
});

export type AppRouter = typeof appRouter;
