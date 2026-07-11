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

- **Dashboard** — estimated views generated, editing hours saved, active projects, clips forged, plus a weekly output trend and recent-project list.
- **The Forge** — paste a URL or transcript, pick a voice (*Gen Z Viral*, *Corporate Professional*, *Storyteller*), and watch the staged forging pipeline run.
- **Output Studio** — split-screen view: timestamped script with visual cues and B-roll suggestions on the left; hook variations, three caption variants, and per-platform hashtags (TikTok / Reels / Shorts) on the right.
- **Export & Schedule** — copy the full package, export a PDF shot list (mocked), or queue the post across platforms (mocked).

## Architecture

```
src/
├── App.jsx                     # Shell: sidebar + topbar + active view
├── context/AppContext.jsx      # Global state (view, analytics, forge pipeline)
├── services/mockApi.js         # Mock backend — swap for fetch() when live
├── data/mockData.js            # Styles, templates, seed analytics/projects
└── components/
    ├── layout/                 # Sidebar (rail + mobile tabs), TopBar
    ├── ui/                     # CopyButton, SectionHeader
    ├── dashboard/              # Dashboard, StatCard, TrendChart, ProjectList
    ├── forge/                  # ForgeWorkspace, StyleSelector, ForgeLoader
    ├── studio/                 # OutputStudio, ScriptPanel, SocialPanel
    └── export/                 # ExportModal
```

**Stack:** React 18 · Vite · Tailwind CSS · lucide-react. State via hooks + a single context — no external state library needed at MVP scale.

**Design system:** deep space slate (`#0F172A`) base, electric violet (`#8B5CF6`) and neon cyan (`#06B6D4`) accents, gradient borders, glow shadows, and staged micro-animations.
