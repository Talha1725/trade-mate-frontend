import type { TradingFilterBarAsset } from "@/types/trading-filter-bar";

function normalizeSearchQuery(query: string) {
  return query.trim().toLowerCase().replace(/\s+/g, "");
}

export function filterTradingAssets(
  assets: TradingFilterBarAsset[],
  query: string,
) {
  const normalized = normalizeSearchQuery(query);

  if (!normalized) {
    return [];
  }

  return assets.filter((asset) => {
    const label = asset.label.toLowerCase();
    const symbol = asset.symbol.toLowerCase();
    const compactLabel = label.replace(/\s+/g, "");

    return (
      label.includes(normalized) ||
      symbol.includes(normalized) ||
      compactLabel.includes(normalized) ||
      asset.id.includes(normalized)
    );
  });
}
