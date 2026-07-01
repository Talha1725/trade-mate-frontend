import type { ISODateString } from "@/types";

export type AssetRecord = {
  id: string;
  label: string;
  symbol: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: ISODateString;
  updatedAt: ISODateString;
};

export type AssetsListResponse = {
  assets: AssetRecord[];
};
