import type { APIRoute } from 'astro';
import { db } from '../../../db';
import { stickers } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import { isAdmin } from '../../../db/utils';

export const POST: APIRoute = async ({ request, locals }) => {
  // We check if the user is authenticated. 
  // For mass enrichment, we might allow any logged in user to contribute found URLs, 
  // or restricted to admins. Let's start with basic auth.
  const auth = typeof locals.auth === 'function' ? locals.auth() : (locals.auth as any);
  const userId = auth?.userId;
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { stickerId, imageUrl } = await request.json();

  if (!stickerId || !imageUrl) {
    return new Response('Invalid request', { status: 400 });
  }

  try {
    // Save the image URL to the stickers table
    await db.update(stickers)
      .set({ imageUrl })
      .where(eq(stickers.id, stickerId));

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating sticker image:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
};
