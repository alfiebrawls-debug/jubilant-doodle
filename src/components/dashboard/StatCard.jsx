import React from 'react';

/**
 * Headline metric tile. Numbers stay in text ink; the icon chip carries
 * the accent so the tile reads at a glance without color-coded text.
 */
export default function StatCard({ icon: Icon, label, value, hint, accent = 'violet' }) {
  const chip =
    accent === 'cyan'
      ? 'bg-cyan/15 text-cyan-glow'
      : 'bg-violet/15 text-violet-glow';

  return (
    <div className="card group p-5 transition-transform duration-200 hover:-translate-y-0.5">
      <div className="flex items-start justify-between">
        <div className={`grid h-10 w-10 place-items-center rounded-xl ${chip}`}>
          <Icon size={18} />
        </div>
        {hint && (
          <span className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] font-medium text-slate-400">
            {hint}
          </span>
        )}
      </div>
      <p className="mt-4 text-3xl font-bold tracking-tight text-white">{value}</p>
      <p className="mt-1 text-sm text-slate-400">{label}</p>
    </div>
  );
}
