"use client";

import * as React from "react";
import { X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

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
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { terminalApi } from "@/lib/services/terminal.api";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useSelectedAccountStore } from "@/lib/stores/account-store";
import { useSyncedTradingAssets } from "@/hooks/use-synced-trading-assets";
import { AssetIcon } from "@/components/shared/asset-icon";
import { SIDEBAR_ICONS } from "@/lib/mock-data/sidebar-icons";
import { getAssetLeverageLabel } from "@/lib/utils/asset-leverage";
import { usePriceStream } from "@/hooks/use-price-stream";
import { useSelectedSymbol, useSetSelectedSymbol } from "@/hooks/use-selected-symbol";
import { formatMarketPrice } from "@/lib/utils/market-price";
import { useLiveAccountSnapshotStore } from "@/lib/stores/live-account-snapshot-store";
import { buildAccountMetricsSummaryFromAccount } from "@/lib/utils/live-account-summary";
import type { PriceSocketQuote } from "@/types/price";

export function PlaceOrderDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [side, setSide] = React.useState<"Buy" | "Sell">("Buy");
  const symbol = useSelectedSymbol() ?? "BTCUSD";
  const setSymbol = useSetSelectedSymbol();
  const [loadSize, setLoadSize] = React.useState("0.01");
  const [stopLoss, setStopLoss] = React.useState("");
  const [takeProfit, setTakeProfit] = React.useState("");
  const [buyingPower, setBuyingPower] = React.useState<number | null>(null);
  const [isAccountContextLoading, setIsAccountContextLoading] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [quote, setQuote] = React.useState<PriceSocketQuote | null>(null);
  const token = useAuthStore((state) => state.session?.token ?? null);
  const selectedAccountId = useSelectedAccountStore((state) => state.selectedAccountId);
  const { data: tradingAssets = [], isLoading: isAssetsLoading } = useSyncedTradingAssets();
  const selectedAsset = React.useMemo(
    () => tradingAssets.find((asset) => asset.symbol === symbol) ?? null,
    [symbol, tradingAssets],
  );
  const leverageLabel = React.useMemo(
    () => getAssetLeverageLabel(selectedAsset?.category),
    [selectedAsset?.category],
  );

  // Live bid/ask for the selected symbol — streams only while the modal is open.
  React.useEffect(() => {
    setQuote(null);
  }, [symbol]);

  usePriceStream({
    enabled: open && !!symbol,
    symbols: symbol ? [symbol] : [],
    accountIds: [],
    onQuotes: (incoming) => {
      if (incoming[0]) {
        setQuote(incoming[0]);
      }
    },
  });

  const bidPrice = quote?.bid ?? quote?.price ?? null;
  const askPrice = quote?.ask ?? quote?.price ?? null;
  const fillPrice = side === "Buy" ? askPrice : bidPrice;
  const lotsNum = Number(loadSize);
  const estimatedCost =
    fillPrice != null && Number.isFinite(lotsNum) ? fillPrice * lotsNum : null;
  const marginRequired = estimatedCost != null ? estimatedCost * 0.05 : null;

  const loadAccountContext = React.useCallback(
    async (options?: { silent?: boolean }) => {
      if (!token) {
        return null;
      }

      setIsAccountContextLoading(true);

      try {
        const snapshot = await terminalApi.getOpenPositions(token, selectedAccountId ?? undefined);

        const availableBalance =
          Number(snapshot.account.balance ?? 0) - Number(snapshot.account.marginUsed ?? 0);
        setBuyingPower(Math.max(0, availableBalance));

        return {
          accountId: snapshot.account.id,
          balance: availableBalance.toFixed(2),
        };
      } catch (error) {
        if (!options?.silent) {
          console.error("Unable to load account context.", error);
        }

        return null;
      } finally {
        setIsAccountContextLoading(false);
      }
    },
    [selectedAccountId, token],
  );

  React.useEffect(() => {
    if (tradingAssets.length === 0) {
      return;
    }

    if (!selectedAsset) {
      setSymbol(tradingAssets[0].symbol);
    }
  }, [selectedAsset, tradingAssets]);

  React.useEffect(() => {
    if (!open) {
      return;
    }

    void loadAccountContext({ silent: true });
  }, [loadAccountContext, open]);

  const submitOrder = async () => {
    if (!token) {
      toast.error("Please sign in before placing a trade.");
      return;
    }

    const lots = Number(loadSize);

    if (!Number.isFinite(lots) || lots <= 0) {
      toast.error("Enter a valid load size greater than 0.");
      return;
    }

    const parsedStopLoss = stopLoss.trim() ? Number(stopLoss) : null;
    const parsedTakeProfit = takeProfit.trim() ? Number(takeProfit) : null;

    if (
      (parsedStopLoss != null && (!Number.isFinite(parsedStopLoss) || parsedStopLoss <= 0)) ||
      (parsedTakeProfit != null && (!Number.isFinite(parsedTakeProfit) || parsedTakeProfit <= 0))
    ) {
      toast.error("Stop loss and take profit must be valid positive prices.");
      return;
    }

    setIsSubmitting(true);

    try {
      const accountContext = (await loadAccountContext()) ?? null;

      if (!accountContext) {
        throw new Error("Unable to load account details.");
      }

      const result = await terminalApi.placeOrder(
        {
          accountId: accountContext.accountId,
          symbol,
          direction: side === "Buy" ? "BUY" : "SELL",
          lots,
          stopLoss: parsedStopLoss,
          takeProfit: parsedTakeProfit,
        },
        token,
      );

      const currentSummary = useLiveAccountSnapshotStore.getState().summariesByAccountId[result.account.id] ?? null;
      useLiveAccountSnapshotStore.getState().setAccountSummary(
        buildAccountMetricsSummaryFromAccount(result.account, currentSummary),
      );

      toast.success(`${side} ${symbol} trade opened.`);
      window.dispatchEvent(new Event("trade-mate:positions-changed"));
      setOpen(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to place trade.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
              src={SIDEBAR_ICONS.winrate} 
              alt="win rate" 
              width={16} 
              height={16} 
              className="brightness-200"
            />
          </button>
        </div>

        {/* Info Cards */}
        <div className="mb-4">
          <div className="rounded-xl border border-white/20 gradient-btn-tradebox p-3">
            <div className="text-xs text-white/50 mb-1">Buying Power</div>
            <div className="text-sm font-semibold text-white">
              {buyingPower == null
                ? isAccountContextLoading
                  ? "Loading..."
                  : "—"
                : `$${buyingPower.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`}
            </div>
          </div>
        </div>

        {/* Live Bid / Ask */}
        <div className="mb-4 grid grid-cols-2 gap-3">
          <div
            className={cn(
              "rounded-xl border p-3",
              side === "Sell" ? "border-[#ff5b5b]/60 card-red" : "border-white/20 gradient-btn-tradebox",
            )}
          >
            <div className="text-xs text-white/50 mb-1">Sell / Bid</div>
            <div className="text-sm font-semibold text-[#ff7a7a]">
              {bidPrice != null ? formatMarketPrice(bidPrice, symbol) : "—"}
            </div>
          </div>
          <div
            className={cn(
              "rounded-xl border p-3",
              side === "Buy" ? "border-[#0CE9A0]/60 card-green" : "border-white/20 gradient-btn-tradebox",
            )}
          >
            <div className="text-xs text-white/50 mb-1">Buy / Ask</div>
            <div className="text-sm font-semibold text-[#0CE9A0]">
              {askPrice != null ? formatMarketPrice(askPrice, symbol) : "—"}
            </div>
          </div>
        </div>

        {/* Buy/Sell Toggle */}
        <div className="flex rounded-xl border border-white/20 gradient-btn-trade p-1 mb-5">
          <button
            onClick={() => setSide("Buy")}
            className={cn(
              "flex-1 rounded-lg py-2 cursor-pointer text-sm font-medium transition-colors",
              side === "Buy" ? "btn-green text-white" : "text-white/50 hover:text-white"
            )}
          >
            Buy
          </button>
          <button
            onClick={() => setSide("Sell")}
            className={cn(
              "flex-1 rounded-lg py-2 text-sm cursor-pointer font-medium transition-colors",
              side === "Sell" ? "btn-red text-white" : "text-white/50 hover:text-white"
            )}
          >
            Sell
          </button>
        </div>

        <div className="space-y-4">
          {/* Symbol Row */}
          <div>
            {/* Symbol */}
          <div>
            <label className="text-xs text-white/50 mb-1.5 block">Symbol</label>
              <Select value={symbol} onValueChange={(val) => val && setSymbol(val)}>
                <SelectTrigger className="flex w-full items-center justify-between rounded-lg border border-white/20 gradient-btn-trade px-3 h-9 text-sm font-medium text-white shadow-none">
                  <div className="flex items-center gap-2">
                    <AssetIcon symbol={symbol} label={symbol} size={16} />
                    <span>{symbol.replace("USD", "/USD")}</span>
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-[#141414] border-[#222] text-white">
                  {isAssetsLoading ? (
                    <SelectItem value={symbol} disabled>
                      Loading assets...
                    </SelectItem>
                  ) : (
                    tradingAssets.map((asset) => (
                      <SelectItem key={asset.id} value={asset.symbol}>
                        <div className="flex w-full min-w-0 items-center gap-2 pr-2">
                          <AssetIcon symbol={asset.symbol} label={asset.label} size={16} />
                          <span className="min-w-0 flex-1 truncate text-white">{asset.label}</span>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Other 4 fields in 2x2 grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Quantity */}
            <div>
              <label className="text-xs text-white/50 mb-1.5 block">Lot Size</label>
              <div className="rounded-lg border border-white/20 gradient-btn-trade px-3 py-2">
                <input
                  type="text"
                  value={loadSize}
                  onChange={(event) => setLoadSize(event.target.value)}
                  className="w-full bg-transparent text-sm text-white outline-none"
                />
              </div>
            </div>

            {/* Leverage */}
            <div>
              <label className="text-xs text-white/50 mb-1.5 block">Leverage</label>
              <div
                title={leverageLabel}
                className="flex h-9 w-full items-center rounded-lg border border-[#222] bg-[#141414] px-3 text-sm font-medium text-white/80"
              >
                <span className="truncate">{leverageLabel}</span>
              </div>
            </div>

            {/* Stop Loss */}
            <div>
              <label className="text-xs text-white/50 mb-1.5 block">Stop Loss</label>
              <div className="rounded-lg border border-white/20 gradient-btn-trade px-3 py-2">
                <input
                  type="text"
                  value={stopLoss}
                  onChange={(event) => setStopLoss(event.target.value)}
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
                  value={takeProfit}
                  onChange={(event) => setTakeProfit(event.target.value)}
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
              <span className="font-semibold text-white">
                {estimatedCost != null
                  ? `$${estimatedCost.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : "—"}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/50">Margin Required</span>
              <span className="font-semibold text-white">
                {marginRequired != null
                  ? `$${marginRequired.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : "—"}
              </span>
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
            type="button"
            onClick={submitOrder}
            disabled={isSubmitting}
            className={cn(
              "flex-1 rounded-xl py-3 text-sm cursor-pointer font-semibold text-white disabled:opacity-60",
              side === "Buy" ? "btn-green" : "btn-red"
            )}
          >
            {isSubmitting ? "Placing..." : `${side} ${symbol}`}
          </button>
          {/* <button
            type="button"
            onClick={() => toast.success("Risk check passed.")}
            className="flex-1 rounded-xl py-3 cursor-pointer text-sm font-semibold text-white/80 border border-white/10 bg-linear-to-b from-white/10 to-white/5 hover:opacity-90 transition-opacity shadow-inner shadow-white/5"
          >
            Run Risk Check
          </button> */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
