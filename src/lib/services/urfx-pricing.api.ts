import { ROUTES } from "@/constant/routes";
import { get } from "@/lib/utils/api";
import type { UrfxPricingPlan, UrfxPricingPlanKey, UrfxPricingRulesResponse } from "@/types/urfx-pricing";

export const urfxPricingApi = {
  getPricingPlan(planKey: UrfxPricingPlanKey): Promise<UrfxPricingPlan> {
    return get<{ data: UrfxPricingPlan }>(ROUTES.INTEGRATIONS.URFX_PRICING_RULES(planKey)).then((response) => response.data);
  },

  getPricingRules(): Promise<UrfxPricingRulesResponse> {
    return get<UrfxPricingRulesResponse>("/api/integrations/urfx/pricing-rules");
  },
};
