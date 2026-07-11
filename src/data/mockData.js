/**
 * Static mock data for ClipForge.
 * In production this is replaced by real API responses — the shapes here
 * define the contract the UI is built against.
 */

/**
 * `minTier` gates each style: 'free' styles are available to everyone,
 * 'pro' styles require Creator Pro or above (enforced in the UI and
 * re-checked in the forge pipeline — in production, also server-side).
 */
export const STYLES = [
  {
    id: 'genz',
    name: 'Gen Z Viral',
    tagline: 'Fast cuts, bold hooks, zero fluff',
    emoji: '⚡',
    accent: 'violet',
    tone: 'punchy, meme-aware, high-energy',
    minTier: 'free',
  },
  {
    id: 'corporate',
    name: 'Corporate Professional',
    tagline: 'Authority, clarity, credibility',
    emoji: '💼',
    accent: 'cyan',
    tone: 'polished, confident, data-backed',
    minTier: 'free',
  },
  {
    id: 'storyteller',
    name: 'Storyteller',
    tagline: 'Narrative arcs that hold attention',
    emoji: '🎬',
    accent: 'violet',
    tone: 'warm, cinematic, suspense-driven',
    minTier: 'pro',
  },
  {
    id: 'hottake',
    name: 'Hot Take',
    tagline: 'Contrarian energy that sparks comments',
    emoji: '🔥',
    accent: 'cyan',
    tone: 'provocative, debate-bait, confident',
    minTier: 'pro',
  },
];

export const PLATFORMS = [
  { id: 'tiktok', name: 'TikTok', maxCaption: 150 },
  { id: 'reels', name: 'Reels', maxCaption: 125 },
  { id: 'shorts', name: 'Shorts', maxCaption: 100 },
];

export const INITIAL_ANALYTICS = {
  estimatedViewsSaved: 248_500,
  hoursSaved: 37.5,
  activeProjects: 4,
  clipsForged: 23,
  weeklyTrend: [12, 19, 14, 27, 31, 26, 38],
};

export const INITIAL_PROJECTS = [
  {
    id: 'proj-001',
    title: 'Podcast Ep. 42 — Founder Burnout',
    source: 'youtube.com/watch?v=ep42',
    style: 'storyteller',
    status: 'ready',
    clips: 6,
    createdAt: '2026-07-08T14:22:00Z',
  },
  {
    id: 'proj-002',
    title: 'Q2 Product Keynote',
    source: 'Pasted transcript · 8,400 words',
    style: 'corporate',
    status: 'ready',
    clips: 4,
    createdAt: '2026-07-06T09:10:00Z',
  },
  {
    id: 'proj-003',
    title: 'Gym Habits Interview',
    source: 'spotify.com/episode/gymhabits',
    style: 'genz',
    status: 'processing',
    clips: 0,
    createdAt: '2026-07-10T18:45:00Z',
  },
  {
    id: 'proj-004',
    title: 'Cooking Stream Highlights',
    source: 'twitch.tv/videos/99182',
    style: 'genz',
    status: 'draft',
    clips: 0,
    createdAt: '2026-07-10T21:02:00Z',
  },
];

/**
 * Script + social templates, keyed by style. The mock API stitches these
 * with the user's topic to produce deterministic-but-believable output.
 */
