import { ServiceUnavailableException } from '@nestjs/common';
import { HealthService } from '../src/modules/health/health.service';
import type { PrismaService } from '../src/prisma/prisma.service';

describe('readiness', () => {
  const query = jest.fn();
  const service = new HealthService({
    $queryRaw: query,
  } as unknown as PrismaService);
  beforeEach(() => query.mockReset());
  it('confirms database access before reporting ready', async () => {
    query.mockResolvedValue([{ '?column?': 1 }]);
    await expect(service.check()).resolves.toMatchObject({
      success: true,
      data: { status: 'ok', database: 'up' },
    });
    expect(query).toHaveBeenCalledTimes(1);
  });
  it('returns 503 without leaking database details', async () => {
    query.mockRejectedValue(new Error('postgresql://secret'));
    await expect(service.check()).rejects.toThrow(
      new ServiceUnavailableException('Database unavailable'),
    );
  });
});
