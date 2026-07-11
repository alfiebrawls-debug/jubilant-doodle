import React from 'react';
import { Check } from 'lucide-react';
import { STYLES } from '../../data/mockData.js';

export default function StyleSelector({ selected, onSelect }) {
  return (
    <div role="radiogroup" aria-label="Script style" className="grid gap-3 sm:grid-cols-3">
      {STYLES.map((style) => {
        const active = selected === style.id;
        return (
          <button
            key={style.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onSelect(style.id)}
            className={`relative rounded-2xl border p-4 text-left transition-all duration-200 ${
              active
                ? 'border-violet/70 bg-violet/10 shadow-glow-violet'
                : 'border-white/10 bg-space-850/60 hover:border-white/25 hover:bg-space-850'
            }`}
          >
            {active && (
              <span className="absolute right-3 top-3 grid h-5 w-5 place-items-center rounded-full bg-violet text-white">
                <Check size={12} strokeWidth={3} />
              </span>
            )}
            <span className="text-2xl" aria-hidden>
              {style.emoji}
            </span>
            <p className="mt-2 text-sm font-bold text-white">{style.name}</p>
            <p className="mt-0.5 text-xs leading-relaxed text-slate-400">{style.tagline}</p>
          </button>
        );
      })}
    </div>
  );
}
