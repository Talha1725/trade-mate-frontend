import type { MarketAssetClass } from "@/types/market";

const FOREX_PREFIXES = ["AUD", "CAD", "CHF", "EUR", "GBP", "JPY", "NZD", "USD"];

function isForexSymbol(symbol: string) {
  const normalized = symbol.trim().toUpperCase();

  if (normalized.length !== 6) {
    return false;
  }

  const base = normalized.slice(0, 3);
  const quote = normalized.slice(3);

  return FOREX_PREFIXES.includes(base) && FOREX_PREFIXES.includes(quote);
}

export function getMarketPricePrecision(symbol: string, assetClass?: MarketAssetClass | null) {
  if (assetClass === "FOREX" || isForexSymbol(symbol)) {
    return 5;
  }

  return 2;
}

export function formatMarketPrice(
  value: number | string | null | undefined,
  symbol: string,
  assetClass?: MarketAssetClass | null,
) {
  if (value == null || value === "") {
    return "—";
  }

  const numericValue = typeof value === "number" ? value : Number(value);

  if (Number.isNaN(numericValue)) {
    return "—";
  }

  return numericValue.toFixed(getMarketPricePrecision(symbol, assetClass));
}
