import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function testNeon() {
  const url = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  if (!url) {
    console.error('No URL found');
    return;
  }
  
  console.log('Testing Neon directly with URL:', url.split('@')[1]); // Log only the host part
  const sql = neon(url);
  try {
    const result = await sql`SELECT 1 as test`;
    console.log('Result:', result);
  } catch (e) {
    console.error('Neon test failed:', e);
  }
}

testNeon();
