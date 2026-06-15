"use client";

import * as React from "react";
import { CheckCircle2Icon, Layers3Icon, Loader2Icon, SparklesIcon, WandSparklesIcon, XIcon } from "lucide-react";
import { toast } from "sonner";

import { InjectTradeForm } from "@/components/admin/inject-trade-form";
import { PreviewPanel } from "@/components/admin/preview-panel";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { allActiveAccountsTarget } from "@/lib/mock-data/injection";
import { accountsApi } from "@/lib/services/accounts.api";
import { injectApi } from "@/lib/services/inject.api";
import { Button } from "@/components/ui/button";
import type { TradeInjectionExecuteResponse, TradeInjectionTargetOption, TradePreviewData } from "@/types/admin";

const promptPresets = [
  "Create a winning EURUSD trade from today with about $125 profit",
  "Inject a losing GBPUSD sell trade from this morning with around $80 loss",
  "Create a bullish BTCUSD trade for all active accounts with about $250 profit",
  "Add a closed AAPL trade from yesterday with stop loss and take profit",
] as const;

function getResultSummary(result: TradeInjectionExecuteResponse["result"]) {
  if (result && typeof result === "object") {
    if ("pushedCount" in result && typeof result.pushedCount === "number") {
      return `Bulk pushed to ${result.pushedCount} account(s).`;
    }

    if ("trade" in result && result.trade && typeof result.trade === "object" && "id" in result.trade) {
      return `Trade ${String(result.trade.id)} injected successfully.`;
    }
  }

  return "Injection completed successfully.";
}

