import { validateEnvironment } from '../src/config/environment';

const valid = { DATABASE_URL: 'postgresql://user:password@localhost:5432/ems' };
describe('environment validation', () => {
  it('converts port and applies defaults', () => {
    expect(validateEnvironment({ ...valid, PORT: '3001' })).toMatchObject({
      PORT: 3001,
      FRONTEND_URL: 'http://localhost:3000',
    });
  });
  it.each(['0', '65536', 'abc', '3.5'])('rejects invalid port %s', (PORT) => {
    expect(() => validateEnvironment({ ...valid, PORT })).toThrow('PORT');
  });
  it('rejects missing database configuration without echoing credentials', () => {
    expect(() =>
      validateEnvironment({ DATABASE_URL: 'invalid-secret' }),
    ).toThrow('DATABASE_URL must be a valid PostgreSQL connection URL');
  });
  it('rejects a CORS URL containing a path', () => {
    expect(() =>
      validateEnvironment({
        ...valid,
        FRONTEND_URL: 'http://localhost:3000/path',
      }),
    ).toThrow('FRONTEND_URL');
  });
});
