"use client";

import * as React from "react";
import { PageHeader } from "@/components/page-header";
import { InjectTradeForm } from "@/components/admin/inject-trade-form";
import { PreviewPanel } from "@/components/admin/preview-panel";
import { injectApi } from "@/lib/services/inject.api";
import { accountsApi } from "@/lib/services/accounts.api";
import type { TradePreviewData, TradeInjectionTargetOption } from "@/types/admin";
import { CheckCircle2Icon, XIcon } from "lucide-react";
import { toast } from "sonner";

export default function AdminInjectPage() {
  const [prompt, setPrompt] = React.useState("");
  const [options, setOptions] = React.useState<TradeInjectionTargetOption[]>([]);
  const [target, setTarget] = React.useState("");
  const [preview, setPreview] = React.useState<TradePreviewData | null>(null);
  const [isInjecting, setIsInjecting] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadOptions() {
      setLoading(true);
      try {
        const list = await injectApi.getInjectionTargets();
        // Insert bulk push option at the beginning
        const formatted = [
          { value: "All Active Accounts", label: "All Active Accounts" },
          ...list
        ];
        setOptions(formatted);
        if (formatted[0]) {
          setTarget(formatted[0].value);
        }
      } catch {
        toast.error("Failed to load account options.");
      } finally {
        setLoading(false);
      }
    }
    loadOptions();
  }, []);

  const targetLabel = React.useMemo(() => {
    return options.find((opt) => opt.value === target)?.label || target;
  }, [options, target]);

  const handlePreview = () => {
    if (!prompt.trim()) return;
    const lower = prompt.toLowerCase();

    // Parse symbol
    let symbol = "EURUSD";
    if (lower.includes("gbpusd")) symbol = "GBPUSD";
    else if (lower.includes("xauusd") || lower.includes("gold")) symbol = "XAUUSD";
    else if (lower.includes("usdjpy")) symbol = "USDJPY";

    // Parse direction
    const direction = lower.includes("sell") || lower.includes("short") ? "Sell" : "Buy";

    // Parse profit
    let profit = 126.0;
    const matchProfit = prompt.match(/\$?(\d+(\.\d+)?)/);
    if (matchProfit) {
      profit = parseFloat(matchProfit[1]);
    }

    // Parse lot size
    let lotSize = 1.0;
    const lotMatch = prompt.match(/(\d+(\.\d+)?)\s*lot/);
    if (lotMatch) {
      lotSize = parseFloat(lotMatch[1]);
    }

    setPreview({
      symbol,
      direction,
      entry: symbol === "XAUUSD" ? 2045.5 : symbol === "USDJPY" ? 150.25 : 1.085,
      exit: symbol === "XAUUSD" ? 2051.8 : symbol === "USDJPY" ? 151.1 : 1.0862,
      lotSize,
      profit,
    });
  };

  const handleInject = async () => {
    let activePreview = preview;
    if (!activePreview) {
      handlePreview();
      return;
    }

    setIsInjecting(true);
    try {
      if (target === "All Active Accounts") {
        const { items: accounts } = await accountsApi.getAccounts({ limit: 1000 });
        const activeIds = accounts.filter((a) => a.status === "Active").map((a) => a.id);
        if (activeIds.length === 0) {
          toast.error("No active accounts found for bulk push.");
          setIsInjecting(false);
          return;
        }
        await injectApi.bulkPush(activeIds, activePreview);
        setSuccessMessage(`Successfully bulk-pushed simulated ${activePreview.direction} trade of ${activePreview.lotSize} lot(s) on ${activePreview.symbol} to ${activeIds.length} active account(s).`);
      } else {
        await injectApi.executeInjection(target, activePreview);
        setSuccessMessage(`Successfully injected simulated ${activePreview.direction} trade of ${activePreview.lotSize} lot(s) on ${activePreview.symbol} into account "${targetLabel}".`);
      }
      setPrompt("");
      setPreview(null);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to inject trade.");
    } finally {
      setIsInjecting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <div className="text-muted-foreground animate-pulse">Loading injection targets...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <PageHeader
        title="Inject Trades"
        description="Inject simulated trade positions directly into simulated user trading history."
      />

      {successMessage && (
        <div className="relative flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 shadow-[0_2px_8px_rgba(16,185,129,0.08)]">
          <CheckCircle2Icon className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="flex-1 text-sm font-medium">
            {successMessage}
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-600 hover:text-emerald-800 transition-colors p-1 -m-1 rounded-lg hover:bg-emerald-100"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <InjectTradeForm
            prompt={prompt}
            setPrompt={setPrompt}
            target={target}
            setTarget={setTarget}
            onPreview={handlePreview}
            onInject={handleInject}
            isInjecting={isInjecting}
            options={options}
          />
        </div>
        <div className="flex flex-col gap-6">
          <PreviewPanel preview={preview} targetAccountLabel={targetLabel} />
        </div>
      </div>
    </div>
  );
}
