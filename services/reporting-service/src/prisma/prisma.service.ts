import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  constructor(config: ConfigService) {
    super({
      adapter: new PrismaPg(
        {
          connectionString: config.getOrThrow<string>('DATABASE_URL'),
          max: 5,
          connectionTimeoutMillis: 5000,
          query_timeout: 5000,
        },
        { schema: 'reporting' },
      ),
    });
  }

  // Lazy connection: NATS health checks process responsiveness, not database readiness.
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
