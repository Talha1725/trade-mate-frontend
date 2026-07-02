export type UrfxPricingPlanKey = "twoPhase" | "onePhase" | "instantFundingPro" | "instantFundingLite";

export type UrfxPricingTier = {
  balanceK: number;
  priceUsd: number;
};

export type UrfxPricingPlan = {
  key: UrfxPricingPlanKey;
  label: string;
  description: string;
  leverage: string;
  tiers: UrfxPricingTier[];
  source: string;
};

export type UrfxPricingRulesMeta = {
  provider: "URFX";
  currency: "USD";
  sourceFile: string;
  reviewedAt: string;
  planCount: number;
};
