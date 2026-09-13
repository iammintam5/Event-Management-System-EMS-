import { copyFile, constants } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const folders = [
  '.',
  'apps/web',
  'apps/gateway',
  ...['identity', 'event', 'registration', 'operations', 'reporting'].map(
    (name) => `services/${name}-service`,
  ),
];
for (const folder of folders) {
  const source = fileURLToPath(new URL(`../${folder}/.env.example`, import.meta.url));
  const target = fileURLToPath(new URL(`../${folder}/.env`, import.meta.url));
  try {
    await copyFile(source, target, constants.COPYFILE_EXCL);
    console.log(`Created ${folder}/.env`);
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
    console.log(`Kept existing ${folder}/.env`);
  }
}
console.log(
  'Fill service DATABASE_URL and DIRECT_URL from Supabase; configure identity JWT secrets.',
);
