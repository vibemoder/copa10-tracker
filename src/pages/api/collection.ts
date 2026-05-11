import type { APIRoute } from 'astro';
import { db } from '../../db';
import { collection } from '../../db/schema';
import { and, eq, sql } from 'drizzle-orm';

export const POST: APIRoute = async ({ request, locals }) => {
  const auth = typeof locals.auth === 'function' ? locals.auth() : (locals.auth as any);
  const userId = auth?.userId;
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { stickerId, action } = await request.json();

  if (!stickerId || !['inc', 'dec', 'toggle'].includes(action)) {
    return new Response('Invalid request', { status: 400 });
  }

  try {
    if (action === 'inc') {
      await db.insert(collection)
        .values({ userId, stickerId, qty: 1 })
        .onConflictDoUpdate({
          target: [collection.userId, collection.stickerId],
          set: { qty: sql`${collection.qty} + 1`, updatedAt: new Date() },
        });
    } else if (action === 'dec') {
      await db.update(collection)
        .set({ qty: sql`GREATEST(0, ${collection.qty} - 1)`, updatedAt: new Date() })
        .where(and(eq(collection.userId, userId), eq(collection.stickerId, stickerId)));
    } else if (action === 'toggle') {
        const existing = await db.query.collection.findFirst({
            where: and(eq(collection.userId, userId), eq(collection.stickerId, stickerId))
        });
        
        if (!existing || existing.qty === 0) {
            await db.insert(collection)
                .values({ userId, stickerId, qty: 1 })
                .onConflictDoUpdate({
                    target: [collection.userId, collection.stickerId],
                    set: { qty: 1, updatedAt: new Date() }
                });
        } else {
            await db.update(collection)
                .set({ qty: 0, updatedAt: new Date() })
                .where(and(eq(collection.userId, userId), eq(collection.stickerId, stickerId)));
        }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating collection:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
};
