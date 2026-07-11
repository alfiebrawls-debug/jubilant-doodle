# ClipForge ⚡

Turn long-form audio, video links, or raw text into **viral short-form video scripts** and complete **social media post packages** — in seconds.

## Quick start

```bash
npm install
cp .env.example .env   # Supabase URL + publishable key (demo values included)
npm run dev            # local dev server
npm run build          # production build
```

Auth and credit tracking run on **Supabase** (real database, RLS-enforced). Content generation still uses the mock API layer (`src/services/mockApi.js`) so no LLM keys are needed.

## Features

- **Auth & usage tracking (Supabase)** — real email/password sign-up with email confirmation; a database trigger provisions each account with exactly **1 forge credit**; sessions persist and auto-refresh.
- **Subscription tiers & paywall** — Free / Creator Pro ($19/mo, "Most Popular") / Agency Studio ($49/mo). A free user's second forge attempt — or a tap on a Pro-locked style — is intercepted by the pricing modal. Mock checkout upgrades the session and unlocks unlimited forges + fast-lane processing.
- **Dashboard** — estimated views generated, editing hours saved, active projects, clips forged, plus a weekly output trend and recent-project list.
- **The Forge** — paste a URL or transcript, pick a voice (*Gen Z Viral*, *Corporate Professional* free; *Storyteller*, *Hot Take* Pro), and watch the staged forging pipeline run. Paid tiers process ~2x faster.
- **Output Studio** — split-screen view: timestamped script with visual cues and B-roll suggestions on the left; hook variations, three caption variants, and per-platform hashtags (TikTok / Reels / Shorts) on the right.
- **Export & Schedule** — copy the full package, export a PDF shot list (mocked), or queue the post across platforms (mocked).

## Architecture

```
supabase/
└── migrations/                 # clipforge_profiles + credit RPCs (applied live)
src/
├── App.jsx                     # Shell: boot splash + auth gate + active view
├── lib/supabaseClient.js       # Supabase client init (env-driven)
├── context/
│   ├── AuthContext.jsx         # Session hydration, tier, credits, paywall state
│   └── AppContext.jsx          # View routing, analytics, forge pipeline
├── services/
│   ├── authService.js          # REAL: Supabase Auth + credit RPCs
│   ├── paymentService.js       # Mock checkout (→ Stripe / StoreKit / Play Billing)
│   └── mockApi.js              # Content generation (→ your API / LLM backend)
├── data/
│   ├── pricingData.js          # Tier definitions + entitlement helpers
│   └── mockData.js             # Styles (tier-gated), templates, seed data
└── components/
    ├── auth/                   # AuthScreen (sign up / sign in / confirm email)
    ├── paywall/                # PricingModal (3-tier, interception aware)
    ├── layout/                 # Sidebar (rail + mobile tabs), TopBar
    ├── ui/                     # CopyButton, SectionHeader
    ├── dashboard/              # Dashboard, StatCard, TrendChart, ProjectList
    ├── forge/                  # ForgeWorkspace, StyleSelector, ForgeLoader
    ├── studio/                 # OutputStudio, ScriptPanel, SocialPanel
    └── export/                 # ExportModal
```

**Stack:** React 18 · Vite · Tailwind CSS · lucide-react · @supabase/supabase-js. State via hooks + two contexts (auth/entitlements and app).

## Security model (credits can't be cheated)

- `clipforge_profiles` has RLS enabled with a **select-own-row policy only** — there are no client insert/update/delete policies at all.
- Credits change exclusively through `SECURITY DEFINER` functions: `consume_forge_credit()` performs the check and the debit in **one guarded UPDATE**, so it's atomic under concurrent requests and the client can never mint credits. `refund_forge_credit()` compensates failed forges.
- New accounts get their profile row (with 1 free credit) from an `auth.users` trigger — clients never create profiles.
- Client-side tier checks (locked styles, credit chips) are UX sugar; the database is the authority.

**Before launch:** revoke `demo_upgrade_tier()` — it exists so the paywall demo completes without a billing backend. Replace it with a Stripe / App Store webhook that updates `tier_id` using the `service_role` key (see comments in `paymentService.js` and the migration).

**Design system:** deep space slate (`#0F172A`) base, electric violet (`#8B5CF6`) and neon cyan (`#06B6D4`) accents, gradient borders, glow shadows, and staged micro-animations.
