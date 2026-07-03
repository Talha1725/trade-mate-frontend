import type { AssetCategory } from "@/types/asset";

const ASSET_CATEGORY_LEVERAGE: Record<AssetCategory, string> = {
  CRYPTO: "1:2",
  FOREX: "1:100",
  COMMODITIES: "1:20",
  INDICES: "1:20",
  STOCK: "1:20",
};

export function getAssetLeverageLabel(category: AssetCategory | null | undefined) {
  if (!category) {
    return "1:20";
  }

  return ASSET_CATEGORY_LEVERAGE[category] ?? "1:20";
}
