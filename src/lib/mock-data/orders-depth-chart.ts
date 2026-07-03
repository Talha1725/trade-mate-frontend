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

  return roundDepth(
    clamp(
      blockPulse *
        clusterPattern *
        alternator *
        skew *
        burst *
        taper *
        (0.24 + noise * 0.88 + waveLift * 0.48 + Math.abs(zigzag) * 0.24) *
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
      bids: roundDepth(clamp(100 - (total / maxBidTotal) * 100, 0, 100)),
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

export function formatDepthPriceTick(price: number): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: price < 1 ? 4 : 2,
  }).format(price);
}
