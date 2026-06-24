import type { TradingTimeframe } from "@/types/trading-filter-bar";
import type { TradingViewAdvancedChartConfig } from "@/types/trading-view";

export type { TradingViewAdvancedChartConfig };

const ADVANCED_CHART_EMBED_HOST = "https://www.tradingview-widget.com";

export function resolveTradingViewSymbol(symbol: string) {
  const normalizedSymbol = symbol.trim().toUpperCase();

  if (!normalizedSymbol) {
    return "OANDA:EURUSD";
  }

  if (normalizedSymbol.includes(":")) {
    return normalizedSymbol;
  }

  return `OANDA:${normalizedSymbol}`;
}

export function mapTimeframeToTradingViewInterval(timeframe: TradingTimeframe) {
  const intervalMap: Record<TradingTimeframe, string> = {
    "1m": "1",
    "5m": "5",
    "15m": "15",
    "1H": "60",
    "4H": "240",
    D: "D",
    W: "W",
  };

  return intervalMap[timeframe];
}

function getPageUri() {
  if (typeof window === "undefined") {
    return "";
  }

  return window.location.href.replace(/^https?:\/\//, "");
}

export function buildAdvancedChartEmbedUrl({
  symbol,
  interval,
  compareSymbol = null,
}: TradingViewAdvancedChartConfig) {
  const url = new URL(`${ADVANCED_CHART_EMBED_HOST}/embed-widget/advanced-chart/`);
  url.searchParams.set("locale", "en");
  url.searchParams.set("symbol", symbol);

  const hashConfig: Record<string, unknown> = {
    autosize: true,
    symbol,
    interval,
    timezone: "Etc/UTC",
    theme: "dark",
    style: "1",
    locale: "en",
    enable_publishing: false,
    allow_symbol_change: false,
    hide_side_toolbar: false,
    hide_top_toolbar: false,
    save_image: false,
    backgroundColor: "rgba(0, 0, 0, 0)",
    gridColor: "rgba(255, 255, 255, 0.06)",
    "page-uri": getPageUri(),
  };

  if (compareSymbol) {
    hashConfig.compareSymbols = [
      {
        symbol: compareSymbol,
        position: "SameScale",
      },
    ];
  }

  url.hash = encodeURIComponent(JSON.stringify(hashConfig));
  return url.toString();
}

