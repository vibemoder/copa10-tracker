# VibeGaming: Production Blueprint & Lifecycle

This document serves as the master record for the architectural evolution of **VibeGaming**—an ARPG Intelligence Hub built with Astro 6, React, and Clerk. This blueprint is designed for future agents to replicate or scale the platform with high-performance standards.

## 🚀 The 3-Sprint Lifecycle

### Sprint 1: Foundation (Astro 6 & i18n)
*   **Framework:** Astro 6.3.1 (Server-side rendering enabled).
*   **Integrations:** `@astrojs/react` for interactive islands, `@astrojs/vercel` for SSR.
*   **Aesthetic:** "Shadcn Zinc" neutral palette (Background: `#09090b`, Border: `#27272a`, Primary: `#e3b341`).
*   **i18n:** Custom dictionary-based localization system (EN, PT, ES) in `src/i18n/utils.ts`.
*   **Interactive Island:** `ARPGSelector.jsx` (React) for high-performance navigation.

### Sprint 2: The Video Funnel (Content & UI)
*   **Strategy:** Convert search traffic into YouTube viewers.
*   **Hero Section:** High-impact YouTube embed with custom "Glowing Avatar" CTA.
*   **Build Templates:** Dynamic routes `/[game]/builds/[build]` optimized for S-Tier guides.
*   **Optimization:** **Prerendering** enabled for all static content (`export const prerender = true;`) to achieve 100 Lighthouse scores while keeping Auth dynamic.

### Sprint 3: The Pro Release (Monetization & Security)
*   **SEO:** Dedicated `SEO.astro` component with JSON-LD (WebSite/Search) and OpenGraph support.
*   **Analytics:** Global GA4 integration via `GoogleAnalytics.astro`.
*   **Monetization:** AdSense readiness with `GoogleAdSense.astro` (Auto-ads) and `AdUnit.astro` (Manual slots).
*   **Auth:** Clerk integration for Google Authentication.
*   **Authorization:** Hard-coded Admin verification against `ca.imbriani@gmail.com`.

---

## 🛡️ Security Guardrails
1.  **Environment Variables:** Never commit secrets. Use `vercel env add` for `CLERK_SECRET_KEY` and `CLERK_PUBLISHABLE_KEY`.
2.  **Git Policy:** Ensure `.env` is in `.gitignore`. Use `.env.example` to document required keys.
3.  **Auth Lockdown:** Disable public sign-ups in Clerk Dashboard once the primary admin is registered.

---

## 📈 Performance & Scaling Checklist
- [ ] **Astro Prerendering:** Use `prerender = true` for articles/guides to maximize edge caching.
- [ ] **Image Optimization:** Use Astro `<Image />` component for automatic WebP/AVIF conversion.
- [ ] **Vercel Caching:** Use `vercel.json` to set `Cache-Control` for static assets (31536000s).
- [ ] **Clean Routes:** Enable `cleanUrls: true` in `vercel.json`.

---

## 🛠️ Replication Command Summary
```bash
# 1. Setup
npm install @clerk/astro @astrojs/react @astrojs/vercel

# 2. Deploy
vercel link --yes
vercel env add PUBLIC_CLERK_PUBLISHABLE_KEY production
vercel deploy --prod --yes

# 3. Sync
git add .
git commit -m "Sync"
gh repo create vibegaming --public --source=. --push
```

**Architect:** Gemini CLI Agent  
**Owner:** ca.imbriani@gmail.com  
**Project Site:** [vibegaming-five.vercel.app](https://vibegaming-five.vercel.app)
