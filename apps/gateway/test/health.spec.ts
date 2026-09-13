import { jest } from '@jest/globals';
import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { NEVER, of, Subject, throwError } from 'rxjs';
import { HealthService } from '../src/health/health.service.js';
import { HealthController } from '../src/health/health.controller.js';
import { NATS_CLIENT } from '../src/messaging/nats.module.js';
import { SERVICE_HEALTH_PATTERNS } from '@ems/contracts';

describe('Gateway health aggregation', () => {
  const status = new Subject<string>();
  const send = jest.fn((pattern: string, _payload: unknown) =>
    of({ service: pattern.split('.')[0], status: 'up' }),
  );
  let health: HealthService;

  beforeEach(() => {
    send
      .mockReset()
      .mockImplementation((pattern: string) =>
        of({ service: pattern.split('.')[0], status: 'up' }),
      );
    health = new HealthService(
      { status, send } as unknown as ConstructorParameters<typeof HealthService>[0],
      new ConfigService({ HEALTH_TIMEOUT_MS: 25 }),
    );
    status.next('connected');
  });
  afterEach(() => health.onModuleDestroy());

  it('requests all five NATS patterns and aggregates healthy responders', async () => {
    const snapshot = await health.check();
    expect(snapshot.broker).toBe('up');
    expect(Object.values(snapshot.services)).toEqual(['up', 'up', 'up', 'up', 'up']);
    for (const pattern of Object.values(SERVICE_HEALTH_PATTERNS))
      expect(send).toHaveBeenCalledWith(pattern, {});
  });

  it('isolates a nonresponding service while other services remain up', async () => {
    send.mockImplementation((pattern: string) =>
      pattern === 'event.health' ? NEVER : of({ service: pattern.split('.')[0], status: 'up' }),
    );
    const snapshot = await health.check();
    expect(snapshot.services.event).toBe('down');
    expect(snapshot.services.identity).toBe('up');
    expect(snapshot.broker).toBe('up');
  });

  it('reports broker disconnection without throwing', async () => {
    status.next('disconnected');
    send.mockImplementation(() => throwError(() => new Error('offline')));
    expect(await health.check()).toEqual({
      gateway: 'up',
      broker: 'down',
      services: {
        identity: 'down',
        event: 'down',
        registration: 'down',
        operations: 'down',
        reporting: 'down',
      },
    });
  });

  it('does not trust a response belonging to the wrong service', async () => {
    send.mockImplementation(() => of({ service: 'identity', status: 'up' }));
    expect((await health.check()).services.event).toBe('down');
  });

  it('returns HTTP 503 with a useful snapshot for degraded health', async () => {
    send.mockImplementation(() => throwError(() => new Error('unavailable')));
    const controller = new HealthController(health);
    await expect(controller.check()).rejects.toMatchObject({ status: 503 });
  });

  it('boots the controller through Nest dependency injection', async () => {
    const module = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        { provide: HealthService, useValue: health },
        { provide: NATS_CLIENT, useValue: { status, send } },
      ],
    }).compile();
    expect((await module.get(HealthController).check()).success).toBe(true);
    await module.close();
  });
});
