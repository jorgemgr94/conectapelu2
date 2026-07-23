import { defineConfig } from 'drizzle-kit';
import { serverEnv } from './src/env/server';

export default defineConfig({
  schema: './src/db/schema',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: serverEnv.DATABASE_URL,
  },
});
