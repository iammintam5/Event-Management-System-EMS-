import { validateEnvironment } from '../src/config/environment.js';

describe('Gateway environment', () => {
  const valid = { FRONTEND_URL: 'http://web.test', NATS_URL: 'nats://broker.test:4222' };
  it('uses explicit numeric defaults', () => {
    expect(validateEnvironment(valid)).toMatchObject({ PORT: 3001, HEALTH_TIMEOUT_MS: 2000 });
  });
  it.each(['', 'abc', '0', '65536', '1.5'])('rejects invalid port %s', (PORT) => {
    expect(() => validateEnvironment({ ...valid, PORT })).toThrow('PORT');
  });
  it('rejects missing broker configuration', () => {
    expect(() => validateEnvironment({ FRONTEND_URL: 'http://web.test' })).toThrow('NATS_URL');
  });
  it('does not leak invalid environment contents', () => {
    expect(() => validateEnvironment({ ...valid, NATS_URL: 'secret-not-a-url' })).toThrow(
      'Invalid environment variable: NATS_URL',
    );
  });
});
