export type AssetIconKind = "crypto" | "forex" | "forex-mixed" | "stock";

export type CryptoIconCode =
  | "btc"
  | "eth"
  | "sol"
  | "bnb"
  | "xrp"
  | "ada"
  | "doge"
  | "avax"
  | "link"
  | "ton"
  | "trx"
  | "dot"
  | "ltc"
  | "sui"
  | "gold";

export type AssetIconProps = {
  symbol: string;
  label?: string;
  size?: number;
  className?: string;
};

export type ResolvedCryptoIcon = {
  kind: "crypto";
  code: CryptoIconCode;
};

export type ResolvedForexIcon = {
  kind: "forex";
  flagCodes: [string, string];
};

export type ResolvedForexMixedIcon = {
  kind: "forex-mixed";
  cryptoCode: CryptoIconCode;
  quoteFlag: string;
};

export type ResolvedStockIcon = {
  kind: "stock";
};

export type ResolvedAssetIcon =
  | ResolvedCryptoIcon
  | ResolvedForexIcon
  | ResolvedForexMixedIcon
  | ResolvedStockIcon;
