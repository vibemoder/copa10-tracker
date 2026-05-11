import type { APIRoute } from 'astro';
import { db } from '../../db';
import { profiles } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { Client } from "@googlemaps/google-maps-services-js";

const client = new Client({});

export const POST: APIRoute = async ({ request, locals }) => {
  const auth = typeof locals.auth === 'function' ? locals.auth() : (locals.auth as any);
  const userId = auth?.userId;
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { lat, lng } = await request.json();

  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return new Response('Invalid coordinates', { status: 400 });
  }

  // Anonymize by rounding to 1 decimal place (~11km precision)
  const anonLat = lat.toFixed(1);
  const anonLng = lng.toFixed(1);

  let city = null;
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (apiKey) {
    try {
      const response = await client.reverseGeocode({
        params: {
          latlng: { lat, lng },
          key: apiKey,
          result_type: ['locality'],
        },
      });

      if (response.data.results.length > 0) {
        city = response.data.results[0].address_components.find(
          (c: any) => c.types.includes('locality')
        )?.long_name;
      }
    } catch (error) {
      console.error('Failed to reverse geocode:', error);
    }
  }

  try {
    await db.update(profiles)
      .set({ 
        lat: anonLat, 
        lng: anonLng, 
        city, 
        lastActive: new Date() 
      })
      .where(eq(profiles.id, userId));

    return new Response(JSON.stringify({ success: true, city }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating location:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
};
