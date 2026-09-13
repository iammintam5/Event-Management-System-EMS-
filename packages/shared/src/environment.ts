export function requireString(env: Record<string, unknown>, key: string): string {
  const value = env[key];
  if (typeof value !== 'string' || !value.trim())
    throw new Error(`Missing environment variable: ${key}`);
  return value.trim();
}

export function requireUrl(env: Record<string, unknown>, key: string, protocols: string[]): string {
  const value = requireString(env, key);
  try {
    const url = new URL(value);
    if (!protocols.includes(url.protocol) || !url.hostname) throw new Error();
  } catch {
    throw new Error(
      `Invalid environment variable: ${key} (expected ${protocols.join(' or ')} URL)`,
    );
  }
  return value;
}

export function readInteger(
  env: Record<string, unknown>,
  key: string,
  fallback: number,
  min: number,
  max: number,
): number {
  const raw = env[key] ?? fallback;
  const value =
    typeof raw === 'number' ? raw : typeof raw === 'string' && raw.trim() ? Number(raw) : NaN;
  if (!Number.isInteger(value) || value < min || value > max)
    throw new Error(`Invalid environment variable: ${key} (expected integer ${min}..${max})`);
  return value;
}
