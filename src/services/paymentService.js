/**
 * Payment / subscription service — MOCK IMPLEMENTATION.
 *
 * Isolates every billing concern behind one interface so the paywall UI
 * never knows (or cares) which processor is underneath.
 *
 * ┌─ PRODUCTION INTEGRATION ────────────────────────────────────────────┐
 * │ Web (Stripe):                                                       │
 * │   startCheckout → POST /api/checkout-session on YOUR server         │
 * │   (stripe.checkout.sessions.create with the tier's price ID), then  │
 * │   redirect to session.url. Fulfillment happens in the webhook       │
 * │   handler, never in the browser.                                    │
 * │                                                                     │
 * │ iOS / Android (In-App Purchases):                                   │
 * │   Detect the native shell (Capacitor.getPlatform() !== 'web') and   │
 * │   route to StoreKit 2 / Play Billing — RevenueCat's SDK covers      │
 * │   both and handles receipt validation + entitlement sync. Apple     │
 * │   REQUIRES IAP for digital subscriptions sold inside the app; do    │
 * │   not show Stripe checkout in the App Store build.                  │
 * │                                                                     │
 * │ manageSubscription → Stripe Customer Portal session URL, or the     │
 * │   platform's native subscription settings deep link.                │
 * └─────────────────────────────────────────────────────────────────────┘
 */

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const paymentService = {
  /**
   * Kick off checkout for a paid tier. The mock "succeeds" after a short
   * processing window; production redirects away and fulfills via webhook.
   */
  async startCheckout({ tierId, userId }) {
    await delay(1600);
    return {
      status: 'success',
      tierId,
      subscriptionId: `sub_mock_${userId.slice(-4)}_${Date.now().toString(36)}`,
      // PRODUCTION: nothing sensitive returns to the client — the webhook
      // updates the user's profile and the client refetches the session.
    };
  },

  /** Open the billing management surface (portal / native settings). */
  async manageSubscription() {
    await delay(400);
    return { url: '#mock-billing-portal' };
  },
};
