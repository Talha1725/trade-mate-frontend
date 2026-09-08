import type { AssetRecord } from "@/types/asset";

export type V2WishlistItem = {
  id: string;
  accountId: string;
  createdAt: string;
  asset: AssetRecord;
};
