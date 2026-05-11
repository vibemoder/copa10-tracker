# Copa10 Development Roadmap

## Sprint 1: The Foundation (Data & Auth)
**Goal:** A functional landing page with a read-only list of all 980 stickers and user authentication.
*   [ ] Initialize Astro 6 + React + Tailwind + Drizzle ORM.
*   [ ] Provision Vercel Postgres (Neon) and define schema.
*   [ ] Create a Seeding Script to import all 980 stickers from the Excel file.
*   [ ] Integrate Clerk for Google Login.
*   [ ] **Validation:** I can log in and see a list of stickers (1-980) fetched from the DB.

## Sprint 2: The Tracker (Inventory & Progress)
**Goal:** Interactive "digital album" where users can mark stickers as owned.
*   [ ] Implement `StickerCard` with +/- buttons for quantity.
*   [ ] Create a real-time Progress Dashboard (Total %, Missing, Duplicates).
*   [ ] Build "Quick Filter" by Category (Opening, Teams, Specials).
*   [ ] Add "Batch Entry" mode (type sticker numbers to add them quickly).
*   [ ] **Validation:** I can mark sticker #10 as owned, refresh, and see it persisted.

## Sprint 3: The Social Release (Trading & Packs)
**Goal:** Tools for trading duplicates and simulating pack openings.
*   [ ] Generate a "Public Trade Link" (read-only view of my duplicates).
*   [ ] Build a "Pack Simulator" (Opening 8-sticker packs based on the LATAM model).
*   [ ] Implement "Trade Matcher" (Find users who have what I need).
*   [ ] Final SEO & Mobile Polish.
*   [ ] **Validation:** I can generate a link to show my friends which stickers I have for trade.
