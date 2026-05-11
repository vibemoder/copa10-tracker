import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// List of possible environment variable names for the connection string
const possibleEnvVars = [
  'POSTGRES_URL',
  'DATABASE_URL',
  'copa10_POSTGRES_URL',
  'copa10_DATABASE_URL',
  'NEON_DATABASE_URL'
];

let connectionString = '';
let foundVarName = '';

// Check both import.meta.env and process.env
for (const envVar of possibleEnvVars) {
  const val = (import.meta.env as any)?.[envVar] || (process.env as any)?.[envVar];
  if (val && val.startsWith('postgres') && !val.includes('...')) {
    connectionString = val;
    foundVarName = envVar;
    break;
  }
}

const isValid = connectionString.length > 0;

if (!isValid) {
  console.warn('⚠️  DATABASE ERROR: No valid connection string found in environment variables.');
  console.log('Checked variables:', possibleEnvVars.join(', '));
} else {
  console.log(`✅ DATABASE: Connected using ${foundVarName}`);
}

// Resilient initialization
const sql = isValid ? neon(connectionString) : (async (strings: any, ...values: any[]) => {
    console.error('DATABASE ERROR: Attempted to query but no connection string is configured.');
    return []; // Return empty array to prevent map/reduce crashes
}) as any;

export const db = drizzle(sql, { schema });
