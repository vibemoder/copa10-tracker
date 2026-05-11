import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function checkConnection() {
  const { db } = await import('../db');
  const { sql } = await import('drizzle-orm');
  
  console.log('🔍 Checking database connection...');
  try {
    const result = await db.execute(sql`SELECT 1 as test`);
    console.log('✅ Database connection result:', JSON.stringify(result, null, 2));
    
    console.log('📋 Checking for profiles table...');
    const profilesResult = await db.execute(sql`SELECT count(*) FROM profiles`);
    console.log('Profiles count:', JSON.stringify(profilesResult, null, 2));
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
}

checkConnection();
