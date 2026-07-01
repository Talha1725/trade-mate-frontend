export type CompareAssetItem = {
  id: string;
  symbol: string;
  name: string;
};

export type CompareAssetsDropdownProps = {
  primaryAssetId: string;
  compareAssetId?: string | null;
  onCompareChange?: (assetId: string | null) => void;
  className?: string;
};
