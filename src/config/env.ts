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

export const env = EnvSchema.parse(process.env);

export const CACHE_TTL = parseInt(env.CACHE_TTL_SECONDS, 10);
