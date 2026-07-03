import type { OrdersMetricCard } from "@/types/orders-metric-card";
import type { MarketCandle, MarketQuote } from "@/types/market";
import type { OrderBookRow, OrderBookSnapshot } from "@/types/order-book";
import type { DepthChartPoint } from "@/types/orders-depth-chart";
import type { OrderDepthChartResponse } from "@/types/orders";
import type { PortfolioAccount, PortfolioPosition, PortfolioTrade } from "@/types/dashboard";

function round(value: number, digits = 2) {
  return Number(value.toFixed(digits));
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function wave(progress: number, frequency: number, amplitude: number, phase = 0) {
  return Math.sin(progress * frequency + phase) * amplitude;
}

function roundDepth(value: number) {
  return Math.round(value * 100) / 100;
}

function roundToTick(value: number, tickSize: number) {
  return Number((Math.round(value / tickSize) * tickSize).toFixed(tickSize < 1 ? 4 : 2));
}

function getSpreadPercent(assetCategory: string) {
  switch (assetCategory.toUpperCase()) {
    case "CRYPTO":
      return 0.1;
    case "FOREX":
      return 0.03;
    default:
      return 0.05;
  }
}

function getTickSize(price: number) {
  if (price >= 1000) return 0.5;
  if (price >= 100) return 0.05;
  if (price >= 1) return 0.01;
  return 0.0001;
}

function hashSeed(value: string) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function seededNoise(seed: string) {
  const hash = hashSeed(seed);
  return (hash % 10_000) / 10_000;
}

function getBaseSize(assetCategory: string, price: number) {
  switch (assetCategory.toUpperCase()) {
    case "FOREX":
      return Math.max(400, price * 25);
    case "STOCK":
      return Math.max(10, price * 0.18);
    case "INDEX":
      return Math.max(6, price * 0.08);
    default:
      return Math.max(0.08, 12_000 / Math.max(price, 1));
  }
}

function buildSideRows({
  symbol,
  assetCategory,
  side,
  latestPrice,
  bestPrice,
  levels,
  tickSize,
}: {
  symbol: string;
  assetCategory: string;
  side: "ask" | "bid";
  latestPrice: number;
  bestPrice: number;
  levels: number;
  tickSize: number;
}): OrderBookRow[] {
  const clampedLevels = Math.min(Math.max(Math.trunc(levels), 6), 10);
  const baseSize = getBaseSize(assetCategory, latestPrice);
  const sizes = Array.from({ length: clampedLevels }, (_, index) => {
    const price = side === "ask" ? bestPrice + tickSize * index : bestPrice - tickSize * index;
    const seed = `${symbol}:${assetCategory}:${side}:${index}:${Math.round(price / tickSize)}`;
    const noise = seededNoise(seed);
    const taper = side === "ask" ? 1 + index * 0.08 : 1 + index * 0.07;
    return round(baseSize * taper * (0.72 + noise * 0.52), 4);
  });

  let cumulative = 0;
  const cumulativeTotals = sizes.map((size) => {
    cumulative = round(cumulative + size, 4);
    return cumulative;
  });
  const maxTotal = cumulativeTotals[cumulativeTotals.length - 1] ?? 0;

  return sizes.map((size, index) => {
    const price = side === "ask" ? bestPrice + tickSize * index : bestPrice - tickSize * index;
    const total = cumulativeTotals[index] ?? 0;
    return {
      id: `${side}-${index + 1}`,
      price: roundToTick(price, tickSize),
      size,
      total,
      barPercent: maxTotal > 0 ? round((total / maxTotal) * 100, 2) : 0,
    };
  });
}

function buildDepthWindow(centerPrice: number) {
  const halfWindow = Math.max(centerPrice * 0.01, centerPrice >= 100 ? 1 : 0.05);

  return {
    priceMin: roundDepth(Math.max(centerPrice - halfWindow, 0.01)),
    priceMax: roundDepth(centerPrice + halfWindow),
  };
}

function buildDepthStepSize({
  symbol,
  side,
  index,
  levels,
  price,
  multiplier,
}: {
  symbol: string;
  side: "bid" | "ask";
  index: number;
  levels: number;
  price: number;
  multiplier: number;
}) {
  const progress = index / Math.max(levels - 1, 1);
  const seed = `${symbol}:${side}:${index}:${Math.round(price / Math.max(getTickSize(price), 0.0001))}`;
  const noise = seededNoise(seed);
  const block = Math.floor(index / 3);
  const blockPulse = 0.55 + Math.abs(Math.sin((block + 1) * 1.41 + noise * 8.3)) * 1.45;
  const clusterPattern = block % 4 === 0 ? 1.34 : block % 4 === 1 ? 0.8 : block % 4 === 2 ? 1.12 : 0.92;
  const alternator = index % 2 === 0 ? 1.16 : 0.84;
  const skew = index % 3 === 0 ? 1.18 : index % 3 === 1 ? 0.88 : 1.03;
  const zigzag =
    Math.sin(index * (side === "bid" ? 2.45 : 2.18) + noise * 10.2) * (side === "bid" ? 0.95 : 1.02) +
    Math.cos(index * (side === "bid" ? 4.9 : 4.5) + noise * 6.6) * 0.42;
  const burst =
    index % 5 === 0 ? 1.42 : index % 7 === 0 ? 0.72 : index % 4 === 0 ? 1.16 : index % 3 === 0 ? 1.06 : 0.92;
  const taper = side === "bid" ? 1.08 - progress * 0.18 : 0.96 + progress * 0.2;
  const waveLift =
    Math.abs(wave(progress, side === "bid" ? 9.1 : 9.6, side === "bid" ? 0.72 : 0.78, noise * 4.1)) +
    Math.abs(wave(progress, side === "bid" ? 17.4 : 16.8, side === "bid" ? 0.38 : 0.42, noise * 7.2));

  return round(
    Math.max(
      0.02,
      blockPulse *
        clusterPattern *
        alternator *
        skew *
        burst *
        taper *
        (0.24 + noise * 0.88 + waveLift * 0.48 + Math.abs(zigzag) * 0.24) *
        multiplier,
    ),
    4,
  );
}

function buildAxisTicks(min: number, max: number, count = 7) {
  if (max <= min) {
    return [round(min)];
  }

  const ticks: number[] = [];
  for (let index = 0; index < count; index += 1) {
    const progress = index / (count - 1);
    ticks.push(round(min + (max - min) * progress));
  }

  return Array.from(new Set(ticks));
}

function buildDepthSeries(
  centerPrice: number,
  priceMin: number,
  priceMax: number,
  multiplier: number,
): DepthChartPoint[] {
  const bidSteps = 30;
  const askSteps = 30;
  const bidSpan = Math.max(centerPrice - priceMin, 0.01);
  const askSpan = Math.max(priceMax - centerPrice, 0.01);
  const bidSizes = Array.from({ length: bidSteps }, (_, index) => {
    const progress = index / Math.max(bidSteps - 1, 1);
    const price = roundDepth(priceMin + bidSpan * progress);
    return buildDepthStepSize({
      symbol: String(centerPrice),
      side: "bid",
      index,
      levels: bidSteps,
      price,
      multiplier,
    });
  });
  const askSizes = Array.from({ length: askSteps }, (_, index) => {
    const progress = index / Math.max(askSteps - 1, 1);
    const price = roundDepth(centerPrice + askSpan * progress);
    return buildDepthStepSize({
      symbol: String(centerPrice),
      side: "ask",
      index,
      levels: askSteps,
      price,
      multiplier,
    });
  });

  let runningBid = 0;
  const bidTotals = bidSizes.map((size) => {
    runningBid = roundDepth(runningBid + size);
    return runningBid;
  });
  let runningAsk = 0;
  const askTotals = askSizes.map((size) => {
    runningAsk = roundDepth(runningAsk + size);
    return runningAsk;
  });

  const maxBidTotal = bidTotals[bidTotals.length - 1] ?? 1;
  const maxAskTotal = askTotals[askTotals.length - 1] ?? 1;

  const points: DepthChartPoint[] = bidSizes.map((size, index) => {
    const progress = index / Math.max(bidSteps - 1, 1);
    const price = roundDepth(priceMin + bidSpan * progress);
    const total = bidTotals[index] ?? 0;
    return {
      price,
      bids: roundDepth(clamp(100 - (total / maxBidTotal) * 100, 0, 100)),
      asks: null,
    };
  });

  const centerBidDepth = points[points.length - 1]?.bids ?? 0;
  const centerAskDepth = roundDepth(clamp((askTotals[0] ?? 0) / maxAskTotal * 100, 0, 100));

  points.push({
    price: centerPrice,
    bids: centerBidDepth,
    asks: centerAskDepth,
  });

  askSizes.forEach((_, index) => {
    const progress = (index + 1) / askSteps;
    const price = roundDepth(centerPrice + askSpan * progress);
    const total = askTotals[index] ?? 0;
    points.push({
      price,
      bids: null,
      asks: roundDepth(clamp((total / maxAskTotal) * 100, 0, 100)),
    });
  });

  return points;
}

export function sizeLabelFromSymbol(symbol: string) {
  const base = symbol.toUpperCase().replace(/(USDT|USD)$/i, "");
  return base || "Qty";
}

export function buildOrderMetrics(
  account?: PortfolioAccount | null,
  positions: PortfolioPosition[] = [],
  trades: PortfolioTrade[] = [],
): OrdersMetricCard[] {
  const closedTrades = trades.filter((trade) => trade.status === "CLOSED");
  const todayKey = new Date().toISOString().slice(0, 10);
  const todayClosedTrades = closedTrades.filter((trade) => (trade.closedAt ?? trade.openedAt).slice(0, 10) === todayKey);
  const averageSlippage =
    closedTrades.length > 0
      ? closedTrades.reduce((sum, trade) => {
          const entry = Number(trade.entryPrice);
          const exit = Number(trade.exitPrice ?? trade.entryPrice);
          if (entry <= 0) {
            return sum;
          }
          return sum + Math.abs(exit - entry) / entry;
        }, 0) / closedTrades.length
      : 0;
  const riskUtilization =
    account && Number(account.equity) > 0
      ? (Number(account.marginUsed) / Number(account.equity)) * 100
      : 0;

  return [
    {
      id: "pending-orders",
      variant: "icon",
      title: "Pending Orders",
      value: String(positions.filter((position) => position.status === "OPEN").length),
      subtitle: "Awaiting fill",
      iconSrc: "/images/orders/pending.svg",
    },
    {
      id: "today-filled",
      variant: "icon",
      title: "Today Filled",
      value: String(todayClosedTrades.length),
      subtitle:
        todayClosedTrades.length > 0
          ? `${todayClosedTrades.length >= closedTrades.length ? "All" : `${todayClosedTrades.length}`} closed today`
          : "No fills today",
      subtitleTone: todayClosedTrades.length > 0 ? "positive" : "default",
      iconSrc: "/images/orders/filled.svg",
    },
    {
      id: "average-slippage",
      variant: "chart",
      title: "Average Slippage",
      value: `${(averageSlippage * 100).toFixed(2)}%`,
      subtitle: averageSlippage > 0.001 ? "Very low execution drag" : "Near zero execution drag",
      chartValues: Array.from({ length: 12 }, (_, index) => {
        const waveSeed = Math.sin(index * 0.7) * 0.015 + Math.sin(index * 0.23 + 0.5) * 0.006;
        return Number(Math.max(0.01, averageSlippage * 100 + waveSeed).toFixed(3));
      }),
    },
    {
      id: "risk-utilization",
      variant: "icon",
      title: "Risk Utilization",
      value: `${Math.round(riskUtilization)}%`,
      subtitle: riskUtilization > 50 ? "Above safe threshold" : "Within daily threshold",
      valueTone: riskUtilization > 50 ? "default" : "positive",
      iconSrc: "/images/orders/risk.svg",
    },
  ];
}

export function buildOrderDepthChart(
  candles: MarketCandle[],
  price: number,
): OrderDepthChartResponse {
  const centerPrice = round(price, 2);
  const { priceMin, priceMax } = buildDepthWindow(centerPrice);

  return {
    defaultLevel: "100",
    priceMin,
    priceMax,
    centerPrice,
    axisTicks: buildAxisTicks(priceMin, priceMax),
    dataByLevel: {
      "100": buildDepthSeries(centerPrice, priceMin, priceMax, 1),
      "250": buildDepthSeries(centerPrice, priceMin, priceMax, 1.03),
      "500": buildDepthSeries(centerPrice, priceMin, priceMax, 1.06),
    },
  };
}

export function generateEodhdOrderBook({
  symbol,
  assetCategory,
  latestPrice,
  bid,
  ask,
  levels = 6,
}: {
  symbol: string;
  assetCategory: string;
  latestPrice: number;
  bid?: number | null;
  ask?: number | null;
  levels?: number;
}): OrderBookSnapshot {
  const midPrice = round(latestPrice, latestPrice >= 100 ? 2 : 4);
  const tickSize = getTickSize(midPrice);
  const spreadPercent = getSpreadPercent(assetCategory);
  const fallbackBid = midPrice * (1 - spreadPercent / 200);
  const fallbackAsk = midPrice * (1 + spreadPercent / 200);
  const bestBid = roundToTick(bid ?? fallbackBid, tickSize);
  const bestAsk = roundToTick(ask ?? fallbackAsk, tickSize);
  const spread = round(Math.max(bestAsk - bestBid, tickSize), tickSize >= 1 ? 2 : 4);
  const spreadPercentValue = round((spread / Math.max(midPrice, 0.0001)) * 100, 4);

  return {
    midPrice,
    bestBid,
    bestAsk,
    midDirection: latestPrice >= (bestBid + bestAsk) / 2 ? "up" : "down",
    spread,
    spreadPercent: spreadPercentValue,
    asks: buildSideRows({
      symbol,
      assetCategory,
      side: "ask",
      latestPrice: midPrice,
      bestPrice: bestAsk,
      levels,
      tickSize,
    }),
    bids: buildSideRows({
      symbol,
      assetCategory,
      side: "bid",
      latestPrice: midPrice,
      bestPrice: bestBid,
      levels,
      tickSize,
    }),
    isSimulated: true,
    source: "EODHD",
  };
}

export function buildOrderBookSnapshot(candles: MarketCandle[], price: number): OrderBookSnapshot {
  void candles;
  return generateEodhdOrderBook({
    symbol: "BTCUSDT",
    assetCategory: "CRYPTO",
    latestPrice: price,
    levels: 6,
  });
}

export function applyLiveQuoteToOrderOverview<T extends { snapshot: { price: number; changePercent: number }; chart: { open: number; close: number; change: number; changePercent: number }; orderBook: OrderBookSnapshot }>(
  overview: T,
  quote?: MarketQuote | null,
) {
  if (!quote) {
    return overview;
  }

  const change = quote.price - overview.chart.open;
  const changePercent = overview.chart.open !== 0 ? (change / overview.chart.open) * 100 : 0;

  return {
    ...overview,
    snapshot: {
      ...overview.snapshot,
      price: quote.price,
      changePercent: quote.changePercent ?? changePercent,
    },
    chart: {
      ...overview.chart,
      close: quote.price,
      change,
      changePercent,
    },
    orderBook: {
      ...overview.orderBook,
      midPrice: quote.price,
      midDirection: quote.change != null ? (quote.change >= 0 ? "up" : "down") : overview.orderBook.midDirection,
    },
  };
}
