import { db } from './index';
import { profiles } from './schema';
import { eq } from 'drizzle-orm';

export async function syncUser(clerkUserId: string, email: string) {
  try {
    const existingProfile = await db.query.profiles.findFirst({
        where: eq(profiles.id, clerkUserId),
    });

    if (!existingProfile) {
        await db.insert(profiles).values({
        id: clerkUserId,
        email: email,
        lastActive: new Date(),
        }).onConflictDoNothing();
    } else {
        await db.update(profiles)
        .set({ lastActive: new Date() })
        .where(eq(profiles.id, clerkUserId));
    }
  } catch (e) {
      console.error('Database syncUser failed:', e);
  }
  
  return clerkUserId;
}
