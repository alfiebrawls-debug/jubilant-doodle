import React from 'react';
import { Flame, LayoutDashboard, Hammer, Clapperboard, Settings, Zap, Users } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'forge', label: 'The Forge', icon: Hammer },
  { id: 'studio', label: 'Output Studio', icon: Clapperboard, requiresPackage: true },
];

/**
 * Desktop: fixed left rail. Mobile: bottom tab bar.
 */
export default function Sidebar() {
  const { view, setView, clipPackage } = useApp();
  const { tierId, tier, creditsRemaining, openPaywall } = useAuth();

  const navButton = (item, layout) => {
    const disabled = item.requiresPackage && !clipPackage;
    const active = view === item.id;
    const Icon = item.icon;
    const base =
      layout === 'rail'
        ? 'flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all'
        : 'flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-all';

    return (
      <button
        key={item.id}
        type="button"
        disabled={disabled}
        onClick={() => setView(item.id)}
        title={disabled ? 'Forge a clip first to unlock the Studio' : item.label}
        className={`${base} ${
          active
            ? 'bg-violet/15 text-violet-glow shadow-glow-violet'
            : disabled
              ? 'cursor-not-allowed text-slate-600'
              : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
        }`}
      >
        <Icon size={layout === 'rail' ? 18 : 20} />
        <span>{item.label}</span>
      </button>
    );
  };

  return (
    <>
      {/* Desktop rail */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-white/5 bg-space-950/70 px-4 py-6 backdrop-blur lg:flex">
        <div className="mb-10 flex items-center gap-2.5 px-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet to-cyan shadow-glow-violet">
            <Flame size={18} className="text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            Clip<span className="gradient-text">Forge</span>
          </span>
        </div>

        <nav className="flex flex-col gap-1.5">
          {NAV_ITEMS.map((item) => navButton(item, 'rail'))}
        </nav>

        <div className="mt-auto space-y-4">
          {/* Plan card reflects the live session tier + credit balance */}
          {tierId === 'free' ? (
            <div className="gradient-border rounded-2xl p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
                <Zap size={15} className="text-cyan" /> Free Plan
              </div>
              <p className="text-xs leading-relaxed text-slate-400">
                {creditsRemaining > 0
                  ? `${creditsRemaining} of 1 forge credit remaining.`
                  : 'Your free forge credit is used up.'}
              </p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-space-700">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet to-cyan transition-all"
                  style={{ width: `${(1 - creditsRemaining) * 100}%` }}
                />
              </div>
              <button
                type="button"
                onClick={() => openPaywall('upgrade')}
                className="mt-3 w-full rounded-lg bg-gradient-to-r from-violet to-cyan py-2 text-xs font-bold text-white transition-transform hover:scale-[1.02]"
              >
                Upgrade — from $19/mo
              </button>
            </div>
          ) : (
            <div className="gradient-border rounded-2xl p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
                {tierId === 'agency' ? (
                  <Users size={15} className="text-cyan" />
                ) : (
                  <Zap size={15} className="text-cyan" />
                )}
                {tier.name}
              </div>
              <p className="text-xs leading-relaxed text-slate-400">
                Unlimited forges · priority fast-lane
                {tierId === 'agency' ? ' · 5 team seats' : ''}
              </p>
            </div>
          )}
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-white/5 hover:text-slate-200"
          >
            <Settings size={18} /> Settings
          </button>
        </div>
      </aside>

      {/* Mobile bottom tab bar */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-white/10 bg-space-950/90 backdrop-blur lg:hidden">
        {NAV_ITEMS.map((item) => navButton(item, 'tab'))}
      </nav>
    </>
  );
}
