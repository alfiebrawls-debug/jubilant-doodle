import React from 'react';
import { Clock, Camera, Film } from 'lucide-react';
import CopyButton from '../ui/CopyButton.jsx';

const LABEL_COLORS = {
  HOOK: 'bg-violet/20 text-violet-glow',
  'COLD OPEN': 'bg-violet/20 text-violet-glow',
  CTA: 'bg-cyan/20 text-cyan-glow',
  'RESOLUTION + CTA': 'bg-cyan/20 text-cyan-glow',
};

/** Serialize the script for one-click copy / export. */
export function scriptToText(script) {
  return [
    script.title,
    '',
    ...script.segments.map(
      (s) =>
        `[${s.start}–${s.end}] ${s.label}\n${s.line}\nVISUAL: ${s.visual}\nB-ROLL: ${s.broll.join(' · ')}`
    ),
  ].join('\n\n');
}

export default function ScriptPanel({ script }) {
  return (
    <section className="card flex flex-col overflow-hidden">
      <header className="flex items-center justify-between gap-3 border-b border-white/5 px-5 py-4">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-violet-glow">
            Clip Script
          </p>
          <h3 className="truncate text-sm font-bold text-white">{script.title}</h3>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1 text-xs text-slate-400">
            <Clock size={12} /> {script.durationSeconds}s
          </span>
          <CopyButton text={scriptToText(script)} />
        </div>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto p-5">
        {script.segments.map((segment, i) => (
          <article
            key={segment.id}
            className="relative rounded-xl border border-white/5 bg-space-900/60 p-4 animate-fade-up"
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-semibold text-cyan-glow">
                {segment.start} – {segment.end}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide ${
                  LABEL_COLORS[segment.label] ?? 'bg-white/10 text-slate-300'
                }`}
              >
                {segment.label}
              </span>
            </div>

            <p className="text-sm font-medium leading-relaxed text-slate-100">
              “{segment.line}”
            </p>

            <div className="mt-3 space-y-1.5 border-t border-white/5 pt-3 text-xs text-slate-400">
              <p className="flex items-start gap-2">
                <Camera size={13} className="mt-0.5 shrink-0 text-violet-glow" />
                <span>
                  <span className="font-semibold text-slate-300">Visual: </span>
                  {segment.visual}
                </span>
              </p>
              <p className="flex items-start gap-2">
                <Film size={13} className="mt-0.5 shrink-0 text-cyan-glow" />
                <span>
                  <span className="font-semibold text-slate-300">B-roll: </span>
                  {segment.broll.join(' · ')}
                </span>
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
