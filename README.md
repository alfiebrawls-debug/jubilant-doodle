# ClipForge ⚡

Turn long-form audio, video links, or raw text into **viral short-form video scripts** and complete **social media post packages** — in seconds.

## Quick start

```bash
npm install
npm run dev      # local dev server
npm run build    # production build
```

The MVP ships with a **mock API layer** (`src/services/mockApi.js`) so the entire app is interactive in the browser with zero API keys. Every service call returns a Promise with realistic latency and staged progress events, so swapping in the live backend is a drop-in change.

## Features

- **Auth & usage tracking** — mock email sign-in creates a Free account with exactly **1 forge credit**; session persists in localStorage.
- **Subscription tiers & paywall** — Free / Creator Pro ($19/mo, "Most Popular") / Agency Studio ($49/mo). A free user's second forge attempt — or a tap on a Pro-locked style — is intercepted by the pricing modal. Mock checkout upgrades the session and unlocks unlimited forges + fast-lane processing.
- **Dashboard** — estimated views generated, editing hours saved, active projects, clips forged, plus a weekly output trend and recent-project list.
- **The Forge** — paste a URL or transcript, pick a voice (*Gen Z Viral*, *Corporate Professional* free; *Storyteller*, *Hot Take* Pro), and watch the staged forging pipeline run. Paid tiers process ~2x faster.
- **Output Studio** — split-screen view: timestamped script with visual cues and B-roll suggestions on the left; hook variations, three caption variants, and per-platform hashtags (TikTok / Reels / Shorts) on the right.
- **Export & Schedule** — copy the full package, export a PDF shot list (mocked), or queue the post across platforms (mocked).

## Architecture

```
src/
├── App.jsx                     # Shell: auth gate + sidebar + topbar + active view
├── context/
│   ├── AuthContext.jsx         # Session, tier, credits, paywall state
│   └── AppContext.jsx          # View routing, analytics, forge pipeline
├── services/                   # ── swap these for production backends ──
│   ├── authService.js          # Identity + credits (→ Supabase/Firebase auth)
│   ├── paymentService.js       # Checkout (→ Stripe / StoreKit / Play Billing)
│   └── mockApi.js              # Content generation (→ your API / LLM backend)
├── data/
│   ├── pricingData.js          # Tier definitions + entitlement helpers
│   └── mockData.js             # Styles (tier-gated), templates, seed data
└── components/
    ├── auth/                   # AuthScreen (signed-out gate)
    ├── paywall/                # PricingModal (3-tier, interception aware)
    ├── layout/                 # Sidebar (rail + mobile tabs), TopBar
    ├── ui/                     # CopyButton, SectionHeader
    ├── dashboard/              # Dashboard, StatCard, TrendChart, ProjectList
    ├── forge/                  # ForgeWorkspace, StyleSelector, ForgeLoader
    ├── studio/                 # OutputStudio, ScriptPanel, SocialPanel
    └── export/                 # ExportModal
```

**Stack:** React 18 · Vite · Tailwind CSS · lucide-react. State via hooks + two contexts (auth/entitlements and app) — no external state library needed at this scale.

**Going to production:** the three files in `src/services/` are the entire backend surface. Each carries an integration map in its header comment (Supabase/Firebase for auth + credits, Stripe Checkout for web billing, StoreKit 2 / Play Billing via RevenueCat for App Store builds). Client-side tier checks are UX only — entitlements and credit decrements must be enforced server-side (RLS + edge functions or callable functions), with billing fulfillment driven by provider webhooks, never the browser.

**Design system:** deep space slate (`#0F172A`) base, electric violet (`#8B5CF6`) and neon cyan (`#06B6D4`) accents, gradient borders, glow shadows, and staged micro-animations.
