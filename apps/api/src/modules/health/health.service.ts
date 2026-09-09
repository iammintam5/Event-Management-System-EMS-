import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import type { ApiSuccess, HealthStatus } from '@ems/shared';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  async check(): Promise<ApiSuccess<HealthStatus>> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      throw new ServiceUnavailableException('Database unavailable');
    }
    return {
      success: true,
      data: {
        status: 'ok',
        database: 'up',
        timestamp: new Date().toISOString(),
      },
    };
  }
}
