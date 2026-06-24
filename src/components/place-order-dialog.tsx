"use client";

import * as React from "react";
import { ChevronDown, X } from "lucide-react";
import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MARKET_WATCH_ICON_IMAGES } from "@/lib/mock-data/market-watch-card";
import { cn } from "@/lib/utils";

export function PlaceOrderDialog({ children }: { children: React.ReactNode }) {
  const [side, setSide] = React.useState<"Buy" | "Sell">("Buy");
  const [symbol, setSymbol] = React.useState("BTCUSD");
  const [orderType, setOrderType] = React.useState("Market");
  const [leverage, setLeverage] = React.useState("5x");

  return (
    <Dialog>
      <DialogTrigger render={React.isValidElement(children) ? children : <button>{children}</button>} />
      <DialogContent
        className="w-full max-w-[450px] sm:max-w-[450px] max-h-[90vh] overflow-y-auto custom-scrollbar bg-[#0d0d0d] border border-white/20 p-5 pt-14 gap-0 shadow-2xl rounded-[16px] text-white"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">Place Order</DialogTitle>
        <DialogClose
          render={
            <button className="absolute top-6 right-6 size-6 rounded-full bg-white hover:opacity-90 transition-opacity text-black flex items-center justify-center cursor-pointer">
              <X className="size-3.5" />
              <span className="sr-only">Close</span>
            </button>
          }
        />
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-base font-bold text-white mb-1">Place Order</h2>
            <p className="text-xs text-white/50 leading-relaxed pr-4">
              Set up your trade with sizing, leverage and risk checks before execution.
            </p>
          </div>
          <button className="p-2 rounded-lg border border-[#108961] card-green shrink-0 hover:opacity-90 transition-opacity">
            <Image 
              src="/sidebar icons/winrate.svg" 
              alt="win rate" 
              width={16} 
              height={16} 
              className="brightness-200"
            />
          </button>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="rounded-xl border border-white/20 gradient-btn-tradebox p-3">
            <div className="text-xs text-white/50 mb-1">Buying Power</div>
            <div className="text-sm font-semibold text-white">$18.2K</div>
          </div>
          <div className="rounded-xl border border-white/20 gradient-btn-tradebox p-3">
            <div className="text-xs text-white/50 mb-1">Mode</div>
            <div className="text-sm font-semibold text-white">Cross Margin</div>
          </div>
        </div>

        {/* Buy/Sell Toggle */}
        <div className="flex rounded-xl border border-white/20 gradient-btn-trade p-1 mb-5">
          <button
            onClick={() => setSide("Buy")}
            className={cn(
              "flex-1 rounded-lg py-2 text-sm font-medium transition-colors",
              side === "Buy" ? "btn-green text-white" : "text-white/50 hover:text-white"
            )}
          >
            Buy
          </button>
          <button
            onClick={() => setSide("Sell")}
            className={cn(
              "flex-1 rounded-lg py-2 text-sm font-medium transition-colors",
              side === "Sell" ? "btn-red text-white" : "text-white/50 hover:text-white"
            )}
          >
            Sell
          </button>
        </div>

        <div className="space-y-4">
          {/* Symbol & Order Type Row */}
          <div className="grid grid-cols-2 gap-3">
            {/* Symbol */}
            <div>
              <label className="text-xs text-white/50 mb-1.5 block">Symbol</label>
              <Select value={symbol} onValueChange={(val) => val && setSymbol(val)}>
                <SelectTrigger className="flex w-full items-center justify-between rounded-lg border border-white/20 gradient-btn-trade px-3 h-9 text-sm font-medium text-white shadow-none">
                  <div className="flex items-center gap-2">
                    <Image
                      src={
                        symbol === "BTCUSD" ? MARKET_WATCH_ICON_IMAGES.bitcoin :
                        symbol === "ETHUSD" ? MARKET_WATCH_ICON_IMAGES.ethereum :
                        symbol === "SOLUSD" ? MARKET_WATCH_ICON_IMAGES.solana :
                        symbol === "XRPUSD" ? MARKET_WATCH_ICON_IMAGES.ripple : 
                        MARKET_WATCH_ICON_IMAGES.cardano
                      }
                      alt={symbol}
                      width={16}
                      height={16}
                    />
                    <span>{symbol.replace("USD", "/USD")}</span>
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-[#141414] border border-white/20 text-white">
                  <SelectItem value="BTCUSD">
                    <div className="flex items-center gap-2">
                      <Image src={MARKET_WATCH_ICON_IMAGES.bitcoin} alt="BTC" width={16} height={16} />
                      <span>BTC/USD</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="ETHUSD">
                    <div className="flex items-center gap-2">
                      <Image src={MARKET_WATCH_ICON_IMAGES.ethereum} alt="ETH" width={16} height={16} />
                      <span>ETH/USD</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="SOLUSD">
                    <div className="flex items-center gap-2">
                      <Image src={MARKET_WATCH_ICON_IMAGES.solana} alt="SOL" width={16} height={16} />
                      <span>SOL/USD</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="XRPUSD">
                    <div className="flex items-center gap-2">
                      <Image src={MARKET_WATCH_ICON_IMAGES.ripple} alt="XRP" width={16} height={16} />
                      <span>XRP/USD</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="ADAUSD">
                    <div className="flex items-center gap-2">
                      <Image src={MARKET_WATCH_ICON_IMAGES.cardano} alt="ADA" width={16} height={16} />
                      <span>ADA/USD</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Order Type */}
            <div>
              <label className="text-xs text-white/50 mb-1.5 block">Order Type</label>
              <Select value={orderType} onValueChange={(val) => val && setOrderType(val)}>
                <SelectTrigger className="flex w-full items-center justify-between rounded-lg border border-white/20 gradient-btn-trade px-3 h-9 text-sm font-medium text-white shadow-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#141414] border border-white/20 text-white">
                  <SelectItem value="Market">Market</SelectItem>
                  <SelectItem value="Limit">Limit</SelectItem>
                  <SelectItem value="Stop">Stop</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Other 6 fields in 2 rows of 3 */}
          <div className="grid grid-cols-3 gap-3">
            {/* Quantity */}
            <div>
              <label className="text-xs text-white/50 mb-1.5 block">Quantity</label>
              <div className="rounded-lg border border-white/20 gradient-btn-trade px-3 py-2">
                <input
                  type="text"
                  defaultValue="0.75"
                  className="w-full bg-transparent text-sm text-white outline-none"
                />
              </div>
            </div>

            {/* Leverage */}
            <div>
              <label className="text-xs text-white/50 mb-1.5 block">Leverage</label>
              <Select value={leverage} onValueChange={(val) => val && setLeverage(val)}>
                <SelectTrigger className="flex w-full items-center justify-between rounded-lg border border-white/20 gradient-btn-trade px-3 h-9 text-sm font-medium text-white shadow-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#141414] border border-white/20 text-white">
                  <SelectItem value="1x">1x</SelectItem>
                  <SelectItem value="2x">2x</SelectItem>
                  <SelectItem value="5x">5x</SelectItem>
                  <SelectItem value="10x">10x</SelectItem>
                  <SelectItem value="20x">20x</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Limit Price */}
            <div>
              <label className="text-xs text-white/50 mb-1.5 block">Limit Price</label>
              <div className="rounded-lg border border-white/20 gradient-btn-trade px-3 py-2">
                <input
                  type="text"
                  defaultValue="69100"
                  className="w-full bg-transparent text-sm text-white outline-none"
                />
              </div>
            </div>

            {/* Trailing Stop */}
            <div>
              <label className="text-xs text-white/50 mb-1.5 block">Trailing Stop</label>
              <div className="rounded-lg border border-white/20 gradient-btn-trade px-3 py-2">
                <input
                  type="text"
                  defaultValue="1.25"
                  className="w-full bg-transparent text-sm text-white outline-none"
                />
              </div>
            </div>

            {/* Stop Loss */}
            <div>
              <label className="text-xs text-white/50 mb-1.5 block">Stop Loss</label>
              <div className="rounded-lg border border-white/20 gradient-btn-trade px-3 py-2">
                <input
                  type="text"
                  defaultValue="66000"
                  className="w-full bg-transparent text-sm text-white outline-none"
                />
              </div>
            </div>

            {/* Take Profit */}
            <div>
              <label className="text-xs text-white/50 mb-1.5 block">Take Profit</label>
              <div className="rounded-lg border border-white/20  bg-[#141414] px-3 py-2">
                <input
                  type="text"
                  defaultValue="72500"
                  className="w-full bg-transparent text-sm text-white outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Risk Summary Card */}
        <div className="mt-5 rounded-xl border border-white/20 card-green p-4">
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-white/50">Estimated Cost</span>
              <span className="font-semibold text-white">$51,825</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/50">Margin Required</span>
              <span className="font-semibold text-white">$10,365</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/50">Risk / Reward</span>
              <span className="font-medium text-[#0CE9A0]">1:1.10</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/50">Risk Check</span>
              <span className="font-medium text-[#0CE9A0]">Passed</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex gap-3">
          <button 
            className={cn(
              "flex-1 rounded-xl py-3 text-sm font-semibold text-white",
              side === "Buy" ? "btn-green" : "btn-red"
            )}
          >
            {side} BTCUSD
          </button>
          <button className="flex-1 rounded-xl py-3 text-sm font-semibold text-white/80 border border-white/20 bg-linear-to-b from-white/10 to-white/5 hover:opacity-90 transition-opacity shadow-inner shadow-white/5">
            Run Risk Check
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
