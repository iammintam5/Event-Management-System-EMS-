import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import type { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const statusCode =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const body = exception instanceof HttpException ? exception.getResponse() : undefined;
    const details =
      typeof body === 'object' && body !== null ? (body as Record<string, unknown>) : {};
    const message =
      statusCode === 500 ? 'Internal server error' : (details.message ?? body ?? 'Request failed');
    response.status(statusCode).json({
      success: false,
      message,
      error: statusCode === 500 ? 'Internal Server Error' : (details.error ?? 'Request Error'),
      statusCode,
      ...(statusCode === 503 && details.data ? { data: details.data } : {}),
    });
  }
}
