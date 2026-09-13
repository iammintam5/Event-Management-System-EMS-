import type { NextConfig } from 'next';
import { z } from 'zod';

const parsed = z.url({ protocol: /^https?$/ }).safeParse(process.env.NEXT_PUBLIC_API_URL);
if (!parsed.success)
  throw new Error(
    'NEXT_PUBLIC_API_URL must be a valid HTTP(S) URL. Copy apps/web/.env.example to .env.',
  );

const config: NextConfig = { transpilePackages: ['@ems/shared'] };
export default config;
