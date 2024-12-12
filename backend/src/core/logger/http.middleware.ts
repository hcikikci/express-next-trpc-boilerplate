import { Request, Response, NextFunction } from 'express';
import { logHttp } from './logger';
import { randomUUID } from 'crypto';

// Extend Express Request type to include requestId
declare global {
  namespace Express {
    interface Request {
      requestId: string;
    }
  }
}

const sensitiveFields = ['password', 'token', 'authorization', 'cookie'];

const sanitizeData = (data: any): any => {
  if (!data) return data;

  if (typeof data === 'object') {
    const sanitized = { ...data };
    for (const key of Object.keys(sanitized)) {
      if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof sanitized[key] === 'object') {
        sanitized[key] = sanitizeData(sanitized[key]);
      }
    }
    return sanitized;
  }

  return data;
};

export const httpLogger = (req: Request, res: Response, next: NextFunction) => {
  // Generate request ID
  req.requestId = randomUUID();

  // Start timer
  const start = Date.now();

  // Log request
  const requestData = {
    requestId: req.requestId,
    method: req.method,
    url: req.originalUrl,
    query: sanitizeData(req.query),
    body: sanitizeData(req.body),
    ip: req.ip,
    userAgent: req.get('user-agent') || 'Unknown',
  };

  logHttp(`Request received: ${req.method} ${req.originalUrl}`, requestData);

  // Process request
  res.on('finish', () => {
    // Calculate processing time
    const duration = Date.now() - start;

    // Prepare response data
    const responseData = {
      requestId: req.requestId,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent') || 'Unknown',
    };

    // Log based on status code
    const message = `Response sent: ${req.method} ${req.originalUrl}`;

    if (res.statusCode >= 500) {
      logHttp(`[ERROR] ${message}`, responseData);
    } else if (res.statusCode >= 400) {
      logHttp(`[WARN] ${message}`, responseData);
    } else {
      logHttp(`[INFO] ${message}`, responseData);
    }
  });

  next();
};
