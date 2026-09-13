import 'dotenv/config';
import { defineConfig } from 'prisma/config';

// validate/generate work without credentials. Migration commands require DIRECT_URL.
const directUrl = process.env.DIRECT_URL;
let datasource: { url: string } | undefined;
if (directUrl) {
  let url: URL;
  try {
    url = new URL(directUrl);
  } catch {
    throw new Error('Invalid DIRECT_URL');
  }
  if (!['postgres:', 'postgresql:'].includes(url.protocol))
    throw new Error('DIRECT_URL must use PostgreSQL');
  if (url.searchParams.has('schema') && url.searchParams.get('schema') !== 'operations') {
    throw new Error('DIRECT_URL must target the operations schema');
  }
  url.searchParams.set('schema', 'operations');
  datasource = { url: url.toString() };
}
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  ...(datasource ? { datasource } : {}),
});
