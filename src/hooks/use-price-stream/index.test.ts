// @vitest-environment jsdom
import { act, createElement, useState } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { PriceStreamOptions } from "@/types/price";
import { usePriceStream } from "./index";

const auth = vi.hoisted(() => ({ token: "test-token" }));
vi.mock("@/lib/stores/auth-store", () => ({
  useAuthStore: (select: (state: unknown) => unknown) => select({ session: { token: auth.token } }),
}));
vi.mock("@/lib/stores/live-price-store", () => ({
  useLivePriceStore: { getState: () => ({ setQuotes: vi.fn() }) },
}));

class FakeSocket {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSED = 3;
  static instances: FakeSocket[] = [];
  readyState = 0;
  onopen: (() => void) | null = null;
  onclose: (() => void) | null = null;
  onerror: (() => void) | null = null;
  onmessage: ((event: { data: string }) => void) | null = null;
  send = vi.fn();
  close = vi.fn(() => { this.readyState = 3; this.onclose?.(); });
  constructor(public url: string) { FakeSocket.instances.push(this); }
  open() { this.readyState = 1; this.onopen?.(); }
  message(payload: unknown) { this.onmessage?.({ data: JSON.stringify(payload) }); }
}

let root: Root;
let container: HTMLDivElement;
function Harness(options: PriceStreamOptions) {
  usePriceStream(options);
  return null;
}
function render(options: PriceStreamOptions) {
  act(() => root.render(createElement(Harness, options)));
}
const price = { type: "price", symbol: "EURUSD", bid: 1.1, ask: 1.2, last: 1.15, providerTs: 1793105566802 };

beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  vi.stubGlobal("WebSocket", FakeSocket);
  FakeSocket.instances = [];
  auth.token = "test-token";
  container = document.createElement("div");
  root = createRoot(container);
});
afterEach(() => {
  act(() => root.unmount());
  vi.clearAllTimers();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("price stream lifecycle", () => {
  it("keeps one connection through quote-driven renders with inline symbol arrays", () => {
    function Dialog() {
      const [, setQuotes] = useState<unknown>(null);
      usePriceStream({ symbols: ["EURUSD"], onQuotes: (quotes) => setQuotes(quotes) });
      return null;
    }
    act(() => root.render(createElement(Dialog)));
    const socket = FakeSocket.instances[0];
    act(() => socket.open());
    for (let i = 0; i < 10; i++) {
      act(() => { socket.message({ ...price, providerTs: price.providerTs + i }); vi.advanceTimersByTime(300); });
    }
    expect(FakeSocket.instances).toHaveLength(1);
    expect(socket.close).not.toHaveBeenCalled();
    expect(JSON.parse(socket.send.mock.calls[0][0])).toEqual({ type: "subscribe", symbols: ["EURUSD"] });
  });

  it("ignores ordering and duplicate symbols while using the latest callbacks", () => {
    const oldCallback = vi.fn();
    const newCallback = vi.fn();
    render({ symbols: ["EURUSD", "XAUUSD"], onQuotes: oldCallback });
    const socket = FakeSocket.instances[0];
    act(() => socket.open());
    render({ symbols: ["xauusd", " EURUSD ", "EURUSD"], onQuotes: newCallback });
    act(() => { socket.message(price); vi.advanceTimersByTime(300); });
    expect(FakeSocket.instances).toHaveLength(1);
    expect(oldCallback).not.toHaveBeenCalled();
    expect(newCallback).toHaveBeenCalledOnce();
    expect(newCallback.mock.calls[0][0][0]).toMatchObject({ bid: 1.1, ask: 1.2 });
  });

  it("reconnects for a real symbol or token change and closes when disabled", () => {
    render({ symbols: ["EURUSD"] });
    const first = FakeSocket.instances[0];
    act(() => first.open());
    render({ symbols: ["XAUUSD"] });
    expect(first.close).toHaveBeenCalledOnce();
    act(() => FakeSocket.instances[1].open());
    auth.token = "next-token";
    render({ symbols: ["XAUUSD"] });
    expect(FakeSocket.instances).toHaveLength(3);
    const last = FakeSocket.instances[2];
    expect(new URL(last.url).searchParams.get("token")).toBe("next-token");
    act(() => last.open());
    render({ symbols: ["XAUUSD"], enabled: false });
    expect(last.close).toHaveBeenCalledOnce();
    act(() => vi.advanceTimersByTime(10000));
    expect(FakeSocket.instances).toHaveLength(3);
  });

  it("retries an unexpected close and cancels the retry on disposal", () => {
    render({ symbols: ["EURUSD"] });
    act(() => { FakeSocket.instances[0].open(); FakeSocket.instances[0].close(); vi.advanceTimersByTime(2000); });
    expect(FakeSocket.instances).toHaveLength(2);
    act(() => { FakeSocket.instances[1].open(); FakeSocket.instances[1].close(); });
    render({ symbols: ["EURUSD"], enabled: false });
    act(() => vi.advanceTimersByTime(10000));
    expect(FakeSocket.instances).toHaveLength(2);
  });

  it("closes a pending connection once opened without subscribing or delivering old messages", () => {
    const onQuotes = vi.fn();
    render({ symbols: ["EURUSD"], onQuotes });
    const socket = FakeSocket.instances[0];
    render({ symbols: ["EURUSD"], enabled: false, onQuotes });
    act(() => { socket.open(); socket.message(price); vi.advanceTimersByTime(10000); });
    expect(socket.close).toHaveBeenCalledOnce();
    expect(socket.send).not.toHaveBeenCalled();
    expect(onQuotes).not.toHaveBeenCalled();
    expect(FakeSocket.instances).toHaveLength(1);
  });

  it("preserves snapshot, candle, account and portfolio delivery", () => {
    const onQuotes = vi.fn(), onCandle = vi.fn(), onAccount = vi.fn(), onPortfolio = vi.fn();
    render({ symbols: ["EURUSD"], onQuotes, onCandle, onAccount, onPortfolio });
    const socket = FakeSocket.instances[0];
    const candle = { type: "candle", symbol: "EURUSD", close: 1.15 };
    const account = { type: "account", accountId: "2375", equity: 1000 };
    const portfolio = { type: "portfolio", equity: 1000 };
    act(() => {
      socket.open();
      socket.message({ type: "snapshot", prices: [price] });
      socket.message(candle); socket.message(account); socket.message(portfolio);
      vi.advanceTimersByTime(300);
    });
    expect(onQuotes).toHaveBeenCalledOnce();
    expect(onCandle).toHaveBeenCalledWith(candle);
    expect(onAccount).toHaveBeenCalledWith(account);
    expect(onPortfolio).toHaveBeenCalledWith(portfolio);
  });
});
