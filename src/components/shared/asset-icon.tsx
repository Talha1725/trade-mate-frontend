"use client";

import Image from "next/image";
import ReactCountryFlag from "react-country-flag";

import { getCryptoIconSrc } from "@/lib/utils/crypto-icon";
import { resolveAssetIcon } from "@/lib/utils/resolve-asset-icon";
import { cn } from "@/lib/utils";
import type { AssetIconProps } from "@/types/asset-icon";

export function AssetIcon({
  symbol,
  label,
  size = 20,
  className,
}: AssetIconProps) {
  const resolved = resolveAssetIcon(symbol);
  const alt = label ?? symbol;

  if (resolved.kind === "crypto") {
    return (
      <span
        className={cn(
          "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full",
          className,
        )}
        style={{ width: size, height: size }}
      >
        <Image
          src={getCryptoIconSrc(resolved.code)}
          alt={alt}
          width={size}
          height={size}
          unoptimized
          className="size-full object-contain"
        />
      </span>
    );
  }

  if (resolved.kind === "forex-mixed") {
    const flagSize = Math.round(size * 0.72);

    return (
      <span
        className={cn("relative flex shrink-0 items-center", className)}
        style={{ width: size, height: size }}
        aria-label={alt}
      >
        <span
          className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-full"
          style={{ width: flagSize, height: flagSize }}
        >
          <Image
            src={getCryptoIconSrc(resolved.cryptoCode)}
            alt={alt}
            width={flagSize}
            height={flagSize}
            unoptimized
            className="size-full object-contain"
          />
        </span>
        <ReactCountryFlag
          countryCode={resolved.quoteFlag}
          svg
          aria-hidden
          className="-ml-1.5"
          style={{
            width: flagSize,
            height: flagSize,
            borderRadius: "9999px",
            objectFit: "cover",
          }}
        />
      </span>
    );
  }

  if (resolved.kind === "forex") {
    const [baseFlag, quoteFlag] = resolved.flagCodes;
    const flagSize = Math.round(size * 0.72);

    return (
      <span
        className={cn("relative flex shrink-0 items-center", className)}
        style={{ width: size, height: size }}
        aria-label={alt}
      >
        <ReactCountryFlag
          countryCode={baseFlag}
          svg
          aria-hidden
          style={{
            width: flagSize,
            height: flagSize,
            borderRadius: "9999px",
            objectFit: "cover",
          }}
        />
        <ReactCountryFlag
          countryCode={quoteFlag}
          svg
          aria-hidden
          className="-ml-1.5"
          style={{
            width: flagSize,
            height: flagSize,
            borderRadius: "9999px",
            objectFit: "cover",
          }}
        />
      </span>
    );
  }

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-muted-foreground/30 text-[9px] font-bold text-white",
        className,
      )}
      style={{ width: size, height: size }}
      aria-label={alt}
    >
      ST
    </span>
  );
}
