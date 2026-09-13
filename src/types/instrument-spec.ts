import type { AssetCategory } from "@/types/asset";

export type InstrumentSpec = {
  symbol: string;
  assetClass: AssetCategory;
  contractSize: number;
  quoteCurrency: string;
  leverage: number;
};

export type QuotePriceMap = Record<string, number | null | undefined>;
