import 'dotenv/config';
import process from 'process';
import { z } from 'zod';

const EnvSchema = z.object({
  PORT: z.string().default('3000'),
  MONGO_URI: z.string(),
  GEONAMES_USERNAME: z.string(),
  TFL_APP_KEY: z.string().optional(),
  CACHE_TTL_SECONDS: z.string().default('300')
});

const parsed = EnvSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('Invalid env:', parsed.error.flatten());
  process.exit(1);
}
export const env = parsed.data;
export const CACHE_TTL = parseInt(env.CACHE_TTL_SECONDS, 10);
