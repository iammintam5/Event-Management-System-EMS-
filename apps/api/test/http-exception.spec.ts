import {
  BadRequestException,
  Logger,
  type ArgumentsHost,
} from '@nestjs/common';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';

describe('HTTP error contract', () => {
  const json = jest.fn();
  const status = jest.fn(() => ({ json }));
  const host = {
    switchToHttp: () => ({
      getResponse: () => ({ status }),
      getRequest: () => ({ path: '/api/example' }),
    }),
  } as unknown as ArgumentsHost;

  beforeEach(() => jest.clearAllMocks());

  it('preserves validation messages and HTTP status', () => {
    new HttpExceptionFilter().catch(
      new BadRequestException(['Invalid input']),
      host,
    );
    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({
      success: false,
      error: {
        statusCode: 400,
        message: ['Invalid input'],
        path: '/api/example',
      },
    });
  });

  it('does not expose or log unexpected exception details', () => {
    const logger = jest
      .spyOn(Logger.prototype, 'error')
      .mockImplementation(() => undefined);
    try {
      new HttpExceptionFilter().catch(
        new Error('database-password-secret'),
        host,
      );
      expect(status).toHaveBeenCalledWith(500);
      expect(json).toHaveBeenCalledWith({
        success: false,
        error: {
          statusCode: 500,
          message: 'Internal server error',
          path: '/api/example',
        },
      });
      expect(logger).toHaveBeenCalledWith('Unhandled request failure');
    } finally {
      logger.mockRestore();
    }
  });
});
