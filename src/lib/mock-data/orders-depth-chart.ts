import type { DepthChartLevel, DepthChartPoint } from "@/types/orders-depth-chart";

export const DEPTH_CHART_LEVELS: DepthChartLevel[] = ["100", "250", "500"];

export const DEPTH_CHART_PRICE_MIN = 69_098;
export const DEPTH_CHART_PRICE_MAX = 69_106;
export const DEPTH_CHART_CENTER_PRICE = 69_102;
export const DEPTH_CHART_AXIS_TICKS = [
  69_098, 69_099, 69_100, 69_101, 69_102, 69_103, 69_104, 69_105, 69_106,
];

const PRICE_STEP = 0.05;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function roundDepth(value: number): number {
  return Math.round(value * 100) / 100;
}

function wave(progress: number, frequency: number, amplitude: number, phase = 0): number {
  return Math.sin(progress * frequency + phase) * amplitude;
}

function hashSeed(value: string): number {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function seededNoise(seed: string): number {
  const hash = hashSeed(seed);
  return (hash % 10_000) / 10_000;
}

function buildDepthStepSize({
  side,
  index,
  steps,
  price,
  multiplier,
}: {
  side: "bid" | "ask";
  index: number;
  steps: number;
  price: number;
  multiplier: number;
}) {
  const progress = index / Math.max(steps - 1, 1);
  const seed = `${side}:${index}:${Math.round(price / Math.max(PRICE_STEP, 0.0001))}:${DEPTH_CHART_CENTER_PRICE}`;
  const noise = seededNoise(seed);
  const block = Math.floor(index / 2);
  const rhythm =
    [2.2, 0.56, 1.68, 0.84, 1.42, 0.48, 1.92, 0.72][(index + (side === "bid" ? 1 : 3)) % 8];
  const blockPulse = 0.68 + Math.abs(Math.sin((block + 1) * 1.55 + noise * 7.7)) * 1.18;
  const clusterPattern = 0.72 + Math.abs(Math.sin((Math.floor(index / 4) + 1) * 2.1 + noise * 5.3)) * 1.28;
  const alternator = index % 2 === 0 ? 1.24 : 0.78;
  const skew = index % 3 === 0 ? 1.28 : index % 3 === 1 ? 0.72 : 1.1;
  const zigzag =
    Math.sin(index * (side === "bid" ? 2.95 : 2.72) + noise * 12.4) * (side === "bid" ? 1.08 : 1.14) +
    Math.cos(index * (side === "bid" ? 5.8 : 5.1) + noise * 8.1) * 0.58;
  const burst =
    index % 5 === 0 ? 1.62 : index % 7 === 0 ? 0.58 : index % 4 === 0 ? 1.28 : index % 3 === 0 ? 1.18 : 0.9;
  const taper = side === "bid" ? 1.16 - progress * 0.32 : 0.88 + progress * 0.46;
  const waveLift =
    Math.abs(wave(progress, side === "bid" ? 10.2 : 10.8, side === "bid" ? 0.88 : 0.94, noise * 4.9)) +
    Math.abs(wave(progress, side === "bid" ? 21.4 : 20.2, side === "bid" ? 0.42 : 0.48, noise * 7.9));

  return roundDepth(
    clamp(
      blockPulse *
        clusterPattern *
        alternator *
        skew *
        rhythm *
        burst *
        taper *
        (0.18 + noise * 0.84 + waveLift * 0.52 + Math.abs(zigzag) * 0.28) *
        multiplier,
      0.02,
      100,
    ),
  );
}

function generateDepthSeries(): DepthChartPoint[] {
  const points: DepthChartPoint[] = [];
  const bidSteps = 30;
  const askSteps = 30;

  const bidSizes = Array.from({ length: bidSteps }, (_, index) => {
    const progress = index / Math.max(bidSteps - 1, 1);
    const price = roundDepth(DEPTH_CHART_PRICE_MIN + (DEPTH_CHART_CENTER_PRICE - DEPTH_CHART_PRICE_MIN) * progress);
    return buildDepthStepSize({
      side: "bid",
      index,
      steps: bidSteps,
      price,
      multiplier: 1,
    });
  });
  const askSizes = Array.from({ length: askSteps }, (_, index) => {
    const progress = index / Math.max(askSteps - 1, 1);
    const price = roundDepth(DEPTH_CHART_CENTER_PRICE + PRICE_STEP + (DEPTH_CHART_PRICE_MAX - (DEPTH_CHART_CENTER_PRICE + PRICE_STEP)) * progress);
    return buildDepthStepSize({
      side: "ask",
      index,
      steps: askSteps,
      price,
      multiplier: 1,
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

  bidSizes.forEach((_, index) => {
    const price = roundDepth(DEPTH_CHART_PRICE_MIN + (DEPTH_CHART_CENTER_PRICE - DEPTH_CHART_PRICE_MIN) * (index / Math.max(bidSteps - 1, 1)));
    const total = bidTotals[index] ?? 0;
    points.push({
      price,
      bids: roundDepth(clamp((total / maxBidTotal) * 100, 0, 100)),
      asks: null,
    });
  });

  points.push({
    price: DEPTH_CHART_CENTER_PRICE,
    bids: points[points.length - 1]?.bids ?? 0,
    asks: roundDepth(clamp((askTotals[0] ?? 0) / maxAskTotal * 100, 0, 100)),
  });

  askSizes.forEach((_, index) => {
    const price = roundDepth(DEPTH_CHART_CENTER_PRICE + PRICE_STEP + (DEPTH_CHART_PRICE_MAX - (DEPTH_CHART_CENTER_PRICE + PRICE_STEP)) * (index / Math.max(askSteps - 1, 1)));
    const total = askTotals[index] ?? 0;
    points.push({
      price,
      bids: null,
      asks: roundDepth(clamp((total / maxAskTotal) * 100, 0, 100)),
    });
  });

  return points;
}

function scaleDepthPoints(points: DepthChartPoint[], multiplier: number): DepthChartPoint[] {
  return points.map((point) => ({
    price: point.price,
    bids: point.bids === null ? null : roundDepth(clamp(point.bids * multiplier, 2.4, 100)),
    asks: point.asks === null ? null : roundDepth(clamp(point.asks * multiplier, 2.4, 100)),
  }));
}

const BASE_DEPTH_POINTS = generateDepthSeries();

export const mockDepthChartData: Record<DepthChartLevel, DepthChartPoint[]> = {
  "100": BASE_DEPTH_POINTS,
  "250": scaleDepthPoints(BASE_DEPTH_POINTS, 1.03),
  "500": scaleDepthPoints(BASE_DEPTH_POINTS, 1.06),
};

const FOREX_PREFIXES = ["AUD", "CAD", "CHF", "EUR", "GBP", "JPY", "NZD", "USD"];

function isForexSymbol(symbol?: string | null) {
  if (!symbol) {
    return false;
  }

  const normalized = symbol.trim().toUpperCase();

  if (normalized.length !== 6) {
    return false;
  }

  const base = normalized.slice(0, 3);
  const quote = normalized.slice(3);

  return FOREX_PREFIXES.includes(base) && FOREX_PREFIXES.includes(quote);
}

function getDepthPriceDecimals(price: number, symbol?: string | null, assetClass?: string | null) {
  if (assetClass === "FOREX" || isForexSymbol(symbol)) {
    return 5;
  }

  return price < 1 ? 4 : 2;
}

export function formatDepthPriceTick(price: number, symbol?: string | null, assetClass?: string | null): string {
  const fractionDigits = getDepthPriceDecimals(price, symbol, assetClass);

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(price);
}
