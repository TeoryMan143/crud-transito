import postgres from 'https://deno.land/x/postgresjs@v3.4.3/mod.js';
import { env } from '../core/utils.ts';

const sql = postgres({
  host: env.DATABASE_HOST,
  port: parseInt(env.DATABASE_PORT),
  db: env.DATABASE_NAME,
  user: env.DATABASE_USER,
  pass: env.DATABASE_PASS,
  ssl: true,
});

export default sql;
