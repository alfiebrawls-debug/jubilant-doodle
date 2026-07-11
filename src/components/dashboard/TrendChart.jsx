import React, { useState } from 'react';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/**
 * Single-series weekly bar sparkline. One hue (brand violet, validated
 * against the dark surface), per-bar hover tooltip, recessive baseline.
 */
export default function TrendChart({ data }) {
  const [hovered, setHovered] = useState(null);
  const max = Math.max(...data, 1);

  return (
    <div>
      <div className="flex h-36 items-end gap-2" role="img" aria-label="Clips forged per day this week">
        {data.map((value, i) => (
          <div
            key={DAY_LABELS[i]}
            className="relative flex h-full flex-1 flex-col justify-end"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            {hovered === i && (
              <div className="absolute -top-9 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-space-950 px-2.5 py-1 text-xs shadow-lg">
                <span className="font-semibold text-white">{value}</span>
                <span className="text-slate-400"> clips · {DAY_LABELS[i]}</span>
              </div>
            )}
            <div
              className="rounded-t-[4px] bg-violet transition-all duration-300"
              style={{
                height: `${(value / max) * 100}%`,
                opacity: hovered === null || hovered === i ? 1 : 0.35,
              }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-2 border-t border-white/5 pt-2">
        {DAY_LABELS.map((d) => (
          <span key={d} className="flex-1 text-center text-[10px] font-medium text-slate-500">
            {d}
          </span>
        ))}
      </div>
    </div>
  );
}
