import type { UrfxPricingPlanKey } from "@/types/urfx-pricing";

export const DEFAULT_URFX_LEVERAGE = "FX 1:100 • Commodities 1:20 • Indices 1:20 • Crypto 1:2";

const URFX_PLAN_KEY_ALIASES: Record<string, UrfxPricingPlanKey> = {
  twophase: "twoPhase",
  onephase: "onePhase",
  onestep: "onePhase",
  instantfunding: "instantFundingPro",
  instantfundingpro: "instantFundingPro",
  instantfundinglite: "instantFundingLite",
};

export function resolveUrfxPlanKey(fundingType: string | null | undefined): UrfxPricingPlanKey | null {
  const normalized = fundingType?.trim().toLowerCase().replace(/[\s_-]+/g, "");

  if (!normalized) {
    return null;
  }

  if (normalized in URFX_PLAN_KEY_ALIASES) {
    return URFX_PLAN_KEY_ALIASES[normalized];
  }

  if (normalized.includes("two")) {
    return "twoPhase";
  }

  if (normalized.includes("one")) {
    return "onePhase";
  }

  if (normalized.includes("lite")) {
    return "instantFundingLite";
  }

  if (normalized.includes("instant")) {
    return "instantFundingPro";
  }

  return null;
}
