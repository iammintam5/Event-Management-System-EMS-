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
      SELECT EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'event') AS exists,
        has_schema_privilege(current_user, 'event', 'USAGE') AS allowed
    `;
    if (!rows[0]?.exists || !rows[0].allowed) throw new Error('Owned schema is unavailable');
    console.log('event: Prisma connection and owned schema access verified');
  } finally {
    await prisma.$disconnect();
  }
}
void check().catch(() => {
  console.error(
    'event: database check failed; verify environment, schema grants and connectivity.',
  );
  process.exitCode = 1;
});
