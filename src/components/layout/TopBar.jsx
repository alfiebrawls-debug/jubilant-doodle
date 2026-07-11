import React from 'react';
import { Bell, Flame, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

const VIEW_TITLES = {
  dashboard: 'Overview',
  forge: 'The Forge',
  studio: 'Output Studio',
};

export default function TopBar() {
  const { view, setView } = useApp();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/5 bg-space-900/80 px-4 py-3.5 backdrop-blur sm:px-6 lg:px-10">
      <div className="flex items-center gap-3">
        {/* Compact logo — visible only on mobile where the rail is hidden */}
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-violet to-cyan lg:hidden">
          <Flame size={15} className="text-white" />
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-widest text-slate-500">
            ClipForge
          </p>
          <h2 className="text-sm font-semibold text-white">{VIEW_TITLES[view]}</h2>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setView('forge')}
          className="hidden items-center gap-2 rounded-xl bg-gradient-to-r from-violet to-cyan px-4 py-2 text-sm font-semibold text-white shadow-glow-violet transition-transform hover:scale-[1.03] active:scale-[0.98] sm:inline-flex"
        >
          <Sparkles size={15} /> New Clip
        </button>
        <button
          type="button"
          aria-label="Notifications"
          className="relative rounded-xl border border-white/10 p-2 text-slate-400 transition-colors hover:text-white"
        >
          <Bell size={17} />
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-cyan" />
        </button>
        <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-violet/40 to-cyan/40 text-sm font-bold text-white ring-1 ring-white/15">
          A
        </div>
      </div>
    </header>
  );
}
