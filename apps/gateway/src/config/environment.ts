import { readInteger, requireUrl } from '@ems/shared';

export function validateEnvironment(env: Record<string, unknown>) {
  return {
    PORT: readInteger(env, 'PORT', 3001, 1, 65535),
    FRONTEND_URL: requireUrl(env, 'FRONTEND_URL', ['http:', 'https:']),
    NATS_URL: requireUrl(env, 'NATS_URL', ['nats:', 'tls:']),
    HEALTH_TIMEOUT_MS: readInteger(env, 'HEALTH_TIMEOUT_MS', 2000, 100, 30000),
  };
}
