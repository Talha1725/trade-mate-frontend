import { get } from "@/lib/utils/api";
import type { V2Candle, V2CandleInterval, V2MarketSnapshot } from "@/types/v2-market";

const SNAPSHOT_CACHE_TTL_MS = 2_000;
const MAX_CACHE_ENTRIES = 100;

const snapshotCache = new Map<string, {
  expiresAt: number;
  promise: Promise<V2MarketSnapshot>;
}>();

const candlesCache = new Map<string, {
  expiresAt: number;
  promise: Promise<V2Candle[]>;
}>();

function cacheKey(params: Record<string, string | number | undefined>) {
  return Object.entries(params)
    .filter(([, value]) => value !== undefined)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}:${value}`)
    .join("|");
}

function readThroughCache<T>(
  cache: Map<string, { expiresAt: number; promise: Promise<T> }>,
  key: string,
  loader: () => Promise<T>,
) {
  const now = Date.now();
  const cached = cache.get(key);

  if (cached && cached.expiresAt > now) {
    return cached.promise;
  }

  if (cached) {
    cache.delete(key);
  }

  for (const [cacheKey, value] of cache) {
    if (value.expiresAt <= now) {
      cache.delete(cacheKey);
    }
  }

  if (cache.size >= MAX_CACHE_ENTRIES) {
    const oldestKey = cache.keys().next().value;
    if (oldestKey) {
      cache.delete(oldestKey);
    }
  }

  const promise = loader().catch((error) => {
    cache.delete(key);
    throw error;
  });

  cache.set(key, {
    expiresAt: now + SNAPSHOT_CACHE_TTL_MS,
    promise,
  });

  return promise;
}

export function getV2MarketSnapshot(params: {
  symbol: string;
  interval: V2CandleInterval;
  limit?: number;
  authToken?: string;
}) {
  const normalizedParams = {
    symbol: params.symbol.toUpperCase(),
    interval: params.interval,
    limit: params.limit,
  };
  const key = cacheKey(normalizedParams);

  return readThroughCache(snapshotCache, key, () =>
    get<V2MarketSnapshot>("/api/market/snapshot", {
      params: normalizedParams,
      headers: params.authToken ? { Authorization: `Bearer ${params.authToken}` } : undefined,
    }),
  );
}

export function getV2MarketCandles(params: {
  symbol: string;
  interval: V2CandleInterval;
  limit?: number;
  authToken?: string;
}) {
  const normalizedParams = {
    symbol: params.symbol.toUpperCase(),
    interval: params.interval,
    limit: params.limit,
  };
  const key = cacheKey(normalizedParams);

  return readThroughCache(candlesCache, key, () =>
    get<V2Candle[]>("/api/market/candles", {
      params: normalizedParams,
      headers: params.authToken ? { Authorization: `Bearer ${params.authToken}` } : undefined,
    }),
  );
}
