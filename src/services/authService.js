/**
 * Authentication & entitlement service — MOCK IMPLEMENTATION.
 *
 * This module is the ONLY place the rest of the app talks to for identity
 * and usage credits. Its public API is designed to map 1:1 onto a real
 * backend, so going to production is a rewrite of this file, not the app.
 *
 * ┌─ PRODUCTION INTEGRATION ────────────────────────────────────────────┐
 * │ Supabase:  signIn → supabase.auth.signInWithOtp / signInWithOAuth   │
 * │            session → supabase.auth.getSession() + onAuthStateChange │
 * │            credits → a `profiles.forge_credits` column guarded by   │
 * │            RLS; consume via an edge function (atomic decrement).    │
 * │ Firebase:  signIn → firebase/auth signInWithEmailLink / popup       │
 * │            credits → Firestore doc + a callable Cloud Function.     │
 * │ Native:    wrap in Capacitor/React Native; store tokens in the      │
 * │            platform keychain, NOT localStorage.                     │
 * │                                                                     │
 * │ ⚠ Credits and tier MUST be enforced server-side. The client-side    │
 * │   checks in this app are UX only — a paying customer's entitlement  │
 * │   is whatever your backend says it is.                              │
 * └─────────────────────────────────────────────────────────────────────┘
 */

import { getTier } from '../data/pricingData.js';

const STORAGE_KEY = 'clipforge.session.v1';
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function readStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeStorage(session) {
  try {
    if (session) localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* storage unavailable (private mode) — session stays in-memory only */
  }
}

export const authService = {
  /**
   * Restore a persisted session on app boot.
   * PRODUCTION: supabase.auth.getSession() / firebase onAuthStateChanged.
   */
  getStoredSession() {
    return readStorage();
  },

  /**
   * Mock email sign-in. Any email works; new users start on Free with
   * exactly 1 forge credit.
   * PRODUCTION: replace with your provider's sign-in and fetch the
   * user's profile row (tier + credits) after auth succeeds.
   */
  async signIn(email) {
    await delay(700);
    const session = {
      user: {
        id: `usr_${btoa(email).slice(0, 10)}`,
        email,
        name: email.split('@')[0].replace(/[._-]/g, ' '),
      },
      tierId: 'free',
      creditsRemaining: getTier('free').forgeCredits,
      createdAt: new Date().toISOString(),
    };
    writeStorage(session);
    return session;
  },

  /** PRODUCTION: supabase.auth.signOut() / firebase signOut(). */
  async signOut() {
    await delay(250);
    writeStorage(null);
  },

  /**
   * Atomically consume one forge credit. Returns the updated session, or
   * null if the user has no credits left (caller shows the paywall).
   * PRODUCTION: this MUST be a server call (edge function / callable
   * function) that decrements atomically and returns the new balance —
   * never trust a client-side counter.
   */
  async consumeForgeCredit(session) {
    await delay(150);
    if (session.creditsRemaining === Infinity) return session;
    if (session.creditsRemaining <= 0) return null;
    const updated = { ...session, creditsRemaining: session.creditsRemaining - 1 };
    writeStorage(updated);
    return updated;
  },

  /** Refund a credit if a forge fails after the debit (mirror server-side). */
  async refundForgeCredit(session) {
    if (session.creditsRemaining === Infinity) return session;
    const updated = { ...session, creditsRemaining: session.creditsRemaining + 1 };
    writeStorage(updated);
    return updated;
  },

  /**
   * Apply a new tier after a successful purchase.
   * PRODUCTION: never called directly from checkout UI — the billing
   * provider's webhook (Stripe `checkout.session.completed`, App Store
   * server notifications) updates the profile; the client just refetches.
   */
  async applyTier(session, tierId) {
    await delay(200);
    const updated = {
      ...session,
      tierId,
      creditsRemaining: getTier(tierId).forgeCredits,
    };
    writeStorage(updated);
    return updated;
  },
};
