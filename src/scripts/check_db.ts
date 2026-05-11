import { db } from './src/db';
import { stickers } from './src/db/schema';
import { sql } from 'drizzle-orm';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function checkConnection() {
  console.log('🔍 Checking database connection...');
  try {
    const result = await db.execute(sql`SELECT 1`);
    console.log('✅ Database connection successful!');
    
    const stickerCount = await db.select({ count: sql`count(*)` }).from(stickers);
    console.log(`📊 Current sticker count in DB: ${stickerCount[0].count}`);
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
}

checkConnection();
