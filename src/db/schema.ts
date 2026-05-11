import { pgTable, integer, varchar, boolean, text, timestamp, unique, pgEnum } from 'drizzle-orm/pg-core';

export const stickers = pgTable('stickers', {
  id: integer('id').primaryKey(), // Sticker_No 1-980
  code: varchar('code', { length: 20 }).notNull().unique(), // Sticker_Code (FWC01, etc)
  name: varchar('name', { length: 255 }).notNull(), // Official_Name
  category: varchar('category', { length: 100 }), // Category (Opening, Team photo, Player)
  type: varchar('type', { length: 50 }), // Sticker_Type (special, player, etc)
  nation: varchar('nation', { length: 100 }), // Nation (e.g., 'Argentina', 'Brazil')
  group: varchar('group', { length: 10 }), // Group (A, B, C...)
  teamOrder: integer('team_order'), // Order within the team section
  isSpecial: boolean('is_special').default(false),
  
  // New Player Stats Fields
  height: varchar('height', { length: 20 }), // e.g., "1.85m"
  club: varchar('club', { length: 255 }), // e.g., "Inter Miami"
  socialInstagram: text('social_instagram'), // Link or handle
  socialTwitter: text('social_twitter'),
  marketValue: varchar('market_value', { length: 100 }), // Optional: "€100M"
});

export const userRoleEnum = pgEnum('user_role', ['USER', 'ADMIN']);

export const profiles = pgTable('profiles', {
  id: text('id').primaryKey(), // Clerk ID
  email: text('email').notNull(),
  role: userRoleEnum('role').default('USER').notNull(),
  lat: text('lat'), // Approximate latitude (string to avoid precision issues if needed, or just rounded)
  lng: text('lng'), // Approximate longitude
  city: varchar('city', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
  lastActive: timestamp('last_active').defaultNow(),
});

export const collection = pgTable('collection', {
  userId: text('user_id').references(() => profiles.id).notNull(),
  stickerId: integer('sticker_id').references(() => stickers.id).notNull(),
  qty: integer('qty').default(0).notNull(), // Supports 0 (Missing), 1 (Owned), >1 (Duplicates)
  updatedAt: timestamp('updated_at').defaultNow(),
}, (t) => ({
  unq: unique().on(t.userId, t.stickerId),
}));

export const typeEnum = pgEnum('transaction_type', ['PACK_OPEN', 'SWAP', 'MANUAL']);

export const transactions = pgTable('transactions', {
  id: text('id').primaryKey(), // UUID
  userId: text('user_id').references(() => profiles.id).notNull(),
  type: typeEnum('type').notNull(),
  stickerIds: integer('sticker_ids').array().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
