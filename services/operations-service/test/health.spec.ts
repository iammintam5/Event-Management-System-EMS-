import { Test } from '@nestjs/testing';
import { HealthController } from '../src/health/health.controller.js';
import { validateEnvironment } from '../src/config/environment.js';

describe('operations service foundation', () => {
  it('boots the health controller and reports its own service identity', async () => {
    const module = await Test.createTestingModule({ controllers: [HealthController] }).compile();
    expect(module.get(HealthController).check()).toEqual({ service: 'operations', status: 'up' });
    await module.close();
  });
  it('fails fast without required database configuration', () => {
    expect(() => validateEnvironment({})).toThrow('Missing environment variable: DATABASE_URL');
  });
  it('rejects a connection configured for another service schema without leaking credentials', () => {
    const env = {
      DATABASE_URL: 'postgresql://test:never-log-this@db.invalid/db?schema=other',
      DIRECT_URL: 'postgresql://test:never-log-this@db.invalid/db',
    };
    expect(() => validateEnvironment(env)).toThrow(
      'DATABASE_URL must target the operations schema',
    );
  });
});
