/**
 * Mock backend for ClipForge.
 *
 * Every function returns a Promise with realistic latency so the UI is
 * exercised exactly as it would be against a live API. Swap the internals
 * for fetch() calls when the real backend lands — the signatures stay.
 */

import {
  INITIAL_ANALYTICS,
  INITIAL_PROJECTS,
  SCRIPT_TEMPLATES,
  SOCIAL_TEMPLATES,
  PLATFORMS,
  PROCESSING_STAGES,
} from '../data/mockData.js';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Pull a human-readable topic out of a URL or a pasted text block. */
function extractTopic(input) {
  const trimmed = input.trim();

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const url = new URL(trimmed);
      // Prefer a descriptive slug wherever it lives: common id/slug query
      // params first (youtube-style ?v=), then the last path segment.
      const candidates = [
        url.searchParams.get('v'),
        url.searchParams.get('id'),
        url.pathname.split('/').filter(Boolean).pop(),
      ];
      for (const slug of candidates) {
        if (!slug) continue;
        const words = slug
          .replace(/[-_+]/g, ' ')
          .replace(/\.\w+$/, '')
          .replace(/\b(watch|videos?|episodes?|ep|v)\b/gi, '')
          .replace(/\s+/g, ' ')
          .trim();
        if (words.length > 2 && /[a-z]{3}/i.test(words)) return words.toLowerCase();
      }
      return 'your content';
    } catch {
      return 'your content';
    }
  }

  // Pasted text: take the strongest early phrase as the topic.
  const firstSentence = trimmed.split(/[.!?\n]/)[0] || trimmed;
  const words = firstSentence.split(/\s+/).filter((w) => w.length > 3);
  const topic = words.slice(0, 4).join(' ').toLowerCase();
  return topic || 'your content';
}

function estimateDuration(segmentCount) {
  // ~7–11s per segment keeps clips inside the 35–55s sweet spot.
  return segmentCount * 9;
}

function toTimestamp(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

let projectCounter = 100;

export const api = {
  /** GET /analytics */
  async fetchAnalytics() {
    await delay(400);
    return { ...INITIAL_ANALYTICS };
  },

  /** GET /projects */
  async fetchProjects() {
    await delay(550);
    return INITIAL_PROJECTS.map((p) => ({ ...p }));
  },

  /**
   * POST /forge
   * Generates the full clip package. Reports staged progress through
   * `onProgress({ pct, label })` so the loader can narrate the pipeline.
   * `priority` (paid tiers) runs the fast lane — in production this maps
   * to a higher-priority queue, here it just shortens the stage delays.
   */
  async forgeClipPackage({ input, styleId, priority = false, onProgress }) {
    const speed = priority ? 0.45 : 1;
    for (const stage of PROCESSING_STAGES) {
      onProgress?.(stage);
      await delay((420 + Math.random() * 380) * speed);
    }

    const topic = extractTopic(input);
    const script = SCRIPT_TEMPLATES[styleId];
    const social = SOCIAL_TEMPLATES[styleId];
    const totalDuration = estimateDuration(script.segments.length);
    const perSegment = totalDuration / script.segments.length;

    projectCounter += 1;

    return {
      id: `proj-${projectCounter}`,
      topic,
      styleId,
      createdAt: new Date().toISOString(),
      script: {
        title: script.hookLine(topic),
        durationSeconds: totalDuration,
        segments: script.segments.map((seg, i) => ({
          id: `seg-${i}`,
          label: seg.label,
          start: toTimestamp(i * perSegment),
          end: toTimestamp((i + 1) * perSegment),
          line: seg.line(topic),
          visual: seg.visual,
          broll: seg.broll,
        })),
      },
      social: {
        hooks: social.hooks.map((fn) => fn(topic)),
        captions: social.captions.map((fn) => fn(topic)),
        platforms: PLATFORMS.map((platform) => ({
          ...platform,
          hashtags: social.hashtags[platform.id],
        })),
      },
      projectedStats: {
        estimatedViews: 15_000 + Math.floor(Math.random() * 60_000),
        hoursSaved: +(2.5 + Math.random() * 2).toFixed(1),
        retentionScore: 82 + Math.floor(Math.random() * 15),
      },
    };
  },

  /** POST /export/pdf — returns a mock download descriptor. */
  async exportPdf(pkg) {
    await delay(1200);
    return {
      fileName: `clipforge-${pkg.id}-script.pdf`,
      sizeKb: 84 + Math.floor(Math.random() * 40),
      url: '#mock-download',
    };
  },

  /** POST /schedule — mocks queuing the post on connected platforms. */
  async schedulePost({ platformIds, scheduledFor }) {
    await delay(900);
    return {
      confirmationId: `sched-${Date.now().toString(36)}`,
      platformIds,
      scheduledFor,
      status: 'queued',
    };
  },
};
