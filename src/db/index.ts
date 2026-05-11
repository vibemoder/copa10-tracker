import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const connectionString = 
  import.meta.env?.POSTGRES_URL || 
  process.env?.POSTGRES_URL || 
  import.meta.env?.copa10_POSTGRES_URL || 
  process.env?.copa10_POSTGRES_URL;
const isValid = connectionString && !connectionString.includes('...') && connectionString.startsWith('postgres');

if (!isValid) {
  console.warn('⚠️  WARNING: POSTGRES_URL is missing or invalid. Database features will be unavailable.');
}

// We only initialize neon if we have a valid-looking URL to prevent the driver from crashing the server
const sql = isValid ? neon(connectionString) : ((() => {
    // Return a dummy function that throws a clear error only when called
    return async () => { throw new Error('Database connection is not configured.'); };
}) as any);

// Drizzle still needs an object
export const db = drizzle(sql, { schema });
