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
  return Math.round(value * 10) / 10;
}

function wave(progress: number, frequency: number, amplitude: number, phase = 0): number {
  return Math.sin(progress * frequency + phase) * amplitude;
}

function buildBidEnvelope(progress: number): number {
  const envelope = 99.2 - progress * 94.8;
  const noise =
    wave(progress, 47.3, 7.8) +
    wave(progress, 112.7, 5.4, 1.2) +
    wave(progress, 73.1, 6.1, 2.4) +
    wave(progress, 203.5, 3.7, 0.8) +
    wave(progress, 31.9, 4.9, 3.1) +
    wave(progress, 168.2, 2.6, 4.5);

  return roundDepth(clamp(envelope + noise, 2.4, 100));
}

function buildAskEnvelope(progress: number): number {
  const envelope = 3.1 + progress * 95.4;
  const noise =
    wave(progress, 52.8, 7.4, 0.6) +
    wave(progress, 121.3, 5.8, 2.1) +
    wave(progress, 68.4, 6.3, 1.7) +
    wave(progress, 198.6, 3.9, 3.3) +
    wave(progress, 37.5, 4.4, 0.4) +
    wave(progress, 155.9, 2.8, 2.9);

  return roundDepth(clamp(envelope + noise, 2.4, 100));
}

function generateDepthSeries(): DepthChartPoint[] {
  const points: DepthChartPoint[] = [];
  const bidSteps = Math.round((DEPTH_CHART_CENTER_PRICE - DEPTH_CHART_PRICE_MIN) / PRICE_STEP);
  const askSteps = Math.round((DEPTH_CHART_PRICE_MAX - DEPTH_CHART_CENTER_PRICE) / PRICE_STEP);

  for (let index = 0; index < bidSteps; index += 1) {
    const price = roundDepth(DEPTH_CHART_PRICE_MIN + index * PRICE_STEP);
    const progress = index / bidSteps;
    points.push({
      price,
      bids: buildBidEnvelope(progress),
      asks: null,
    });
  }

  const centerDepth = roundDepth((buildBidEnvelope(1) + buildAskEnvelope(0)) / 2);
  points.push({
    price: DEPTH_CHART_CENTER_PRICE,
    bids: centerDepth,
    asks: centerDepth,
  });

  for (let index = 1; index <= askSteps; index += 1) {
    const price = roundDepth(DEPTH_CHART_CENTER_PRICE + index * PRICE_STEP);
    const progress = index / askSteps;
    points.push({
      price,
      bids: null,
      asks: buildAskEnvelope(progress),
    });
  }

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
  const whole = Math.round(price);
  const digits = whole.toString();

  if (digits.length <= 3) {
    return digits;
  }

  return `${digits.slice(0, -3)},${digits.slice(-3)}`;
}
