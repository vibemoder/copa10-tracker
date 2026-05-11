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
    // 1. Seed Stickers
    for (let i = 0; i < stickerData.length; i += 100) {
      const batch = stickerData.slice(i, i + 100);
      await db.insert(schema.stickers).values(batch).onConflictDoNothing();
      console.log(`✅ Seeded ${Math.min(i + 100, stickerData.length)}/${stickerData.length} stickers`);
    }

    // 2. Seed Dummy Profiles (Nearby)
    // Using -21.3, -50.3 as a base (from the user's provided template area)
    console.log('⏳ Seeding dummy collectors...');
    const dummyProfiles = Array.from({ length: 5 }).map((_, i) => ({
      id: `dummy_user_${i}`,
      email: `collector_${i}@example.com`,
      lat: '-21.3', // Everyone in the same 0.1 degree grid
      lng: '-50.3',
      city: 'Birigui',
      lastActive: new Date(),
    }));

    await db.insert(schema.profiles).values(dummyProfiles).onConflictDoUpdate({
      target: [schema.profiles.id],
      set: { lastActive: new Date() }
    });

    // 3. Seed Dummy Collections (Give them some duplicates)
    console.log('⏳ Seeding dummy collections...');
    for (const profile of dummyProfiles) {
      const dummyStickers = Array.from({ length: 20 }).map(() => ({
        userId: profile.id,
        stickerId: Math.floor(Math.random() * 980) + 1,
        qty: Math.floor(Math.random() * 3) + 1, // 1 to 3 stickers
      }));
      await db.insert(schema.collection).values(dummyStickers).onConflictDoNothing();
    }

    console.log('🚀 Database seeded with stickers and 5 nearby collectors!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();
