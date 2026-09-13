import { requireUrl } from '@ems/shared';

export function validateEnvironment(env: Record<string, unknown>) {
  const databaseUrl = requireUrl(env, 'DATABASE_URL', ['postgres:', 'postgresql:']);
  const directUrl = requireUrl(env, 'DIRECT_URL', ['postgres:', 'postgresql:']);
  for (const [key, value] of [
    ['DATABASE_URL', databaseUrl],
    ['DIRECT_URL', directUrl],
  ] as const) {
    const schema = new URL(value).searchParams.get('schema');
    if (schema && schema !== 'operations')
      throw new Error(`${key} must target the operations schema`);
  }
  return {
    NATS_URL: requireUrl(env, 'NATS_URL', ['nats:', 'tls:']),
    DATABASE_URL: databaseUrl,
    DIRECT_URL: directUrl,
  };
}
