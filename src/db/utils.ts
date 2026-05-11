import { db } from './index';
import { profiles } from './schema';
import { eq } from 'drizzle-orm';

export const isAdmin = (email: string | undefined) => email === 'ca.imbriani@gmail.com';

export async function syncUser(clerkUserId: string, email: string, referredBy?: string | null) {
  try {
    const role = isAdmin(email) ? 'ADMIN' : 'USER';

    const existingProfile = await db.query.profiles.findFirst({
        where: eq(profiles.id, clerkUserId),
    });

    if (!existingProfile) {
        await db.insert(profiles).values({
        id: clerkUserId,
        email: email,
        role: role,
        lastActive: new Date(),
        }).onConflictDoNothing();
    } else {
        await db.update(profiles)
        .set({ 
            lastActive: new Date(),
            role: role // Update role in case it was changed/set manually
        })
        .where(eq(profiles.id, clerkUserId));
    }
  } catch (e) {
      console.error('Database syncUser failed:', e);
  }
  
  return clerkUserId;
}
