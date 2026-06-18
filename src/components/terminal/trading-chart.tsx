"use client";

import * as React from "react";
import { AlertTriangleIcon, Loader2Icon, MoveUpRightIcon } from "lucide-react";

import { SectionCard } from "@/components/section-card";
import {
  buildAdvancedChartEmbedUrl,
  resolveTradingViewSymbol,
} from "@/lib/utils/trading-view";
import { cn } from "@/lib/utils";
import type { TradingChartProps } from "@/types";

export function TradingChart({
  symbol = "EURUSD",
  compareSymbol = null,
  interval = "60",
  title,
  description,
  className,
  contentClassName,
}: TradingChartProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);
  const resolvedSymbol = resolveTradingViewSymbol(symbol);
  const resolvedCompareSymbol = compareSymbol
    ? resolveTradingViewSymbol(compareSymbol)
    : null;
  const chartTitle = title ?? `Chart - ${symbol.toUpperCase()}`;
  const chartDescription =
    description ??
    (compareSymbol
      ? `Comparing ${symbol.toUpperCase()} with ${compareSymbol.toUpperCase()}.`
      : "Live TradingView market view for the selected symbol.");

  React.useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return undefined;
    }

    let isMounted = true;
    setIsReady(false);
    setHasError(false);

    const iframe = document.createElement("iframe");
    iframe.title = "TradingView Advanced Chart";
    iframe.lang = "en";
    iframe.setAttribute("allowtransparency", "true");
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("scrolling", "no");
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.display = "block";
    iframe.style.border = "0";
    iframe.src = buildAdvancedChartEmbedUrl({
      symbol: resolvedSymbol,
      interval,
      compareSymbol: resolvedCompareSymbol,
    });

    const handleLoad = () => {
      if (isMounted) {
        setIsReady(true);
      }
    };

    const handleError = () => {
      if (isMounted) {
        setHasError(true);
      }
    };

    const readyFallbackTimer = window.setTimeout(() => {
      if (isMounted) {
        setIsReady(true);
      }
    }, 1800);

    iframe.addEventListener("load", handleLoad);
    iframe.addEventListener("error", handleError);
    container.replaceChildren(iframe);

    return () => {
      isMounted = false;
      window.clearTimeout(readyFallbackTimer);
      iframe.removeEventListener("load", handleLoad);
      iframe.removeEventListener("error", handleError);
      container.replaceChildren();
    };
  }, [interval, resolvedCompareSymbol, resolvedSymbol]);

  return (
    <SectionCard
      title={chartTitle}
      description={chartDescription}
      className={cn(
        "flex h-full min-h-[480px] md:min-h-[778px] flex-col overflow-hidden border-none bg-white/5 shadow-none ring-white/20",
        className,
      )}
      contentClassName={cn("flex-1", contentClassName)}
    >
      <div className="relative h-full min-h-[360px] overflow-hidden rounded-2xl border-none bg-transparent">
        <div ref={containerRef} className="absolute inset-0" />

        {!isReady && !hasError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/60">
            <Loader2Icon className="size-5 animate-spin text-primary" />
            <span className="text-sm font-medium">Loading TradingView chart</span>
          </div>
        ) : null}

        {hasError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center text-white/60">
            <AlertTriangleIcon className="size-6 text-orange" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-white">Trading chart unavailable</p>
              <p className="text-sm">
                The TradingView widget could not load, so the chart area is temporarily disabled.
              </p>
            </div>
          </div>
        ) : null}

        <div className="pointer-events-none absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-white/5 px-3 py-1 text-xs font-medium text-primary shadow-sm backdrop-blur">
          <MoveUpRightIcon className="size-3.5" />
          {compareSymbol ? "Comparison view" : "Live market view"}
        </div>
      </div>
    </SectionCard>
  );
}
