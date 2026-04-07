import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
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

    // Log error details in production (exclude sensitive info)
    console.error('[ERROR]', {
      timestamp: new Date().toISOString(),
      method: request.method,
      url: request.url,
      status,
      message,
    });

    // Don't expose internal errors to clients in production
    const isProduction = process.env.NODE_ENV === 'production';
    const safeMessage =
      status === HttpStatus.INTERNAL_SERVER_ERROR && isProduction
        ? 'Internal server error'
        : message;

    response.status(status).json({
      statusCode: status,
      message: safeMessage,
      timestamp: new Date().toISOString(),
      path: request.url,
      ...(status !== HttpStatus.INTERNAL_SERVER_ERROR && {
        error: this.getErrorMessage(exception),
      }),
    });
  }

  private getErrorMessage(exception: unknown): string {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      if (typeof response === 'string') {
        return response;
      }
      return (response as any).message || 'Unknown error';
    }
    return 'Unknown error';
  }
}
