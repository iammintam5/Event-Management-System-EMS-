export function validateEnvironment(config: Record<string, unknown>) {
  const port = Number(config.PORT ?? 3001);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be an integer between 1 and 65535');
  }
  const databaseUrl =
    typeof config.DATABASE_URL === 'string' ? config.DATABASE_URL : '';
  try {
    const parsed = new URL(databaseUrl);
    if (
      !['postgresql:', 'postgres:'].includes(parsed.protocol) ||
      !parsed.hostname ||
      parsed.pathname.length < 2
    )
      throw new Error();
  } catch {
    throw new Error('DATABASE_URL must be a valid PostgreSQL connection URL');
  }
  const frontendUrl = String(config.FRONTEND_URL ?? 'http://localhost:3000');
  try {
    const parsed = new URL(frontendUrl);
    if (
      !['http:', 'https:'].includes(parsed.protocol) ||
      parsed.origin !== frontendUrl
    )
      throw new Error();
  } catch {
    throw new Error(
      'FRONTEND_URL must be an HTTP(S) origin without a trailing slash',
    );
  }
  const nodeEnv = String(config.NODE_ENV ?? 'development');
  if (!['development', 'test', 'production'].includes(nodeEnv))
    throw new Error('Invalid NODE_ENV');
  return {
    ...config,
    PORT: port,
    DATABASE_URL: databaseUrl,
    FRONTEND_URL: frontendUrl,
    NODE_ENV: nodeEnv,
  };
}
