import { clerkMiddleware } from '@clerk/astro/server';

export const onRequest = (context: any, next: any) => {
    console.log('--- Middleware Request:', context.url.pathname);
    try {
        return clerkMiddleware()(context, next);
    } catch (e) {
        console.error('--- Middleware CRASH:', e);
        return next();
    }
};
