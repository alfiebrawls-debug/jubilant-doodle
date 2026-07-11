/**
 * Subscription tier definitions — the single source of truth for pricing UI
 * and entitlement checks.
 *
 * PRODUCTION: mirror these in your billing provider (Stripe Products/Prices,
 * App Store / Play Console subscription groups) and treat THIS file as the
 * display layer only. Entitlements must always be enforced server-side.
 */

export const TIERS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: '',
    tagline: 'Try the forge',
    cta: 'Current plan',
    popular: false,
    forgeCredits: 1,
    features: [
      '1 free forge credit',
      'Standard processing speed',
      'Basic styles (Gen Z, Corporate)',
      'Copy & PDF export',
    ],
  },
  {
    id: 'pro',
    name: 'Creator Pro',
    price: 19,
    period: '/mo',
    tagline: 'For creators posting daily',
    cta: 'Upgrade to Pro',
    popular: true,
    forgeCredits: Infinity,
    features: [
      'Unlimited forges',
      'Priority fast-lane processing',
      'Premium viral styles',
      'Custom branding on exports',
      'Post scheduling',
    ],
  },
  {
    id: 'agency',
    name: 'Agency Studio',
    price: 49,
    period: '/mo',
    tagline: 'For teams & client work',
    cta: 'Upgrade to Agency',
    popular: false,
    forgeCredits: Infinity,
    features: [
      'Everything in Creator Pro',
      'Multi-account management',
      'Team collaboration (5 seats)',
      'Bulk processing queue',
      'Priority support',
    ],
  },
];

const TIER_RANK = { free: 0, pro: 1, agency: 2 };

export const tierRank = (tierId) => TIER_RANK[tierId] ?? 0;

/** Can a user on `userTier` use a feature that requires `requiredTier`? */
export const meetsTier = (userTier, requiredTier) =>
  tierRank(userTier) >= tierRank(requiredTier);

export const getTier = (tierId) => TIERS.find((t) => t.id === tierId) ?? TIERS[0];
