import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';

const root = new URL('../', import.meta.url);
const paths = ['.env', 'apps/api/.env', 'apps/web/.env.local'];
if (paths.some((path) => existsSync(new URL(path, root)))) {
  console.error(
    'Environment already exists. No files changed. Follow README to configure missing files manually.',
  );
  process.exit(1);
}
const password = randomBytes(24).toString('hex');
const rootEnv = readFileSync(new URL('.env.example', root), 'utf8').replace(
  'POSTGRES_PASSWORD=',
  `POSTGRES_PASSWORD=${password}`,
);
const apiEnv = readFileSync(new URL('apps/api/.env.example', root), 'utf8')
  .replace(
    'DATABASE_URL=',
    `DATABASE_URL=postgresql://ems:${password}@localhost:5432/ems?schema=public`,
  )
  .replace(
    'JWT_ACCESS_SECRET=',
    `JWT_ACCESS_SECRET=${randomBytes(48).toString('hex')}`,
  )
  .replace(
    'JWT_REFRESH_SECRET=',
    `JWT_REFRESH_SECRET=${randomBytes(48).toString('hex')}`,
  );
const webEnv = readFileSync(new URL('apps/web/.env.example', root), 'utf8');
[rootEnv, apiEnv, webEnv].forEach((content, index) =>
  writeFileSync(new URL(paths[index], root), content, {
    flag: 'wx',
    mode: 0o600,
  }),
);
console.log(
  'Local environment files created with random credentials. Values are not logged.',
);
