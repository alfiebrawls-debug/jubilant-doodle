import React, { useEffect, useState } from 'react';
import { X, Check, Loader2, Zap, ShieldCheck, PartyPopper } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { TIERS, tierRank } from '../../data/pricingData.js';

const HEADLINES = {
  'out-of-credits': {
    title: 'You’ve used your free forge',
    subtitle: 'That clip package would’ve taken ~3 hours by hand. Go unlimited and never stop shipping.',
  },
  'premium-style': {
    title: 'That style is a Pro exclusive',
    subtitle: 'Premium viral styles are tuned on top-performing clips. Unlock them all with Creator Pro.',
  },
  upgrade: {
    title: 'Pick your plan',
    subtitle: 'Start free, upgrade when the clips start hitting. Cancel anytime.',
  },
};

function TierCard({ tier, currentTierId, busyTier, onSelect }) {
  const isCurrent = tier.id === currentTierId;
  const isDowngrade = tierRank(tier.id) < tierRank(currentTierId);
  const busy = busyTier === tier.id;
  const disabled = isCurrent || isDowngrade || (busyTier && !busy);

  return (
    <div
      className={`relative flex flex-col rounded-2xl p-5 ${
        tier.popular
          ? 'gradient-border shadow-glow-violet lg:-my-3 lg:py-8'
          : 'border border-white/10 bg-space-900/60'
      }`}
    >
      {tier.popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-violet to-cyan px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-glow-violet">
          ⚡ Most Popular
        </span>
      )}

      <h4 className="text-sm font-bold text-white">{tier.name}</h4>
      <p className="mt-0.5 text-xs text-slate-500">{tier.tagline}</p>

      <p className="mt-4">
        <span className="text-3xl font-bold tracking-tight text-white">
          ${tier.price}
        </span>
        <span className="text-sm text-slate-500">{tier.period}</span>
      </p>

      <ul className="mt-4 flex-1 space-y-2.5">
        {tier.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-xs text-slate-300">
            <Check
              size={14}
              className={`mt-px shrink-0 ${tier.popular ? 'text-cyan-glow' : 'text-violet-glow'}`}
            />
            {feature}
          </li>
        ))}
      </ul>

      <button
        type="button"
        disabled={disabled}
        onClick={() => onSelect(tier.id)}
        className={`mt-5 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-all ${
          isCurrent || isDowngrade
            ? 'cursor-default border border-white/10 text-slate-500'
            : tier.popular
              ? 'bg-gradient-to-r from-violet to-cyan text-white shadow-glow-violet hover:scale-[1.02] disabled:opacity-60'
              : 'border border-white/15 text-white hover:border-violet/60 hover:bg-violet/10 disabled:opacity-60'
        }`}
      >
        {busy ? (
          <>
            <Loader2 size={14} className="animate-spin" /> Processing…
          </>
        ) : isCurrent ? (
          'Current plan'
        ) : isDowngrade ? (
          'Included in your plan'
        ) : (
          tier.cta
        )}
      </button>
    </div>
  );
}

/**
 * High-converting paywall. Opens voluntarily ("Upgrade") or as an
 * interception when a free user runs out of credits / taps a Pro style.
 * Checkout goes through paymentService (Stripe / IAP behind one interface).
 */
export default function PricingModal() {
  const { paywall, closePaywall, tierId, upgrade } = useAuth();
  const [busyTier, setBusyTier] = useState(null);
  const [justUpgraded, setJustUpgraded] = useState(null);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && closePaywall();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closePaywall]);

  if (!paywall.open) return null;

  const copy = HEADLINES[paywall.reason] ?? HEADLINES.upgrade;

  const handleSelect = async (selectedTierId) => {
    setBusyTier(selectedTierId);
    const result = await upgrade(selectedTierId);
    setBusyTier(null);
    if (result.status === 'success') {
      setJustUpgraded(selectedTierId);
      setTimeout(() => {
        setJustUpgraded(null);
        closePaywall();
      }, 1800);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-space-950/85 p-4 backdrop-blur-sm"
      onClick={closePaywall}
      role="dialog"
      aria-modal="true"
      aria-label="Subscription plans"
    >
      <div
        className="card relative w-full max-w-4xl p-6 sm:p-8 animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={closePaywall}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-white/5 hover:text-white"
        >
          <X size={18} />
        </button>

        {justUpgraded ? (
          <div className="flex flex-col items-center py-16 text-center">
            <PartyPopper size={40} className="mb-4 text-cyan-glow" />
            <h3 className="text-2xl font-bold text-white">
              Welcome to {TIERS.find((t) => t.id === justUpgraded)?.name}!
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              Unlimited forges unlocked. The fast lane is yours.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8 text-center">
              <p className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-violet/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-violet-glow">
                <Zap size={12} /> ClipForge Plans
              </p>
              <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {copy.title}
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">{copy.subtitle}</p>
            </div>

            <div className="grid gap-4 lg:grid-cols-3 lg:gap-5 lg:px-2 lg:py-3">
              {TIERS.map((tier) => (
                <TierCard
                  key={tier.id}
                  tier={tier}
                  currentTierId={tierId}
                  busyTier={busyTier}
                  onSelect={handleSelect}
                />
              ))}
            </div>

            <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-[11px] text-slate-500">
              <ShieldCheck size={13} className="text-cyan-glow" />
              Cancel anytime · Secure checkout · 7-day money-back guarantee
            </p>
          </>
        )}
      </div>
    </div>
  );
}
