import React, { createContext, useCallback, useContext, useState } from 'react';
import { authService } from '../services/authService.js';
import { paymentService } from '../services/paymentService.js';
import { getTier, meetsTier } from '../data/pricingData.js';

const AuthContext = createContext(null);

/**
 * Identity + entitlement state. Everything billing/credits-related flows
 * through here so components never touch the services directly.
 */
export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => authService.getStoredSession());
  const [authBusy, setAuthBusy] = useState(false);
  // paywall.reason drives the modal headline: 'out-of-credits',
  // 'premium-style', or 'upgrade' (opened voluntarily).
  const [paywall, setPaywall] = useState({ open: false, reason: 'upgrade' });

  const signIn = useCallback(async (email) => {
    setAuthBusy(true);
    try {
      setSession(await authService.signIn(email));
    } finally {
      setAuthBusy(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    await authService.signOut();
    setSession(null);
  }, []);

  const openPaywall = useCallback(
    (reason = 'upgrade') => setPaywall({ open: true, reason }),
    []
  );
  const closePaywall = useCallback(
    () => setPaywall((p) => ({ ...p, open: false })),
    []
  );

  /**
   * Debit one forge credit. Returns true if the forge may proceed;
   * on false the paywall has already been opened.
   */
  const requestForgeCredit = useCallback(async () => {
    if (!session) return false;
    const updated = await authService.consumeForgeCredit(session);
    if (!updated) {
      openPaywall('out-of-credits');
      return false;
    }
    setSession(updated);
    return true;
  }, [session, openPaywall]);

  const refundForgeCredit = useCallback(async () => {
    if (!session) return;
    setSession(await authService.refundForgeCredit(session));
  }, [session]);

  /**
   * Purchase flow: checkout via the payment service, then apply the tier.
   * PRODUCTION: applyTier is replaced by refetching the session after the
   * billing webhook lands (poll or realtime subscription).
   */
  const upgrade = useCallback(
    async (tierId) => {
      if (!session) return { status: 'error' };
      const result = await paymentService.startCheckout({
        tierId,
        userId: session.user.id,
      });
      if (result.status === 'success') {
        setSession(await authService.applyTier(session, tierId));
      }
      return result;
    },
    [session]
  );

  const tierId = session?.tierId ?? 'free';

  const value = {
    session,
    authBusy,
    signIn,
    signOut,
    tierId,
    tier: getTier(tierId),
    isPaid: tierId !== 'free',
    creditsRemaining: session?.creditsRemaining ?? 0,
    canUseStyle: (style) => meetsTier(tierId, style.minTier),
    requestForgeCredit,
    refundForgeCredit,
    upgrade,
    paywall,
    openPaywall,
    closePaywall,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
