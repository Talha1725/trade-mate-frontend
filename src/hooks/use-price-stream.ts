"use client";

import * as React from "react";

import { getPriceSocketUrl } from "@/lib/utils/price-stream";
import type { PriceSocketPortfolioMessage, PriceSocketQuote, PriceSocketServerMessage } from "@/types/price";

type PriceStreamOptions = {
  symbols?: string[];
  accountIds?: string[];
  enabled?: boolean;
  onQuotes?: (quotes: PriceSocketQuote[]) => void;
  onPortfolio?: (payload: PriceSocketPortfolioMessage) => void;
  onError?: (message: string) => void;
};

function normalize(values?: string[]) {
  return Array.from(new Set((values ?? []).map((value) => value.trim()).filter((value) => value.length > 0)));
}

export function usePriceStream({
  symbols,
  accountIds,
  enabled = true,
  onQuotes,
  onPortfolio,
  onError,
}: PriceStreamOptions) {
  const callbacksRef = React.useRef({ onQuotes, onPortfolio, onError });
  const subscription = React.useMemo(() => {
    const resolvedSymbols = normalize(symbols);
    const resolvedAccountIds = normalize(accountIds);

    return {
      key: `${resolvedSymbols.join("|")}::${resolvedAccountIds.join("|")}`,
      resolvedSymbols,
      resolvedAccountIds,
    };
  }, [accountIds, symbols]);

  React.useEffect(() => {
    callbacksRef.current = { onQuotes, onPortfolio, onError };
  }, [onQuotes, onPortfolio, onError]);

  React.useEffect(() => {
    if (!enabled) {
      return;
    }

    const { resolvedSymbols, resolvedAccountIds } = subscription;

    if (resolvedSymbols.length === 0 && resolvedAccountIds.length === 0) {
      return;
    }

    let socket: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let isDisposed = false;
    let intentionalClose = false;
    let closeAfterOpen = false;

    const connect = () => {
      if (isDisposed) {
        return;
      }

      socket = new WebSocket(getPriceSocketUrl());

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
            accountIds: resolvedAccountIds.length > 0 ? resolvedAccountIds : undefined,
          }),
        );
      };

      socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data as string) as PriceSocketServerMessage;

          if (payload.type === "snapshot" || payload.type === "update") {
            callbacksRef.current.onQuotes?.(payload.quotes);
            return;
          }

          if (payload.type === "portfolio") {
            callbacksRef.current.onPortfolio?.(payload);
            return;
          }

          if (payload.type === "error") {
            callbacksRef.current.onError?.(payload.message);
          }
        } catch {
          callbacksRef.current.onError?.("Unable to parse live market update.");
        }
      };

      socket.onerror = () => {
        callbacksRef.current.onError?.("Live market stream is temporarily unavailable.");
      };

      socket.onclose = () => {
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
            accountIds: resolvedAccountIds.length > 0 ? resolvedAccountIds : undefined,
          }),
        );
      }

      socket?.close();
    };
  }, [enabled, subscription.key]);
}
