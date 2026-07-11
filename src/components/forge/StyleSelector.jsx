import React from 'react';
import { Check, Lock } from 'lucide-react';
import { STYLES } from '../../data/mockData.js';
import { useAuth } from '../../context/AuthContext.jsx';

/**
 * Style picker with tier gating: premium styles show a Pro lock for free
 * users and route the tap to the paywall instead of selecting.
 */
export default function StyleSelector({ selected, onSelect }) {
  const { canUseStyle, openPaywall } = useAuth();

  return (
    <div role="radiogroup" aria-label="Script style" className="grid gap-3 sm:grid-cols-2">
      {STYLES.map((style) => {
        const locked = !canUseStyle(style);
        const active = selected === style.id;
        return (
          <button
            key={style.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => (locked ? openPaywall('premium-style') : onSelect(style.id))}
            className={`relative rounded-2xl border p-4 text-left transition-all duration-200 ${
              active
                ? 'border-violet/70 bg-violet/10 shadow-glow-violet'
                : locked
                  ? 'border-white/5 bg-space-850/40 hover:border-violet/40'
                  : 'border-white/10 bg-space-850/60 hover:border-white/25 hover:bg-space-850'
            }`}
          >
            {active && (
              <span className="absolute right-3 top-3 grid h-5 w-5 place-items-center rounded-full bg-violet text-white">
                <Check size={12} strokeWidth={3} />
              </span>
            )}
            {locked && (
              <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-violet/25 to-cyan/25 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-violet-glow">
                <Lock size={10} /> Pro
              </span>
            )}
            <span className={`text-2xl ${locked ? 'opacity-50 grayscale' : ''}`} aria-hidden>
              {style.emoji}
            </span>
            <p className={`mt-2 text-sm font-bold ${locked ? 'text-slate-400' : 'text-white'}`}>
              {style.name}
            </p>
            <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{style.tagline}</p>
          </button>
        );
      })}
    </div>
  );
}
