import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// This will be used by the app to connect to the DB
const sql = neon(import.meta.env.POSTGRES_URL || process.env.POSTGRES_URL);
export const db = drizzle(sql, { schema });
