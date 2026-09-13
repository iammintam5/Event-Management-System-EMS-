import { requireUrl, requireString } from '@ems/shared';

export function validateEnvironment(env: Record<string, unknown>) {
  const databaseUrl = requireUrl(env, 'DATABASE_URL', ['postgres:', 'postgresql:']);
  const directUrl = requireUrl(env, 'DIRECT_URL', ['postgres:', 'postgresql:']);
  for (const [key, value] of [
    ['DATABASE_URL', databaseUrl],
    ['DIRECT_URL', directUrl],
  ] as const) {
    const schema = new URL(value).searchParams.get('schema');
    if (schema && schema !== 'identity') throw new Error(`${key} must target the identity schema`);
  }
  const accessSecret = requireString(env, 'JWT_ACCESS_SECRET');
  const refreshSecret = requireString(env, 'JWT_REFRESH_SECRET');
  if (accessSecret.length < 32 || refreshSecret.length < 32)
    throw new Error('JWT secrets must be at least 32 characters');
  if (accessSecret === refreshSecret) throw new Error('JWT access and refresh secrets must differ');
  return {
    NATS_URL: requireUrl(env, 'NATS_URL', ['nats:', 'tls:']),
    DATABASE_URL: databaseUrl,
    DIRECT_URL: directUrl,
    JWT_ACCESS_SECRET: accessSecret,
    JWT_REFRESH_SECRET: refreshSecret,
  };
}
