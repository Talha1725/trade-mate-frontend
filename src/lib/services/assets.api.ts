import { ROUTES } from "@/constant/routes";
import { get } from "@/lib/utils/api";
import type { AssetsListResponse } from "@/types/asset";

export const assetsApi = {
  getAssets(): Promise<AssetsListResponse> {
    return get<AssetsListResponse>(ROUTES.ASSETS.LIST);
  },
};