export const SCRIPT_TEMPLATES = {
  genz: {
    hookLine: (topic) => `STOP scrolling — nobody is talking about ${topic} like this 💀`,
    segments: [
      {
        label: 'HOOK',
        visual: 'Hard zoom-in on face, bold caption overlay, red flash frame',
        broll: ['Screen-record of viral comment section', 'Rapid 3-cut montage of the topic'],
        line: (topic) => `POV: you just found out the truth about ${topic} and your whole feed is lying to you.`,
      },
      {
        label: 'TENSION',
        visual: 'Whip-pan transition, on-screen text pops word-by-word',
        broll: ['Stock clip: shocked reaction', 'Meme cutaway (2 frames max)'],
        line: () => `Everyone's doing it wrong. Like, EVERYONE. And it's costing you views every single day.`,
      },
      {
        label: 'VALUE DROP',
        visual: 'Jump-cut list format, numbered captions slam in from left',
        broll: ['Fast screen capture of the 3-step process', 'Progress bar animation'],
        line: (topic) => `Here's the 3-step cheat code: clip the moment, front-load the payoff, and let ${topic} do the heavy lifting.`,
      },
      {
        label: 'PAYOFF',
        visual: 'Slow push-in, lo-fi beat drops out for emphasis',
        broll: ['Before/after split screen', 'Analytics graph going vertical'],
        line: () => `I did this for 30 days and my reach went up 400%. Receipts on screen. No gatekeeping.`,
      },
      {
        label: 'CTA',
        visual: 'Direct-to-camera, caption: "SAVE THIS", pointing gesture',
        broll: ['Follow-button animation overlay'],
        line: () => `Save this before it gets buried. Follow for part 2 — it's even crazier.`,
      },
    ],
  },
  corporate: {
    hookLine: (topic) => `The data on ${topic} that most leaders overlook`,
    segments: [
      {
        label: 'HOOK',
        visual: 'Clean centered title card, subtle slide-up animation',
        broll: ['Boardroom establishing shot', 'Animated stat counter'],
        line: (topic) => `73% of teams underinvest in ${topic} — and it shows up directly in their bottom line.`,
      },
      {
        label: 'CONTEXT',
        visual: 'Speaker medium shot, lower-third with name and title',
        broll: ['Chart animation: market trend line', 'Office b-roll, shallow depth of field'],
        line: () => `Over the last two quarters we studied what separates the top performers from everyone else.`,
      },
      {
        label: 'INSIGHT',
        visual: 'Split screen: speaker + key quote typography',
        broll: ['Whiteboard sketch timelapse', 'Product UI walkthrough'],
        line: (topic) => `The single highest-leverage move: treat ${topic} as a system, not a side project. Measure it weekly.`,
      },
      {
        label: 'PROOF',
        visual: 'Full-screen data visualization, brand palette',
        broll: ['Customer logo wall', 'Testimonial pull-quote card'],
        line: () => `Teams that adopted this framework saw a 2.4x improvement in ninety days — consistently, across industries.`,
      },
      {
        label: 'CTA',
        visual: 'Return to speaker, end-card with logo and one-line takeaway',
        broll: ['Subscribe/connect end-card animation'],
        line: () => `The full breakdown is in the report linked below. Follow for weekly, data-backed insights.`,
      },
    ],
  },
  storyteller: {
    hookLine: (topic) => `I almost gave up on ${topic}. Then one moment changed everything.`,
    segments: [
      {
        label: 'COLD OPEN',
        visual: 'Mid-action clip from the climax, cut to black, title fades in',
        broll: ['Atmospheric slow-motion detail shot', 'Ambient location footage'],
        line: (topic) => `This is the story of how ${topic} nearly broke me — and why I'd do it all again.`,
      },
      {
        label: 'SETUP',
        visual: 'Warm color grade, slow dolly-in, soft piano underneath',
        broll: ['Archival photo pan', 'Hands-at-work close-up'],
        line: () => `Two years ago I had no audience, no plan, and exactly one conviction I couldn't shake.`,
      },
      {
        label: 'CONFLICT',
        visual: 'Faster cuts, music tension rises, desaturated grade',
        broll: ['Rain-on-window mood shot', 'Empty room, single light source'],
        line: () => `Then everything that could go wrong, did. The launch flopped. The inbox went silent for weeks.`,
      },
      {
        label: 'TURN',
        visual: 'Single unbroken take, music drops to silence before the line',
        broll: ['Sunrise timelapse', 'Notification screen lighting up'],
        line: (topic) => `One message from a stranger changed how I saw ${topic} forever: "This is exactly what I needed."`,
      },
      {
        label: 'RESOLUTION + CTA',
        visual: 'Montage of wins, grade returns to warm, logo end-card',
        broll: ['Community collage grid', 'Handwritten thank-you note insert'],
        line: () => `If you're in the silent stretch right now — keep going. Follow along, the next chapter is yours too.`,
      },
    ],
  },
  hottake: {
    hookLine: (topic) => `Unpopular opinion: everything you know about ${topic} is backwards`,
    segments: [
      {
        label: 'HOOK',
        visual: 'Direct-to-camera, eyebrow raise, caption slams in: "UNPOPULAR OPINION"',
        broll: ['Record-scratch freeze frame', 'Comment section screenshot with hot replies'],
        line: (topic) => `Hot take: ${topic} is completely overrated — and I can prove it in 40 seconds.`,
      },
      {
        label: 'STAKE',
        visual: 'Lean-in shot, tempo of cuts increases, ticking clock SFX',
        broll: ['Montage of everyone doing the "normal" way', 'Red X overlay animation'],
        line: () => `Everyone parrots the same advice. Nobody stops to ask if it actually works anymore.`,
      },
      {
        label: 'EVIDENCE',
        visual: 'Split screen: claim vs. receipt, numbers punch in one by one',
        broll: ['Screenshot of the data', 'Green checkmark counter animation'],
        line: (topic) => `I tested the opposite approach to ${topic} for 30 days. The results embarrassed the conventional wisdom.`,
      },
      {
        label: 'FLIP',
        visual: 'Camera pushes in, music cuts, dead-serious delivery',
        broll: ['Slow-motion reaction shot', 'Before/after metric card'],
        line: () => `So here's the uncomfortable part: the "wrong" way outperformed by 3x. Sit with that.`,
      },
      {
        label: 'CTA',
        visual: 'Smirk to camera, caption: "FIGHT ME IN THE COMMENTS"',
        broll: ['Comment bubble animation raining down'],
        line: () => `Disagree? Good. Tell me why in the comments — best counter-argument gets pinned.`,
      },
    ],
  },
};

