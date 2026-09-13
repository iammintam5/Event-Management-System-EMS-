import 'reflect-metadata';
import 'dotenv/config';
import { ConfigService } from '@nestjs/config';
import { validateEnvironment } from './config/environment.js';
import { PrismaService } from './prisma/prisma.service.js';

async function check() {
  const prisma = new PrismaService(new ConfigService(validateEnvironment(process.env)));
  try {
    await prisma.$connect();
    const rows = await prisma.$queryRaw<{ exists: boolean; allowed: boolean }[]>`
      SELECT EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'identity') AS exists,
        has_schema_privilege(current_user, 'identity', 'USAGE') AS allowed
    `;
    if (!rows[0]?.exists || !rows[0].allowed) throw new Error('Owned schema is unavailable');
    console.log('identity: Prisma connection and owned schema access verified');
  } finally {
    await prisma.$disconnect();
  }
}
void check().catch((err) => {
  console.error('identity: database check failed; verify environment, schema grants and connectivity.', err);
  process.exitCode = 1;
});
