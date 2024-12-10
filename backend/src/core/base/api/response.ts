export type ApiResponseMetadata = {
  page?: number;
  pageSize?: number;
  total?: number;
  timestamp: number;
};

export type ApiErrorDetail = {
  code: string;
  field?: string;
  message: string;
};

export interface ApiResponseOptions<T = unknown> {
  data?: T;
  message?: string;
  error?: Error | ApiErrorDetail[];
  success?: boolean;
  metadata?: Partial<ApiResponseMetadata>;
  statusCode?: number;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly details: ApiErrorDetail[] = [],
    public readonly statusCode: number = 400,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const response = <T>({
  data = undefined,
  message,
  error,
  success = true,
  metadata = {},
  statusCode = 200,
}: ApiResponseOptions<T>) => {
  const baseResponse = {
    success,
    statusCode,
    metadata: {
      ...metadata,
      timestamp: Date.now(),
    },
  };

  if (error) {
    if (error instanceof ApiError) {
      return {
        ...baseResponse,
        success: false,
        message: error.message,
        errors: error.details,
        statusCode: error.statusCode,
      };
    } else if (error instanceof Error) {
      return {
        ...baseResponse,
        success: false,
        message: error.message,
        statusCode: 500,
      };
    } else if (Array.isArray(error)) {
      return {
        ...baseResponse,
        success: false,
        message: message || 'Validation failed',
        errors: error,
        statusCode: 400,
      };
    }
  }

  return {
    ...baseResponse,
    message,
    data,
  };
};
