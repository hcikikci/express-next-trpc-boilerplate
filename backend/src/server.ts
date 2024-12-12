import 'tsconfig-paths/register';
import { app } from './core/server/express';
import { createContext } from './core/server/trpc';
import * as trpcExpress from '@trpc/server/adapters/express';
import { httpServer } from './core/server/express';
import { appRouter } from './router';
import { httpLogger } from './core/logger/http.middleware';
import { logInfo, logError } from './core/logger/logger';
import path from 'path';
import fs from 'fs';

// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Add HTTP logging middleware
app.use(httpLogger);

app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);

const PORT = process.env.PORT || 4000;

// Global error handler
app.use((err: Error, req: any, res: any, next: any) => {
  logError('Unhandled error', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server with logging
httpServer.listen(PORT, () => {
  logInfo(`Server is running on http://localhost:${PORT}`);
});
