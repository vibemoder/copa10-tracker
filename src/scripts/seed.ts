import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../db/schema';
import stickerData from './stickers_seed.json';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function seed() {
  if (!process.env.POSTGRES_URL) {
    throw new Error('POSTGRES_URL is not set in .env.local');
  }

  const sql = neon(process.env.POSTGRES_URL);
  const db = drizzle(sql, { schema });

  console.log('⏳ Seeding stickers...');

  try {
    // Insert in batches of 100 to avoid request size limits
    for (let i = 0; i < stickerData.length; i += 100) {
      const batch = stickerData.slice(i, i + 100);
      await db.insert(schema.stickers).values(batch).onConflictDoNothing();
      console.log(`✅ Seeded ${Math.min(i + 100, stickerData.length)}/${stickerData.length} stickers`);
    }

    console.log('🚀 Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();
