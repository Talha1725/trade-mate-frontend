"use client";

import * as React from "react";
import { AlertTriangleIcon, Loader2Icon, MoveUpRightIcon } from "lucide-react";

import { SectionCard } from "@/components/section-card";
import { cn } from "@/lib/utils";
import type { TradingChartProps } from "@/types";

type TradingViewWidget = {
  widget: new (config: {
    autosize: boolean;
    symbol: string;
    interval: string;
    timezone: string;
    theme: "light" | "dark";
    style: string;
    locale: string;
    toolbar_bg?: string;
    enable_publishing?: boolean;
    allow_symbol_change?: boolean;
    hide_side_toolbar?: boolean;
    hide_top_toolbar?: boolean;
    save_image?: boolean;
    container_id: string;
  }) => unknown;
};

type TradingViewWindow = Window & {
  TradingView?: TradingViewWidget;
};

const TRADING_VIEW_SCRIPT_ID = "tradingview-widget-script";
const TRADING_VIEW_SCRIPT_SRC = "https://s3.tradingview.com/tv.js";

let tradingViewScriptPromise: Promise<void> | null = null;

function loadTradingViewScript() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("TradingView can only be loaded in the browser."));
  }

  const tradingViewWindow = window as TradingViewWindow;

  if (tradingViewWindow.TradingView) {
    return Promise.resolve();
  }

  if (!tradingViewScriptPromise) {
    tradingViewScriptPromise = new Promise((resolve, reject) => {
      const existingScript = document.getElementById(TRADING_VIEW_SCRIPT_ID) as HTMLScriptElement | null;

      if (existingScript) {
        existingScript.addEventListener("load", () => resolve(), { once: true });
        existingScript.addEventListener("error", () => reject(new Error("Unable to load TradingView widget.")), {
          once: true,
        });
        return;
      }

      const script = document.createElement("script");
      script.id = TRADING_VIEW_SCRIPT_ID;
      script.async = true;
      script.src = TRADING_VIEW_SCRIPT_SRC;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Unable to load TradingView widget."));
      document.head.appendChild(script);
    });
  }

  return tradingViewScriptPromise;
}

function resolveTradingViewSymbol(symbol: string) {
  const normalizedSymbol = symbol.trim().toUpperCase();

  if (!normalizedSymbol) {
    return "OANDA:EURUSD";
  }

  if (normalizedSymbol.includes(":")) {
    return normalizedSymbol;
  }

  return `OANDA:${normalizedSymbol}`;
}

export function TradingChart({
  symbol = "EURUSD",
  title,
  description,
  className,
  contentClassName,
}: TradingChartProps) {
  const containerId = React.useId().replace(/:/g, "-");
  const [isReady, setIsReady] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);
  const resolvedSymbol = resolveTradingViewSymbol(symbol);
  const chartTitle = title ?? `Chart - ${symbol.toUpperCase()}`;
  const chartDescription =
    description ?? "Live TradingView market view for the selected symbol.";

  React.useEffect(() => {
    let isMounted = true;
    const container = document.getElementById(containerId);

    if (!container) {
      return undefined;
    }

    container.innerHTML = "";

    loadTradingViewScript()
      .then(() => {
        if (!isMounted) {
          return;
        }

        const tradingViewWindow = window as TradingViewWindow;

        if (!tradingViewWindow.TradingView) {
          throw new Error("TradingView widget is unavailable.");
        }

        container.innerHTML = "";
        new tradingViewWindow.TradingView.widget({
          autosize: true,
          symbol: resolvedSymbol,
          interval: "60",
          timezone: "Etc/UTC",
          theme: "light",
          style: "1",
          locale: "en",
          toolbar_bg: "#f8fafc",
          enable_publishing: false,
          allow_symbol_change: true,
          hide_side_toolbar: false,
          hide_top_toolbar: false,
          save_image: false,
          container_id: containerId,
        });
        setIsReady(true);
      })
      .catch(() => {
        if (isMounted) {
          setHasError(true);
        }
      });

    return () => {
      isMounted = false;
      container.innerHTML = "";
    };
  }, [containerId, resolvedSymbol]);

  return (
    <SectionCard
      title={chartTitle}
      description={chartDescription}
      className={cn("h-full min-h-[480px] flex flex-col overflow-hidden", className)}
      contentClassName={cn("flex-1", contentClassName)}
    >
      <div className="relative h-full min-h-[360px] overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-b from-white via-white to-slate-50">
        <div
          id={containerId}
          className={cn("absolute inset-0", isReady || hasError ? "opacity-100" : "opacity-0")}
        />

        {!isReady && !hasError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <Loader2Icon className="size-5 animate-spin" />
            <span className="text-sm font-medium">Loading TradingView chart</span>
          </div>
        ) : null}

        {hasError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center text-muted-foreground">
            <AlertTriangleIcon className="size-6 text-amber-500" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">Trading chart unavailable</p>
              <p className="text-sm">
                The TradingView widget could not load, so the chart area is temporarily disabled.
              </p>
            </div>
          </div>
        ) : null}

        <div className="pointer-events-none absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/90 px-3 py-1 text-xs font-medium text-emerald-700 shadow-sm backdrop-blur">
          <MoveUpRightIcon className="size-3.5" />
          Live market view
        </div>
      </div>
    </SectionCard>
  );
}
