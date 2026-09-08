import { ROUTES } from "@/constant/routes";
import { get } from "@/lib/utils/api";
import type { AssetsListResponse } from "@/types/asset";

export const assetsApi = {
  async getAssets(): Promise<AssetsListResponse> {
    const response = await get<AssetsListResponse | AssetsListResponse["assets"]>(ROUTES.ASSETS.LIST);

    return {
      assets: Array.isArray(response) ? response : response.assets,
    };
  },
};
