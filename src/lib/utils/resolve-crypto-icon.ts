import { normalizeTradingSymbol } from "@/lib/utils/market-symbol-icon";
import type { CryptoIconCode } from "@/types/asset-icon";

const CRYPTO_SYMBOL_PREFIX_MAP: Array<[string, CryptoIconCode]> = [
  ["BTC", "btc"],
  ["ETH", "eth"],
  ["SOL", "sol"],
  ["BNB", "bnb"],
  ["DOGE", "doge"],
  ["AVAX", "avax"],
  ["LINK", "link"],
  ["XRP", "xrp"],
  ["ADA", "ada"],
  ["TON", "ton"],
  ["TRX", "trx"],
  ["DOT", "dot"],
  ["LTC", "ltc"],
  ["SUI", "sui"],
];

export function resolveCryptoIconCode(symbol: string): CryptoIconCode | null {
  const normalized = normalizeTradingSymbol(symbol);

  if (!normalized) {
    return null;
  }

  for (const [prefix, code] of CRYPTO_SYMBOL_PREFIX_MAP) {
    if (normalized.startsWith(prefix)) {
      return code;
    }
  }

  return null;
}
