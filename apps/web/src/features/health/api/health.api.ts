import type { HealthStatus } from '@ems/shared';
import { apiGet } from '@/services/api-client';

export const getHealth = (signal?: AbortSignal) =>
  apiGet<HealthStatus>('/health', signal);
