export type AssetCategory = "CRYPTO" | "FOREX" | "COMMODITIES" | "INDICES" | "STOCK";

import type { ISODateString } from "@/types";

export type AssetRecord = {
  id: string;
  label: string;
  symbol: string;
  category: AssetCategory;
  isActive: boolean;
  sortOrder: number;
  createdAt: ISODateString;
  updatedAt: ISODateString;
};

export type AssetsListResponse = {
  assets: AssetRecord[];
};
