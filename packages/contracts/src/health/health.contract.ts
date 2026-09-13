export const HEALTH_PATTERNS = {
  IDENTITY: 'identity.health',
  EVENT: 'event.health',
  REGISTRATION: 'registration.health',
  OPERATIONS: 'operations.health',
  REPORTING: 'reporting.health',
} as const;

export type ServiceName = 'identity' | 'event' | 'registration' | 'operations' | 'reporting';
export type ServiceHealth = { service: ServiceName; status: 'up' };

export const SERVICE_HEALTH_PATTERNS: Record<ServiceName, string> = {
  identity: HEALTH_PATTERNS.IDENTITY,
  event: HEALTH_PATTERNS.EVENT,
  registration: HEALTH_PATTERNS.REGISTRATION,
  operations: HEALTH_PATTERNS.OPERATIONS,
  reporting: HEALTH_PATTERNS.REPORTING,
};
