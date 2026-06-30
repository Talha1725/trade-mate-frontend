import { normalizeTradingSymbol } from "@/lib/utils/market-symbol-icon";
import type { CryptoIconCode } from "@/types/asset-icon";

const FOREX_CURRENCY_COUNTRY_MAP: Record<string, string> = {
  EUR: "EU",
  USD: "US",
  GBP: "GB",
  JPY: "JP",
  CHF: "CH",
  AUD: "AU",
  CAD: "CA",
  NZD: "NZ",
};

const FOREX_COMMODITY_ICON_MAP: Record<string, CryptoIconCode> = {
  XAU: "gold",
};

export type ResolvedForexPairIcon =
  | {
      kind: "forex";
      flagCodes: [string, string];
    }
  | {
      kind: "forex-mixed";
      cryptoCode: CryptoIconCode;
      quoteFlag: string;
    };

export function resolveForexPairIcon(symbol: string): ResolvedForexPairIcon | null {
  const normalized = normalizeTradingSymbol(symbol);

  if (normalized.length !== 6) {
    return null;
  }

  const baseCurrency = normalized.slice(0, 3);
  const quoteCurrency = normalized.slice(3, 6);
  const commodityCode = FOREX_COMMODITY_ICON_MAP[baseCurrency];
  const quoteCountry = FOREX_CURRENCY_COUNTRY_MAP[quoteCurrency];

  if (commodityCode && quoteCountry) {
    return {
      kind: "forex-mixed",
      cryptoCode: commodityCode,
      quoteFlag: quoteCountry,
    };
  }

  const baseCountry = FOREX_CURRENCY_COUNTRY_MAP[baseCurrency];
  const quoteCountryCode = FOREX_CURRENCY_COUNTRY_MAP[quoteCurrency];

  if (!baseCountry || !quoteCountryCode) {
    return null;
  }

  return {
    kind: "forex",
    flagCodes: [baseCountry, quoteCountryCode],
  };
}

export function isForexSymbol(symbol: string) {
  return resolveForexPairIcon(symbol) !== null;
}
