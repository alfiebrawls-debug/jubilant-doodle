import React from 'react';
import { Flame, Zap } from 'lucide-react';

/**
 * Full-card processing state: pulsing forge icon, staged narration from
 * the mock pipeline, and a gradient progress bar. Paid tiers see the
 * fast-lane badge (and genuinely shorter stage delays from the API).
 */
export default function ForgeLoader({ progress, fastLane = false }) {
  return (
    <div className="card relative flex flex-col items-center px-6 py-16 text-center">
      {fastLane && (
        <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-cyan/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-glow">
          <Zap size={11} /> Priority fast-lane
        </span>
      )}
      <div className="relative mb-8 grid h-20 w-20 place-items-center">
        <span className="absolute inset-0 rounded-full bg-violet/30 animate-pulse-ring" />
        <span
          className="absolute inset-0 rounded-full bg-cyan/20 animate-pulse-ring"
          style={{ animationDelay: '0.8s' }}
        />
        <div className="relative grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-violet to-cyan shadow-glow-violet">
          <Flame size={28} className="text-white" />
        </div>
      </div>

      <h3 className="text-lg font-bold text-white">Forging your clip package</h3>
      <p
        className="mt-1.5 h-5 text-sm text-slate-400 transition-opacity"
        aria-live="polite"
      >
        {progress.label}
      </p>

      <div className="mt-8 w-full max-w-sm">
        <div className="h-2 overflow-hidden rounded-full bg-space-700">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet to-cyan transition-all duration-500 ease-out"
            style={{ width: `${progress.pct}%` }}
          />
        </div>
        <p className="mt-2 text-right text-xs font-semibold text-cyan-glow">
          {progress.pct}%
        </p>
      </div>
    </div>
  );
}
