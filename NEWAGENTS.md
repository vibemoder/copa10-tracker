## NEWAGENTS.md

### Project: Copa10 Tracker

Copa10 Tracker is a modern web application designed to help football enthusiasts track their 2026 World Cup sticker collections. It provides a rich, FIFA-inspired user interface, personalized collection management, and unique features like anonymous proximity-based collector grouping. The application emphasizes a premium aesthetic, robust data handling, and seamless user experience.

### Technology Stack

*   **Frontend:** Astro (Framework), React (UI Components), Tailwind CSS (Styling)
*   **Backend:** Astro (API Routes), Drizzle ORM (Database Toolkit)
*   **Database:** PostgreSQL (specifically Neon Serverless Postgres)
*   **Authentication:** Clerk (User Management and Authentication)
*   **Deployment:** Vercel
*   **Data Enrichment:** Wikipedia API (Player Biographies, Images), FlagCDN (National Flags)
*   **Tooling:** TypeScript, dotenv, tsx

### Architectural Overview & Data Flow

The application follows a client-server architecture with a strong emphasis on modern web development practices:

1.  **Frontend (Astro/React):**
    *   Astro serves as the main framework, handling static site generation (SSG) for internationalization (`[lang]/index.astro`) and server-side rendering (SSR) for dynamic content.
    *   React components (`StickerCard.tsx`, `LocationSync.tsx`) provide interactive UI elements on the client-side.
    *   Tailwind CSS is used for rapid and consistent styling, achieving the desired FIFA "Ultimate Team" aesthetic.
    *   Internationalization is managed via `src/i18n/ui.ts` and `src/i18n/utils.ts`.

2.  **Authentication (Clerk):**
    *   Clerk handles user sign-in, sign-up, and session management.
    *   `src/middleware.ts` integrates Clerk's authentication globally.
    *   User `id` and `email` are available via `Astro.locals.auth()` on the server-side.

3.  **Database (PostgreSQL / Neon with Drizzle ORM):**
    *   Data is stored in a PostgreSQL database hosted by Neon, a serverless provider.
    *   Drizzle ORM (`drizzle-orm`) is used for type-safe database interactions.
    *   `src/db/schema.ts` defines the tables:
        *   `stickers`: Stores all sticker metadata, including player details (`height`, `club`, `socialInstagram`, `socialTwitter`, `marketValue`) and now an `imageUrl`.
        *   `profiles`: Stores user profiles linked to Clerk IDs, including approximate location (`lat`, `lng`, `city`) and `role` (USER/ADMIN).
        *   `collection`: A join table that tracks which user owns which sticker and in what `qty` (0=Missing, 1=Owned, >1=Duplicates).
        *   `transactions`: Records user actions related to stickers (e.g., `PACK_OPEN`, `SWAP`, `MANUAL`).
    *   `src/db/index.ts` establishes the database connection, with robust environment variable detection (`POSTGRES_URL`, `DATABASE_URL`, etc.).
    *   `src/db/utils.ts` contains utility functions like `syncUser` to keep Clerk profiles in sync with the local `profiles` table.

4.  **API Routes (Astro Endpoints):**
    *   `src/pages/api/collection.ts`: Handles user requests to update their sticker collection (increment, decrement, toggle ownership).
    *   `src/pages/api/stickers/update-image.ts`: A new endpoint designed to receive and persist image URLs for stickers in the `stickers` table. This is crucial for dynamically enriching the collection with player photos.

5.  **Data Population & Enrichment:**
    *   `src/scripts/stickers_seed.json`: The source of truth for all sticker data, including enriched player details. It acts as a fallback for the UI if the database is unreachable.
    *   `src/scripts/seed.ts`: A script to initially populate the database with sticker data, dummy user profiles, and dummy collection entries.
    *   **Dynamic Image Fetching:** The `StickerCard.tsx` component now actively queries the Wikipedia API for player biographies and, importantly, image URLs. If a `sticker.imageUrl` is not yet present in our database, it attempts to fetch one from Wikipedia and then sends it to `/api/stickers/update-image` to be saved for future use.

### Key Discoveries & Learnings

*   **Robust DB Connection:** The `src/db/index.ts` file includes resilient logic to find the database connection string from multiple environment variables, crucial for Vercel deployment flexibility.
*   **User Authentication Integration:** Clerk is deeply integrated, managing user sessions and providing `userId` across the frontend and backend for personalized data access.
*   **FIFA-Inspired UI:** The application uses Tailwind CSS extensively to deliver a polished, FIFA-like visual experience, including dynamic nation-themed headers and interactive sticker cards.
*   **Data Enrichment Workflow:** The combination of `StickerCard.tsx` making Wikipedia API calls and `api/stickers/update-image.ts` persisting the results creates a self-populating mechanism for player images and biographies.
*   **Per-User Collection:** The `collection` table and associated API ensure each user's collection is individually tracked, supporting missing, owned, and duplicate states with distinct visual feedback.
*   **Environment Variable Dependency:** Both `drizzle.config.ts` and `src/scripts/seed.ts` rely on `process.env.POSTGRES_URL` being correctly set. This was the cause of the recent `drizzle-kit push` failure.

### Proposed Next Steps

**Phase 1: Critical Infrastructure Fixes (Immediate Priority)**

1.  **Resolve `drizzle-kit push` Error:**
    *   **Action:** Investigate the `.env.local` file to ensure `POSTGRES_URL` is correctly defined and accessible for the `drizzle-kit` commands. If necessary, provide clear instructions for setting this environment variable.
    *   **Goal:** Successfully execute `drizzle-kit push` to apply the `imageUrl` field (and any other pending schema changes) to the database. This is foundational for image persistence.

**Phase 2: Data Enrichment & User Experience Refinements**

2.  **Continue Player Data Enrichment:**
    *   **Action:** Resume filling in `club`, `height`, `marketValue`, and `socialInstagram` for all remaining players in `src/scripts/stickers_seed.json` in batches (as previously planned). This will further enhance the player modal.
    *   **Goal:** Have comprehensive data for all players in the collection.

3.  **Implement "Trade Matcher" Feature:**
    *   **Action:** Develop an API route and frontend component to suggest sticker swaps based on a user's duplicates and missing stickers, potentially leveraging the "nearby collectors" feature.
    *   **Goal:** Enable users to find potential trades within their approximate geographical area, fostering community interaction.

4.  **Refine "Nearby Collectors" Display:**
    *   **Action:** Enhance the UI for displaying nearby collectors, potentially showing more detail or allowing interaction to initiate trades.
    *   **Goal:** Make the "Nearby" feature more actionable and engaging.

**Phase 3: Visual & Interactive Polish**

5.  **Implement FUT-style Clip-Path Shield:**
    *   **Action:** Apply the specialized CSS `clip-path` styling to `StickerCard.tsx` to give them a distinctive shield shape, aligning with the FIFA "Ultimate Team" aesthetic.
    *   **Goal:** Further elevate the visual appeal of the sticker cards.

6.  **Dashboard Enhancements:**
    *   **Action:** Review and add more dynamic elements or statistics to the main dashboard (`[lang]/index.astro`) to make it feel more "alive" and interactive.
    *   **Goal:** Improve the overall dashboard experience and user engagement.

By following these steps, we can systematically build upon the strong foundation of the Copa10 Tracker, delivering a feature-rich and visually stunning application.