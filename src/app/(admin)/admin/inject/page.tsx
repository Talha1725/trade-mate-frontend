"use client";

import * as React from "react";
import { PageHeader } from "@/components/page-header";
import { InjectTradeForm } from "@/components/admin/inject-trade-form";
import { PreviewPanel } from "@/components/admin/preview-panel";
import { mockInjectionTargetOptions } from "@/lib/mock-data/injection";
import type { TradePreviewData } from "@/types/admin";
import { CheckCircle2Icon, XIcon } from "lucide-react";

export default function AdminInjectPage() {
  const [prompt, setPrompt] = React.useState("");
  const [target, setTarget] = React.useState(mockInjectionTargetOptions[0]?.value || "");
  const [preview, setPreview] = React.useState<TradePreviewData | null>(null);
  const [isInjecting, setIsInjecting] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const targetLabel = React.useMemo(() => {
    return mockInjectionTargetOptions.find((opt) => opt.value === target)?.label || target;
  }, [target]);

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

  const handleInject = () => {
    if (!preview) {
      // Generate preview first if they just click inject
      handlePreview();
    }
    setIsInjecting(true);
    setTimeout(() => {
      setIsInjecting(false);
      setSuccessMessage(`Successfully injected simulated ${preview?.direction || "Buy"} trade of ${preview?.lotSize || 1.0} lot(s) on ${preview?.symbol || "EURUSD"} into account "${targetLabel}".`);
      setPrompt("");
      setPreview(null);
    }, 800);
  };

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
          />
        </div>
        <div className="flex flex-col gap-6">
          <PreviewPanel preview={preview} targetAccountLabel={targetLabel} />
        </div>
      </div>
    </div>
  );
}
