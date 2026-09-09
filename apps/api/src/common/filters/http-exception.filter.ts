import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import type { ApiError } from '@ems/shared';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    if (exception instanceof HttpException) {
      const body = exception.getResponse();
      if (typeof body === 'string') message = body;
      else if (
        'message' in body &&
        (typeof body.message === 'string' ||
          (Array.isArray(body.message) &&
            body.message.every((item: unknown) => typeof item === 'string')))
      )
        message = body.message;
    } else {
      // Never log request payloads, raw exceptions or query strings containing secrets.
      this.logger.error('Unhandled request failure');
    }
    const body: ApiError = {
      success: false,
      error: { statusCode, message, path: request.path },
    };
    response.status(statusCode).json(body);
  }
}
