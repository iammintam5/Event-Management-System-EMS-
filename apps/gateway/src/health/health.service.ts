import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import { SERVICE_HEALTH_PATTERNS, type ServiceHealth, type ServiceName } from '@ems/contracts';
import { NATS_CLIENT } from '../messaging/nats.module.js';
import { PlatformHealthDto } from './health.dto.js';

@Injectable()
export class HealthService implements OnModuleDestroy {
  private broker: 'up' | 'down' = 'down';
  private readonly statusSubscription;

  constructor(
    @Inject(NATS_CLIENT) private readonly client: ClientProxy,
    private readonly config: ConfigService,
  ) {
    this.statusSubscription = this.client.status.subscribe((status) => {
      this.broker = status === 'connected' ? 'up' : 'down';
    });
  }

  async check(): Promise<PlatformHealthDto> {
    const entries = await Promise.all(
      (Object.entries(SERVICE_HEALTH_PATTERNS) as [ServiceName, string][]).map(
        async ([name, pattern]) => {
          try {
            const reply = await firstValueFrom(
              this.client
                .send<ServiceHealth, Record<string, never>>(pattern, {})
                .pipe(timeout(this.config.getOrThrow<number>('HEALTH_TIMEOUT_MS'))),
            );
            return [
              name,
              reply?.service === name && reply.status === 'up' ? 'up' : 'down',
            ] as const;
          } catch {
            return [name, 'down'] as const;
          }
        },
      ),
    );
    const services: PlatformHealthDto['services'] = {
      identity: 'down',
      event: 'down',
      registration: 'down',
      operations: 'down',
      reporting: 'down',
    };
    for (const [name, status] of entries) services[name] = status;
    return {
      gateway: 'up',
      broker: this.broker,
      services,
    };
  }

  onModuleDestroy() {
    this.statusSubscription.unsubscribe();
  }
}