export const SOCIAL_TEMPLATES = {
  genz: {
    hooks: [
      (topic) => `nobody: … me at 3am researching ${topic} 💀`,
      (topic) => `the ${topic} hack they don't want you to know (fr)`,
      (topic) => `rating ${topic} takes until one makes me lose it`,
    ],
    captions: [
      (topic) => `bestie wake up, new ${topic} strategy just dropped 🔥 watch till the end, the last one is illegal levels of useful`,
      (topic) => `POV: your ${topic} game after this video vs before. it's giving glow-up ✨ save it, thank me later`,
      (topic) => `not me casually dropping the entire ${topic} playbook for free… anyway part 2 tomorrow if this hits 10k 👀`,
    ],
    hashtags: {
      tiktok: ['#fyp', '#viral', '#learnontiktok', '#creatortips', '#contentstrategy'],
      reels: ['#reels', '#explorepage', '#contentcreator', '#growthhacks', '#reelsviral'],
      shorts: ['#shorts', '#viralshorts', '#howto', '#creator'],
    },
  },
  corporate: {
    hooks: [
      (topic) => `The ${topic} framework top-performing teams use`,
      (topic) => `We analyzed 200 companies' approach to ${topic}. Here's what works.`,
      (topic) => `Your competitors are already doing this with ${topic}`,
    ],
    captions: [
      (topic) => `Three data-backed moves that transform how teams approach ${topic}. Number two is the one most leaders skip. Full report linked in bio.`,
      (topic) => `We turned 6 months of research on ${topic} into a 45-second breakdown. Share this with the colleague who needs it.`,
      (topic) => `${topic}, distilled: measure weekly, systematize early, and iterate in public. More frameworks every Tuesday.`,
    ],
    hashtags: {
      tiktok: ['#businesstok', '#leadership', '#b2b', '#worksmarter', '#industryinsights'],
      reels: ['#business', '#entrepreneur', '#leadership', '#professionaldevelopment'],
      shorts: ['#business', '#productivity', '#leadership'],
    },
  },
  storyteller: {
    hooks: [
      (topic) => `I almost quit ${topic}. This is what kept me going.`,
      (topic) => `The ${topic} story I've never told publicly`,
      (topic) => `One message changed my entire ${topic} journey`,
    ],
    captions: [
      (topic) => `Every ${topic} journey has a silent stretch where nothing seems to work. This is the story of mine — and the moment it turned. 🎬`,
      (topic) => `They only see the highlight reel. Here's the honest version of my ${topic} story, chapter by chapter.`,
      (topic) => `If you're in the messy middle of ${topic} right now, this one's for you. Keep going. 💜`,
    ],
    hashtags: {
      tiktok: ['#storytime', '#journey', '#motivation', '#creatorstory', '#keepgoing'],
      reels: ['#storytelling', '#behindthescenes', '#creatorlife', '#inspiration'],
      shorts: ['#story', '#motivation', '#journey'],
    },
  },
  hottake: {
    hooks: [
      (topic) => `unpopular opinion: ${topic} is overrated and here's the receipts`,
      (topic) => `everyone is wrong about ${topic}. yes, including you.`,
      (topic) => `I said what I said about ${topic} 🔥`,
    ],
    captions: [
      (topic) => `Hot take incoming: the standard advice on ${topic} stopped working years ago. I tested the opposite for 30 days — receipts in the video. Fight me in the comments 🔥`,
      (topic) => `This ${topic} opinion got me blocked by three gurus. Watch before it gets taken down 👀 best counter-argument gets pinned.`,
      (topic) => `POV: you finally hear the ${topic} truth nobody with a course to sell will say out loud. Save this before you disagree.`,
    ],
    hashtags: {
      tiktok: ['#hottake', '#unpopularopinion', '#debate', '#realtalk', '#fyp'],
      reels: ['#hottake', '#controversial', '#realtalk', '#explorepage'],
      shorts: ['#hottake', '#debate', '#truth'],
    },
  },
};

export const PROCESSING_STAGES = [
  { pct: 12, label: 'Ingesting source content…' },
  { pct: 30, label: 'Transcribing & detecting key moments…' },
  { pct: 52, label: 'Scoring hooks for retention…' },
  { pct: 74, label: 'Forging script & visual cues…' },
  { pct: 90, label: 'Packaging captions & hashtags…' },
  { pct: 100, label: 'Done — clip package ready ✨' },
];
