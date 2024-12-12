import winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define level based on environment
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  return env === 'development' ? 'debug' : 'warn';
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

// Add colors to winston
winston.addColors(colors);

// Custom format for console output
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(info => {
    const { timestamp, level, message, ...meta } = info;
    const metaString = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : '';
    return `${timestamp} ${level}: ${message}${metaString}`;
  }),
);

// JSON format for file output
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.json(),
);

// Define file transport options
const fileRotateTransport = new DailyRotateFile.default({
  filename: path.join('logs', '%DATE%-combined.log'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  format: fileFormat,
});

// Define error file transport options
const errorFileRotateTransport = new DailyRotateFile.default({
  filename: path.join('logs', '%DATE%-error.log'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  level: 'error',
  format: fileFormat,
});

// Create the logger instance
const logger = winston.createLogger({
  level: level(),
  levels,
  transports: [
    new winston.transports.Console({ format: consoleFormat }),
    fileRotateTransport,
    errorFileRotateTransport,
  ],
});

// Export a function to get logger instance
export const getLogger = () => logger;

// Export common logging functions
export const logError = (message: string, error?: Error, meta: Record<string, any> = {}) => {
  const logData = {
    ...meta,
    error: error
      ? {
          message: error.message,
          stack: error.stack,
          name: error.name,
        }
      : undefined,
  };

  logger.error(message, logData);
};

export const logInfo = (message: string, meta: Record<string, any> = {}) => {
  logger.info(message, meta);
};

export const logWarn = (message: string, meta: Record<string, any> = {}) => {
  logger.warn(message, meta);
};

export const logDebug = (message: string, meta: Record<string, any> = {}) => {
  logger.debug(message, meta);
};

export const logHttp = (message: string, meta: Record<string, any> = {}) => {
  logger.http(message, meta);
};
