"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  buildAdvancedChartEmbedUrl,
  mapTimeframeToTradingViewInterval,
  resolveTradingViewSymbol,
} from "@/lib/utils/trading-view";
import type { LiveTradingViewProps } from "@/types";

export function TradingViewWidgetChart({
  symbol = "BTCUSDT",
  compareSymbol = null,
  timeframe = "D",
  className,
}: LiveTradingViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (loadingRef.current) loadingRef.current.hidden = false;
    if (errorRef.current) errorRef.current.hidden = true;
    const iframe = document.createElement("iframe");
    iframe.title = `TradingView chart - ${symbol}`;
    iframe.lang = "en";
    iframe.setAttribute("allowtransparency", "true");
    iframe.setAttribute("scrolling", "no");
    iframe.allowFullscreen = true;
    iframe.className = "h-full w-full border-0 block opacity-0";
    iframe.src = buildAdvancedChartEmbedUrl({
      symbol: resolveTradingViewSymbol(symbol),
      interval: mapTimeframeToTradingViewInterval(timeframe),
      compareSymbol: compareSymbol ? resolveTradingViewSymbol(compareSymbol) : null,
    });

    const handleLoad = () => {
      iframe.classList.remove("opacity-0");
      if (loadingRef.current) loadingRef.current.hidden = true;
    };
    const handleError = () => {
      if (loadingRef.current) loadingRef.current.hidden = true;
      if (errorRef.current) errorRef.current.hidden = false;
    };
    iframe.addEventListener("load", handleLoad);
    iframe.addEventListener("error", handleError);
    // A hash-only navigation does not reinitialize the embedded chart.
    container.replaceChildren(iframe);
    return () => {
      iframe.removeEventListener("load", handleLoad);
      iframe.removeEventListener("error", handleError);
      container.replaceChildren();
    };
  }, [symbol, compareSymbol, timeframe]);

  return (
    <div className={cn("relative h-[420px] min-w-0 overflow-hidden rounded-lg border border-white/20 bg-black xl:h-[560px]", className)}>
      <div ref={containerRef} className="absolute inset-0" />
      <div ref={loadingRef} role="status" className="absolute inset-0 pointer-events-none text-center content-center text-sm text-white/60">
        Loading TradingView chart...
      </div>
      <div ref={errorRef} role="alert" hidden className="absolute inset-0 text-center content-center text-sm text-white/60">
        TradingView chart unavailable. Please reload the page.
      </div>
    </div>
  );
}
