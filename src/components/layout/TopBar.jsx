import React, { useEffect, useRef, useState } from 'react';
import { Bell, Flame, Sparkles, Zap, LogOut, CreditCard, ChevronDown } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const VIEW_TITLES = {
  dashboard: 'Overview',
  forge: 'The Forge',
  studio: 'Output Studio',
};

export default function TopBar() {
  const { view, setView } = useApp();
  const { session, tierId, tier, creditsRemaining, isPaid, openPaywall, signOut } =
    useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const initial = (session?.user.name?.[0] ?? session?.user.email[0] ?? '?').toUpperCase();

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
        {/* Live credit / tier chip — tapping it sells the upgrade */}
        <button
          type="button"
          onClick={() => openPaywall('upgrade')}
          title={isPaid ? tier.name : 'Forge credits remaining'}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all hover:scale-[1.03] ${
            isPaid
              ? 'bg-gradient-to-r from-violet/20 to-cyan/20 text-cyan-glow ring-1 ring-cyan/30'
              : creditsRemaining > 0
                ? 'bg-white/5 text-slate-300 ring-1 ring-white/10'
                : 'bg-amber-400/10 text-amber-300 ring-1 ring-amber-400/30'
          }`}
        >
          <Zap size={12} />
          {isPaid ? tier.name : `${creditsRemaining} credit${creditsRemaining === 1 ? '' : 's'}`}
        </button>

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
          className="relative hidden rounded-xl border border-white/10 p-2 text-slate-400 transition-colors hover:text-white sm:block"
        >
          <Bell size={17} />
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-cyan" />
        </button>

        {/* Account menu */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className="flex items-center gap-1 rounded-full transition-transform hover:scale-[1.04]"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-violet/40 to-cyan/40 text-sm font-bold text-white ring-1 ring-white/15">
              {initial}
            </span>
            <ChevronDown size={13} className="text-slate-500" />
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="card absolute right-0 top-12 w-56 overflow-hidden p-1.5 animate-fade-up"
            >
              <div className="border-b border-white/5 px-3 py-2.5">
                <p className="truncate text-sm font-semibold capitalize text-white">
                  {session.user.name}
                </p>
                <p className="truncate text-xs text-slate-500">{session.user.email}</p>
                <span className="mt-1.5 inline-block rounded-full bg-violet/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-violet-glow">
                  {tier.name} plan
                </span>
              </div>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  openPaywall('upgrade');
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
              >
                <CreditCard size={15} /> {isPaid ? 'Manage plan' : 'Upgrade plan'}
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={signOut}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
              >
                <LogOut size={15} /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
