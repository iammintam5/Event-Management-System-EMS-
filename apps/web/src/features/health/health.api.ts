import { z } from 'zod';
import { apiRequest, ApiRequestError } from '@/services/api-client';

const state = z.enum(['up', 'down']);
const healthSchema = z.object({
  gateway: z.literal('up'),
  broker: state,
  services: z.object({
    identity: state,
    event: state,
    registration: state,
    operations: state,
    reporting: state,
  }),
});
export type PlatformHealth = z.infer<typeof healthSchema>;

export async function getHealth(signal?: AbortSignal): Promise<PlatformHealth> {
  try {
    return healthSchema.parse(await apiRequest<unknown>('/health', { signal }));
  } catch (error) {
    // A 503 health snapshot is still useful for displaying individual component states.
    if (error instanceof ApiRequestError && error.status === 503) {
      const result = z.object({ data: healthSchema }).safeParse(error.body);
      if (result.success) return result.data.data;
    }
    throw error;
  }
}
