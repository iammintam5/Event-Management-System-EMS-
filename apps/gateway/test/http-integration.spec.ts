import type { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { configureApp } from '../src/configure-app.js';
import { HttpExceptionFilter } from '../src/common/http-exception.filter.js';
import { HealthController } from '../src/health/health.controller.js';
import { HealthService } from '../src/health/health.service.js';

describe('Gateway HTTP configuration', () => {
  let app: INestApplication;
  let baseUrl: string;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: ConfigService,
          useValue: new ConfigService({ FRONTEND_URL: 'http://web.test' }),
        },
        { provide: APP_FILTER, useClass: HttpExceptionFilter },
        {
          provide: HealthService,
          useValue: {
            check: async () => ({
              gateway: 'up',
              broker: 'up',
              services: {
                identity: 'up',
                event: 'up',
                registration: 'up',
                operations: 'up',
                reporting: 'up',
              },
            }),
          },
        },
      ],
    }).compile();
    app = module.createNestApplication();
    configureApp(app);
    await app.listen(0, '127.0.0.1');
    baseUrl = await app.getUrl();
  });

  afterAll(async () => {
    await app?.close();
  });

  it('returns the JSON envelope for an unknown API route', async () => {
    const response = await fetch(baseUrl + '/api/missing');
    expect(response.status).toBe(404);
    expect(await response.json()).toMatchObject({
      success: false,
      statusCode: 404,
      error: 'Not Found',
    });
  });

  it('maps malformed JSON into a 400 envelope', async () => {
    const response = await fetch(baseUrl + '/api/health', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{invalid',
    });
    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({ success: false, statusCode: 400 });
  });

  it('serves documented health and allows the configured frontend origin', async () => {
    const response = await fetch(baseUrl + '/api/health', {
      headers: { Origin: 'http://web.test' },
    });
    expect(response.status).toBe(200);
    expect(response.headers.get('access-control-allow-origin')).toBe('http://web.test');
    expect(await response.json()).toMatchObject({ success: true });
    const docs = await fetch(baseUrl + '/api/docs-json');
    const spec = (await docs.json()) as { paths: Record<string, unknown> };
    expect(spec.paths['/api/health']).toBeDefined();
  });
});
