import { NextRequest, NextResponse } from "next/server";

function backendUrl() {
  return process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4100";
}

export async function GET(request: NextRequest) {
  const symbols = (request.nextUrl.searchParams.get("symbols") ?? "")
    .split(",")
    .map((symbol) => symbol.trim().toUpperCase())
    .filter(Boolean);
  const authorization = request.headers.get("authorization");
  const headers = authorization ? { authorization } : undefined;
  const snapshots = await Promise.all(
    symbols.map(async (symbol) => {
      const url = new URL("/api/v2/market/snapshot", backendUrl());
      url.searchParams.set("symbol", symbol);
      url.searchParams.set("interval", "M1");
      url.searchParams.set("limit", "1");

      const response = await fetch(url, { cache: "no-store", headers });

      if (!response.ok) {
        return null;
      }

      return response.json();
    }),
  );

  const quotes = Object.fromEntries(
    snapshots.flatMap((snapshot) => {
      const latest = snapshot?.data?.candles?.at(-1) ?? snapshot?.candles?.at(-1);
      const quote = snapshot?.data?.quote ?? snapshot?.quote;
      const day = snapshot?.data?.day ?? snapshot?.day;
      const symbol = snapshot?.data?.symbol ?? snapshot?.symbol;
      const price = quote?.last ?? latest?.close;

      if (!symbol || price == null) {
        return [];
      }

      return [[symbol, {
        symbol,
        eodhdSymbol: symbol,
        price,
        change: day?.change ?? 0,
        changePercent: day?.changePercent ?? 0,
        open: day?.open ?? latest?.open ?? price,
        high: day?.high ?? latest?.high ?? price,
        low: day?.low ?? latest?.low ?? price,
        volume: day?.volume ?? latest?.volume ?? 0,
        timestamp: latest?.openTime ?? new Date().toISOString(),
        dataSource: quote ? "realtime" : "eod",
      }]];
    }),
  );

  return NextResponse.json({ quotes });
}