export default function AdminInjectPage() {
  const [prompt, setPrompt] = React.useState("");
  const [options, setOptions] = React.useState<TradeInjectionTargetOption[]>([]);
  const [selectedTargets, setSelectedTargets] = React.useState<string[]>([]);
  const [preview, setPreview] = React.useState<TradePreviewData | null>(null);
  const [isLoadingTargets, setIsLoadingTargets] = React.useState(true);
  const [isPreviewing, setIsPreviewing] = React.useState(false);
  const [isInjecting, setIsInjecting] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function loadOptions() {
      setIsLoadingTargets(true);

      try {
        const list = await injectApi.getInjectionTargets();
        const formatted = [
          { value: allActiveAccountsTarget, label: allActiveAccountsTarget },
          ...list,
        ];

        setOptions(formatted);
        setSelectedTargets((current) => (current.length > 0 ? current : formatted[0] ? [formatted[0].value] : []));
      } catch {
        toast.error("Failed to load account options.");
      } finally {
        setIsLoadingTargets(false);
      }
    }

    void loadOptions();
  }, []);

  const selectedTargetLabel = React.useMemo(() => {
    if (selectedTargets.length === 0) {
      return "";
    }

    if (selectedTargets[0] === allActiveAccountsTarget) {
      return allActiveAccountsTarget;
    }

    if (selectedTargets.length === 1) {
      return options.find((option) => option.value === selectedTargets[0])?.label ?? selectedTargets[0];
    }

    const labels = selectedTargets
      .map((value) => options.find((option) => option.value === value)?.label ?? value)
      .slice(0, 2);

    return selectedTargets.length > 2 ? `${labels.join(", ")} + ${selectedTargets.length - 2} more` : labels.join(", ");
  }, [options, selectedTargets]);

  const isBulkTarget = selectedTargets.length > 1 || selectedTargets[0] === allActiveAccountsTarget;

  const handleToggleTarget = React.useCallback((value: string) => {
    setSelectedTargets((current) => {
      if (value === allActiveAccountsTarget) {
        return [allActiveAccountsTarget];
      }

      if (current.includes(allActiveAccountsTarget)) {
        return [value];
      }

      if (current.includes(value)) {
        const next = current.filter((item) => item !== value);
        return next.length > 0 ? next : [];
      }

      return [...current, value];
    });
  }, []);

  const handleSelectAllActive = React.useCallback(() => {
    setSelectedTargets([allActiveAccountsTarget]);
  }, []);

  const handleClearTargets = React.useCallback(() => {
    setSelectedTargets([]);
  }, []);

  const handlePreview = React.useCallback(async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a trade instruction first.");
      return;
    }

    setIsPreviewing(true);

    try {
      const generatedPreview = await injectApi.previewInjection(prompt);
      setPreview(generatedPreview);
      setSuccessMessage(null);

      if (generatedPreview.recommendedScope === "BULK" && selectedTargets.length <= 1) {
        setSelectedTargets([allActiveAccountsTarget]);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to preview trade injection.");
    } finally {
      setIsPreviewing(false);
    }
  }, [prompt]);

  const handleInject = React.useCallback(async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a valid trade instruction first.");
      return;
    }

    setIsInjecting(true);

    try {
      let activePreview = preview;

      if (!activePreview) {
        activePreview = await injectApi.previewInjection(prompt);
        setPreview(activePreview);
      }

      if (selectedTargets.length === 0) {
        toast.error("Please select at least one account.");
        return;
      }

      const execution = selectedTargets[0] === allActiveAccountsTarget
        ? await (async () => {
            const { items: accounts } = await accountsApi.getAccounts({ limit: 1000 });
            const activeIds = accounts.filter((account) => account.status === "Active").map((account) => account.id);

            if (activeIds.length === 0) {
              toast.error("No active accounts found for bulk push.");
              return null;
            }

            return injectApi.executeInjection({ prompt, accountIds: activeIds });
          })()
        : selectedTargets.length > 1
          ? await injectApi.executeInjection({ prompt, accountIds: selectedTargets })
          : await injectApi.executeInjection({ prompt, accountId: selectedTargets[0] });

      if (!execution) {
        return;
      }

      const summary = getResultSummary(execution.result);
      const destination = execution.targetAccountIds.length > 1
        ? `into ${execution.targetAccountIds.length} selected account(s)`
        : `into account "${selectedTargetLabel}"`;

      setSuccessMessage(
        `Successfully injected simulated ${execution.preview.direction} trade of ${execution.preview.lotSize} lot(s) on ${execution.preview.symbol} ${destination}. ${summary}`,
      );
      setPrompt("");
      setPreview(null);

      if (options[0]) {
        setSelectedTargets([options[0].value]);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to inject trade.");
    } finally {
      setIsInjecting(false);
    }
  }, [options, preview, prompt, selectedTargetLabel, selectedTargets]);

  if (isLoadingTargets) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <div className="text-muted-foreground animate-pulse">Loading injection targets...</div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <PageHeader
        title="AI Trade Injection"
        description="Describe the trade in plain English. The backend validates it against live market context and generates a preview before injection."
      />

      {successMessage ? (
        <div className="relative flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 shadow-[0_2px_8px_rgba(16,185,129,0.08)]">
          <CheckCircle2Icon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
          <div className="flex-1 text-sm font-medium">{successMessage}</div>
          <button
            type="button"
            onClick={() => setSuccessMessage(null)}
            className="-m-1 rounded-lg p-1 text-emerald-600 transition-colors hover:bg-emerald-100 hover:text-emerald-800"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] 2xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="flex flex-col gap-6">
          <SectionCard
            title="Prompt Starters"
            description="Use these examples to see how the AI injection parser behaves."
            icon={SparklesIcon}
          >
            <div className="flex flex-col gap-2">
              {promptPresets.map((item) => (
                <Button
                  key={item}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-auto w-full items-start justify-start rounded-2xl border-dashed px-4 py-3 text-left whitespace-normal leading-5"
                  onClick={() => setPrompt(item)}
                >
                  <WandSparklesIcon className="mr-2 h-4 w-4 text-amber-500" />
                  {item}
                </Button>
              ))}
            </div>
          </SectionCard>

          <InjectTradeForm
            prompt={prompt}
            setPrompt={setPrompt}
            selectedTargets={selectedTargets}
            onToggleTarget={handleToggleTarget}
            onSelectAllActive={handleSelectAllActive}
            onClearTargets={handleClearTargets}
            onPreview={handlePreview}
            onInject={handleInject}
            isInjecting={isInjecting}
            options={options}
          />

          <SectionCard
            title="Execution Mode"
            description="The selected target determines whether the injection goes to a single account or all active accounts."
            icon={Layers3Icon}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border bg-white p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Selected target</div>
                <div className="mt-1 text-sm font-semibold text-foreground">{selectedTargetLabel || "No target selected"}</div>
              </div>
              <div className="rounded-xl border bg-white p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Recommended scope</div>
                <div className="mt-1 text-sm font-semibold text-foreground">
                  {preview?.recommendedScope === "BULK"
                    ? "Bulk push recommended"
                    : preview?.recommendedScope === "SINGLE"
                      ? "Single account recommended"
                      : "Preview pending"}
                </div>
              </div>
            </div>

            {preview?.recommendedScope === "BULK" && !isBulkTarget ? (
              <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                The backend recommended a bulk push for this prompt. Switch to <strong>All Active Accounts</strong> to match the suggested scope.
              </div>
            ) : null}

            <div className="mt-4 flex gap-2">
              <Button type="button" variant="outline" onClick={handlePreview} disabled={!prompt.trim() || isPreviewing}>
                {isPreviewing ? <Loader2Icon className="mr-2 h-4 w-4 animate-spin" /> : <SparklesIcon className="mr-2 h-4 w-4 text-amber-500" />}
                {isPreviewing ? "Generating preview..." : "Refresh preview"}
              </Button>
            </div>

            <div className="mt-3 text-xs leading-5 text-muted-foreground">
              After preview, clicking <span className="font-medium text-foreground">Inject Trade</span> submits the prompt again to the backend.
              The backend re-generates a fresh injection draft and then saves it, so the final trade is always validated at execution time.
            </div>
          </SectionCard>
        </div>

        <div className="flex flex-col gap-6">
          <PreviewPanel preview={preview} targetAccountLabel={selectedTargetLabel} />
        </div>
      </div>
    </div>
  );
}
