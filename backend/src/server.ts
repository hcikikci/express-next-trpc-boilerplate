import 'tsconfig-paths/register';
import { app } from './core/server/express';
import { createContext } from './core/server/trpc';
import * as trpcExpress from '@trpc/server/adapters/express';
import { httpServer } from './core/server/express';
import { appRouter } from './router';

app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);

const PORT = process.env.PORT || 4000;

httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
