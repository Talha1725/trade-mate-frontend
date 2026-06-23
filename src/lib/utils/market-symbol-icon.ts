import type { MarketWatchIcon } from "@/types/market-watch-card";

const EXACT_SYMBOL_ICON_MAP: Record<string, MarketWatchIcon> = {
  BTCUSD: "bitcoin",
  ETHUSD: "ethereum",
  SOLUSD: "solana",
  XRPUSD: "ripple",
  ADAUSD: "cardano",
};

const SYMBOL_PREFIX_ICON_MAP: Array<[string, MarketWatchIcon]> = [
  ["BTC", "bitcoin"],
  ["ETH", "ethereum"],
  ["SOL", "solana"],
  ["XRP", "ripple"],
  ["ADA", "cardano"],
];

export function normalizeTradingSymbol(symbol: string) {
  return symbol.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function resolveMarketWatchIcon(symbol: string): MarketWatchIcon | null {
  const normalized = normalizeTradingSymbol(symbol);

  if (!normalized) {
    return null;
  }

  if (EXACT_SYMBOL_ICON_MAP[normalized]) {
    return EXACT_SYMBOL_ICON_MAP[normalized];
  }

  for (const [prefix, icon] of SYMBOL_PREFIX_ICON_MAP) {
    if (normalized.startsWith(prefix)) {
      return icon;
    }
  }

  return null;
}

export function formatTradingSymbolLabel(symbol: string) {
  const normalized = normalizeTradingSymbol(symbol);

  if (!normalized) {
    return symbol;
  }

  if (normalized.endsWith("USD") && normalized.length > 3) {
    return normalized;
  }

  return normalized;
}
