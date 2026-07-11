import React, { useState } from 'react';
import { Anchor, MessageSquareText, Hash } from 'lucide-react';
import CopyButton from '../ui/CopyButton.jsx';
import { PLATFORMS } from '../../data/mockData.js';

function Block({ icon: Icon, title, children }) {
  return (
    <div>
      <h4 className="mb-2.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
        <Icon size={13} className="text-cyan-glow" /> {title}
      </h4>
      {children}
    </div>
  );
}

export default function SocialPanel({ social }) {
  const [platformId, setPlatformId] = useState('tiktok');
  const platform = social.platforms.find((p) => p.id === platformId);
  const hashtagString = platform.hashtags.join(' ');

  return (
    <section className="card flex flex-col overflow-hidden">
      <header className="border-b border-white/5 px-5 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-cyan-glow">
          Social Package
        </p>
        <h3 className="text-sm font-bold text-white">Hooks, captions & hashtags</h3>
      </header>

      <div className="flex-1 space-y-6 overflow-y-auto p-5">
        <Block icon={Anchor} title="Hook variations">
          <ul className="space-y-2">
            {social.hooks.map((hook, i) => (
              <li
                key={i}
                className="flex items-start justify-between gap-3 rounded-xl border border-white/5 bg-space-900/60 px-3.5 py-2.5"
              >
                <p className="text-sm leading-relaxed text-slate-100">{hook}</p>
                <CopyButton text={hook} />
              </li>
            ))}
          </ul>
        </Block>

        <Block icon={MessageSquareText} title="Captions (3 variants)">
          <ul className="space-y-2">
            {social.captions.map((caption, i) => (
              <li
                key={i}
                className="rounded-xl border border-white/5 bg-space-900/60 px-3.5 py-3"
              >
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                    Variant {String.fromCharCode(65 + i)}
                  </span>
                  <CopyButton text={caption} />
                </div>
                <p className="text-sm leading-relaxed text-slate-200">{caption}</p>
              </li>
            ))}
          </ul>
        </Block>

        <Block icon={Hash} title="Optimized hashtags">
          {/* Platform switcher */}
          <div className="mb-3 flex gap-1.5 rounded-xl bg-space-900/80 p-1">
            {PLATFORMS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPlatformId(p.id)}
                className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  platformId === p.id
                    ? 'bg-gradient-to-r from-violet to-cyan text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>

          <div className="rounded-xl border border-white/5 bg-space-900/60 px-3.5 py-3">
            <div className="flex flex-wrap gap-1.5">
              {platform.hashtags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-cyan/10 px-2.5 py-1 text-xs font-medium text-cyan-glow"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2.5">
              <span className="text-[11px] text-slate-500">
                Optimized for {platform.name} · caption limit ~{platform.maxCaption} chars
              </span>
              <CopyButton text={hashtagString} />
            </div>
          </div>
        </Block>
      </div>
    </section>
  );
}
