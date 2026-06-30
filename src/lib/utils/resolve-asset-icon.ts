import { resolveForexPairIcon } from "@/lib/utils/forex-flag";
import { resolveCryptoIconCode } from "@/lib/utils/resolve-crypto-icon";
import type { ResolvedAssetIcon } from "@/types/asset-icon";

export function resolveAssetIcon(symbol: string): ResolvedAssetIcon {
  const cryptoCode = resolveCryptoIconCode(symbol);

  if (cryptoCode) {
    return {
      kind: "crypto",
      code: cryptoCode,
    };
  }

  const forexIcon = resolveForexPairIcon(symbol);

  if (forexIcon?.kind === "forex-mixed") {
    return {
      kind: "forex-mixed",
      cryptoCode: forexIcon.cryptoCode,
      quoteFlag: forexIcon.quoteFlag,
    };
  }

  if (forexIcon?.kind === "forex") {
    return {
      kind: "forex",
      flagCodes: forexIcon.flagCodes,
    };
  }

  return {
    kind: "stock",
  };
}
