export type CompareAssetItem = {
  id: string;
  symbol: string;
  name: string;
};

export type CompareAssetsDropdownProps = {
  items: CompareAssetItem[];
  primaryAssetId: string;
  compareAssetId?: string | null;
  onCompareChange?: (assetId: string | null) => void;
  className?: string;
};
