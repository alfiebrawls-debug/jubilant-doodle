import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { authService } from '../services/authService.js';
import { paymentService } from '../services/paymentService.js';
import { isSupabaseConfigured } from '../lib/supabaseClient.js';
import { getTier, meetsTier } from '../data/pricingData.js';

const AuthContext = createContext(null);

/**
 * Identity + entitlement state, backed by Supabase Auth and the
 * clipforge_profiles table. Components never touch the services directly.
 */
export function AuthProvider({ children }) {
  // session = { user: {id, email, name}, tierId, creditsRemaining } | null
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(isSupabaseConfigured);
  const [authBusy, setAuthBusy] = useState(false);
  // paywall.reason drives the modal headline: 'out-of-credits',
  // 'premium-style', or 'upgrade' (opened voluntarily).
  const [paywall, setPaywall] = useState({ open: false, reason: 'upgrade' });

  /** Merge the Supabase auth user + profile row into one session object. */
  const hydrateSession = useCallback(async (authSession) => {
    if (!authSession?.user) {
      setSession(null);
      setAuthLoading(false);
      return;
    }
    const profile = await authService.fetchProfile();
    setSession({
      user: {
        id: authSession.user.id,
        email: authSession.user.email,
        name:
          profile?.displayName ??
          authSession.user.email.split('@')[0].replace(/[._-]/g, ' '),
      },
      tierId: profile?.tierId ?? 'free',
      creditsRemaining: profile?.creditsRemaining ?? 0,
    });
    setAuthLoading(false);
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined;
    // INITIAL_SESSION fires immediately, covering the boot restore;
    // SIGNED_IN / SIGNED_OUT / TOKEN_REFRESHED keep the state live.
    const unsubscribe = authService.onAuthChange((event, authSession) => {
      if (event === 'TOKEN_REFRESHED') return; // profile unchanged
      hydrateSession(authSession);
    });
    return unsubscribe;
  }, [hydrateSession]);

  const signUp = useCallback(async (email, password) => {
    setAuthBusy(true);
    try {
      return await authService.signUp(email, password);
    } finally {
      setAuthBusy(false);
    }
  }, []);

  const signIn = useCallback(async (email, password) => {
    setAuthBusy(true);
    try {
      return await authService.signIn(email, password);
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
   * Debit one forge credit (atomic, server-side). Returns true if the
   * forge may proceed; on false the paywall has already been opened.
   */
  const requestForgeCredit = useCallback(async () => {
    if (!session) return false;
    const { allowed, creditsRemaining } = await authService.consumeForgeCredit();
    if (!allowed) {
      openPaywall('out-of-credits');
      return false;
    }
    setSession((prev) => (prev ? { ...prev, creditsRemaining } : prev));
    return true;
  }, [session, openPaywall]);

  const refundForgeCredit = useCallback(async () => {
    const credits = await authService.refundForgeCredit();
    if (credits !== null) {
      setSession((prev) => (prev ? { ...prev, creditsRemaining: credits } : prev));
    }
  }, []);

  /**
   * Purchase flow: checkout via the payment service, then apply the tier.
   * PRODUCTION: applyTier is replaced by the billing webhook — after
   * checkout the client just refetches the profile until the tier lands.
   */
  const upgrade = useCallback(
    async (tierId) => {
      if (!session) return { status: 'error' };
      const result = await paymentService.startCheckout({
        tierId,
        userId: session.user.id,
      });
      if (result.status !== 'success') return result;

      const { error } = await authService.applyTier(tierId);
      if (error) return { status: 'error', error };

      const profile = await authService.fetchProfile();
      setSession((prev) =>
        prev && profile
          ? {
              ...prev,
              tierId: profile.tierId,
              creditsRemaining: profile.creditsRemaining,
            }
          : prev
      );
      return result;
    },
    [session]
  );

  const tierId = session?.tierId ?? 'free';

  const value = {
    isSupabaseConfigured,
    session,
    authLoading,
    authBusy,
    signUp,
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
