import { jest } from '@jest/globals';
import { ArgumentsHost, BadRequestException } from '@nestjs/common';
import { HttpExceptionFilter } from '../src/common/http-exception.filter.js';

describe('HTTP exception mapping', () => {
  function capture(exception: unknown) {
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });
    const host = {
      switchToHttp: () => ({ getResponse: () => ({ status }) }),
    } as unknown as ArgumentsHost;
    new HttpExceptionFilter().catch(exception, host);
    return { status, json };
  }
  it('preserves validation messages and the HTTP error status', () => {
    const { status, json } = capture(new BadRequestException(['Invalid field']));
    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({
      success: false,
      message: ['Invalid field'],
      error: 'Bad Request',
      statusCode: 400,
    });
  });
  it('hides unexpected internal error details', () => {
    const { status, json } = capture(new Error('database credential must stay private'));
    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({
      success: false,
      message: 'Internal server error',
      error: 'Internal Server Error',
      statusCode: 500,
    });
  });
});
