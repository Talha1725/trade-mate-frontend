"use client";

import * as React from "react";
import { unstable_batchedUpdates } from "react-dom";

import { createLatestValueBuffer, getPriceSocketUrl } from "@/lib/utils/price-stream";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useLivePriceStore } from "@/lib/stores/live-price-store";
import type {
  PriceSocketAccountMessage,
  PriceSocketCandleMessage,
  PriceSocketPortfolioMessage,
  PriceSocketQuote,
  PriceSocketRawPrice,
  PriceSocketServerMessage,
  PriceStreamOptions,
} from "@/types/price";

function normalize(values?: string[]) {
  return Array.from(new Set((values ?? []).map((value) => value.trim()).filter((value) => value.length > 0)));
}

export function usePriceStream({
  symbols,
  enabled = true,
  onQuotes,
  onPortfolio,
  onCandle,
  onAccount,
  onError,
}: PriceStreamOptions) {
  const token = useAuthStore((state) => state.session?.token ?? null);
  const callbacksRef = React.useRef({ onQuotes, onPortfolio, onCandle, onAccount, onError });
  const subscription = React.useMemo(() => {
    const resolvedSymbols = normalize(symbols);

    return {
      key: resolvedSymbols.join("|"),
      resolvedSymbols,
    };
  }, [symbols]);

  React.useEffect(() => {
    callbacksRef.current = { onQuotes, onPortfolio, onCandle, onAccount, onError };
  }, [onQuotes, onPortfolio, onCandle, onAccount, onError]);

  React.useEffect(() => {
    if (!enabled) {
      return;
    }

    const { resolvedSymbols } = subscription;

    if (!token || resolvedSymbols.length === 0) {
      return;
    }

    let socket: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let isDisposed = false;
    let intentionalClose = false;
    let closeAfterOpen = false;
    const latestQuoteTimestamps = new Map<string, number>();
    const quoteBuffer = createLatestValueBuffer<PriceSocketQuote>(
      (quote) => quote.symbol.toUpperCase(),
      (quotes) => {
        useLivePriceStore.getState().setQuotes(quotes);
        unstable_batchedUpdates(() => {
          callbacksRef.current.onQuotes?.(quotes);
        });
      },
    );
    const portfolioBuffer = createLatestValueBuffer<PriceSocketPortfolioMessage>(
      () => "portfolio",
      (messages) => {
        const latestPortfolio = messages[messages.length - 1];
        if (!latestPortfolio) {
          return;
        }

        unstable_batchedUpdates(() => {
          callbacksRef.current.onPortfolio?.(latestPortfolio);
        });
      },
    );

    const onlyLatestQuotes = (quotes: PriceSocketQuote[]) => {
      const latestQuotes: PriceSocketQuote[] = [];

      for (const quote of quotes) {
        const timestamp = Date.parse(quote.timestamp);
        const key = quote.symbol.toUpperCase();
        const previousTimestamp = latestQuoteTimestamps.get(key) ?? 0;

        // A REST snapshot may arrive after a websocket tick. Do not let that
        // older value overwrite the quote already rendered by the browser.
        if (
          Number.isFinite(timestamp) &&
          timestamp < previousTimestamp
        ) {
          continue;
        }

        if (
          Number.isFinite(timestamp) &&
          timestamp === previousTimestamp &&
          quote.source !== "eodhd-ws"
        ) {
          continue;
        }

        if (Number.isFinite(timestamp)) {
          latestQuoteTimestamps.set(key, timestamp);
        }
        latestQuotes.push(quote);
      }

      return latestQuotes;
    };
    const timestampFromProvider = (providerTs: number) => {
      const milliseconds = providerTs > 1_000_000_000_000 ? providerTs : providerTs * 1000;
      return new Date(milliseconds).toISOString();
    };
    const mapRawPriceToQuote = (price: PriceSocketRawPrice): PriceSocketQuote => ({
      symbol: price.symbol,
      price: price.last,
      bid: price.bid,
      ask: price.ask,
      change: null,
      changePercent: null,
      volume: price.volume ?? null,
      timestamp: timestampFromProvider(price.providerTs),
      source: "eodhd-ws",
    });
    const pushQuotes = (quotes: PriceSocketQuote[]) => {
      const latestQuotes = onlyLatestQuotes(quotes);
      latestQuotes.forEach((quote) => quoteBuffer.push(quote));
    };
    const handleAuthError = (message: string) => {
      callbacksRef.current.onError?.(message);

      if (/session|sign in|token|auth/i.test(message)) {
        window.dispatchEvent(new CustomEvent("trade-mate:authentication-failed"));
      }
    };

    const connect = () => {
      if (isDisposed) {
        return;
      }

      const socketUrl = new URL(getPriceSocketUrl());
      socketUrl.searchParams.set("token", token);
      socket = new WebSocket(socketUrl.toString());

      socket.onopen = () => {
        if (!socket || socket.readyState !== WebSocket.OPEN) {
          return;
        }

        if (isDisposed || closeAfterOpen) {
          intentionalClose = true;
          socket.close();
          return;
        }

        socket.send(
          JSON.stringify({
            type: "subscribe",
            symbols: resolvedSymbols,
          }),
        );
      };

      socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data as string) as PriceSocketServerMessage;

          unstable_batchedUpdates(() => {
            if (payload.type === "snapshot") {
              if ("prices" in payload) {
                pushQuotes(payload.prices.map(mapRawPriceToQuote));
                return;
              }

              pushQuotes(payload.quotes);
              return;
            }

            if (payload.type === "price") {
              pushQuotes([mapRawPriceToQuote(payload)]);
              return;
            }

            if (payload.type === "update") {
              pushQuotes(payload.quotes);
              return;
            }

            if (payload.type === "candle") {
              callbacksRef.current.onCandle?.(payload as PriceSocketCandleMessage);
              return;
            }

            if (payload.type === "account") {
              callbacksRef.current.onAccount?.(payload as PriceSocketAccountMessage);
              return;
            }

            if (payload.type === "portfolio") {
              portfolioBuffer.push(payload);
              return;
            }

            if (payload.type === "error") {
              handleAuthError(payload.message);
            }
          });
        } catch {
          unstable_batchedUpdates(() => {
            callbacksRef.current.onError?.("Unable to parse live market update.");
          });
        }
      };

      socket.onerror = () => {
        unstable_batchedUpdates(() => {
          callbacksRef.current.onError?.("Live market stream is temporarily unavailable.");
        });
      };

      socket.onclose = () => {
        quoteBuffer.flush();
        portfolioBuffer.flush();

        if (isDisposed || intentionalClose) {
          return;
        }

        reconnectTimer = setTimeout(() => {
          connect();
        }, 2000);
      };
    };

    connect();

    return () => {
      isDisposed = true;
      intentionalClose = true;
      quoteBuffer.dispose();
      portfolioBuffer.dispose();

      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }

      if (socket && socket.readyState === WebSocket.CONNECTING) {
        closeAfterOpen = true;
        return;
      }

      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            type: "unsubscribe",
            symbols: resolvedSymbols,
          }),
        );
      }

      socket?.close();
    };
  }, [enabled, subscription, token]);
}
