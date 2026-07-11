/**
 * Authentication & entitlement service — REAL SUPABASE IMPLEMENTATION.
 *
 * Identity lives in Supabase Auth; entitlements live in the
 * `public.clipforge_profiles` table (see supabase/migrations/). The
 * security-critical rules are enforced by the DATABASE, not this file:
 *
 *   * RLS: users can only SELECT their own profile row; there are no
 *     client write policies at all.
 *   * Credits change only through SECURITY DEFINER functions:
 *       consume_forge_credit()  — atomic guarded decrement; the check
 *                                 and the debit are one UPDATE, so two
 *                                 concurrent forges can't both win the
 *                                 last credit
 *       refund_forge_credit()   — compensating credit on failed forges
 *   * demo_upgrade_tier() lets the demo paywall complete without a
 *     billing backend. PRODUCTION: revoke it and set tier_id from your
 *     Stripe / App Store webhook using the service_role key instead.
 */

import { supabase } from '../lib/supabaseClient.js';

/** Map a DB profile row to the session shape the UI consumes. */
function toProfile(row) {
  if (!row) return null;
  return {
    tierId: row.tier_id,
    // NULL in the DB means unlimited (paid tiers)
    creditsRemaining: row.forge_credits === null ? Infinity : row.forge_credits,
    displayName: row.display_name,
    email: row.email,
  };
}

export const authService = {
  /**
   * Subscribe to auth changes (initial session, sign-in, sign-out, token
   * refresh). Returns an unsubscribe function.
   */
  onAuthChange(callback) {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      // Defer: making Supabase calls directly inside this callback can
      // deadlock (documented supabase-js behavior).
      setTimeout(() => callback(event, session), 0);
    });
    return () => data.subscription.unsubscribe();
  },

  /**
   * Email + password sign-up. The `on_auth_user_created_clipforge` DB
   * trigger provisions the profile row with 1 free forge credit.
   * If email confirmations are enabled, no session is returned until the
   * user clicks the link — the caller shows a "check your inbox" notice.
   */
  async signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: error.message };
    return { needsEmailConfirmation: !data.session };
  },

  /** Email + password sign-in. */
  async signIn(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  },

  async signOut() {
    await supabase.auth.signOut();
  },

  /** Fetch the calling user's profile (RLS scopes the query to them). */
  async fetchProfile() {
    const { data, error } = await supabase
      .from('clipforge_profiles')
      .select('tier_id, forge_credits, display_name, email')
      .single();
    if (error) {
      console.error('fetchProfile failed:', error.message);
      return null;
    }
    return toProfile(data);
  },

  /**
   * Atomically consume one forge credit server-side.
   * Returns { allowed, creditsRemaining } — creditsRemaining is Infinity
   * for unlimited tiers. The client never computes the balance itself.
   */
  async consumeForgeCredit() {
    const { data, error } = await supabase.rpc('consume_forge_credit');
    if (error) {
      console.error('consume_forge_credit failed:', error.message);
      return { allowed: false, creditsRemaining: 0 };
    }
    const row = Array.isArray(data) ? data[0] : data;
    return {
      allowed: row?.allowed ?? false,
      creditsRemaining:
        row?.credits_remaining === null ? Infinity : (row?.credits_remaining ?? 0),
    };
  },

  /** Give the credit back if the forge fails after the debit. */
  async refundForgeCredit() {
    const { data, error } = await supabase.rpc('refund_forge_credit');
    if (error) {
      console.error('refund_forge_credit failed:', error.message);
      return null;
    }
    return data;
  },

  /**
   * Apply a tier after checkout.
   * DEMO: calls the self-service demo_upgrade_tier() RPC.
   * PRODUCTION: delete this call — the billing webhook updates the row
   * with the service_role key and the client simply refetches.
   */
  async applyTier(tierId) {
    const { error } = await supabase.rpc('demo_upgrade_tier', { new_tier: tierId });
    if (error) return { error: error.message };
    return { error: null };
  },
};
