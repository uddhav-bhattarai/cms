import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

export interface ApiError {
  message: string | string[];
  statusCode: number;
  error?: string;
  timestamp: string;
  path: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    const errorResponse: ApiError = {
      message,
      statusCode: status,
      error: this.getErrorMessage(status),
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    // Log error in production
    if (status >= 500) {
      console.error('[HTTP EXCEPTION]', JSON.stringify({
        status,
        message,
        path: request.url,
        method: request.method,
        stack: exception instanceof Error ? exception.stack : undefined,
      }));
    }

    response.status(status).json(errorResponse);
  }

  private getErrorMessage(status: number): string {
    const messages: Record<number, string> = {
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      409: 'Conflict',
      422: 'Unprocessable Entity',
      429: 'Too Many Requests',
      500: 'Internal Server Error',
      502: 'Bad Gateway',
      503: 'Service Unavailable',
    };
    return messages[status] || 'Error';
  }
}
