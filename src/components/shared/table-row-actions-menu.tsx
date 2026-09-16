"use client";

import * as React from "react";
import { Loader2Icon, PencilIcon, SplitIcon, XCircleIcon } from "lucide-react";

import { PlaceOrderDialog } from "@/components/place-order-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function TableRowActionsMenu({
  symbol,
  side,
  positionId,
  lots,
  markPrice,
  stopLoss,
  takeProfit,
  onModifyProtection,
  onCancel,
}: {
  symbol: string;
  side: "buy" | "sell" | "long" | "short";
  positionId: string;
  lots: number;
  markPrice: number | null | undefined;
  stopLoss: number | null;
  takeProfit: number | null;
  onModifyProtection?: (input: { positionId: string; stopLoss: number | null; takeProfit: number | null }) => Promise<{ status: "PENDING" | "SENT" | "FAILED" | "SKIPPED" }>;
  onCancel?: (lots?: number) => void | Promise<void>;
}) {
  const [editOpen, setEditOpen] = React.useState(false);
  const [partialCloseOpen, setPartialCloseOpen] = React.useState(false);
  const [partialLots, setPartialLots] = React.useState("");
  const [partialCloseError, setPartialCloseError] = React.useState<string | null>(null);
  const [isClosing, setIsClosing] = React.useState(false);

  const handleClose = async (closeLots?: number) => {
    if (!onCancel) return;
    setIsClosing(true);
    try {
      await onCancel(closeLots);
      setPartialCloseOpen(false);
      setPartialLots("");
      setPartialCloseError(null);
    } finally {
      setIsClosing(false);
    }
  };

  const handlePartialClose = async () => {
    const closeLots = Number(partialLots);

    if (!Number.isFinite(closeLots) || closeLots <= 0) {
      setPartialCloseError("Enter lots greater than zero.");
      return;
    }

    if (closeLots >= lots) {
      setPartialCloseError("Partial close lots must be less than the open lots.");
      return;
    }

    setPartialCloseError(null);
    await handleClose(closeLots);
  };

  return (
    <>
      <div className="inline-flex items-center justify-end gap-1.5">
        {onModifyProtection ? (
          <button
            type="button"
            title="Edit trade"
            aria-label="Edit trade"
            onClick={() => setEditOpen(true)}
            className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg border border-white/10 text-white/70 outline-none transition-colors hover:bg-white/10 hover:text-white"
          >
            <PencilIcon className="size-4" />
          </button>
        ) : null}
        <button
          type="button"
          title="Partial close"
          aria-label="Partial close"
          className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg border border-white/10 text-orange outline-none transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
          disabled={isClosing || lots <= 0}
          onClick={() => {
            setPartialLots("");
            setPartialCloseError(null);
            setPartialCloseOpen(true);
          }}
        >
          <SplitIcon className="size-4" />
        </button>
        <button
          type="button"
          title="Close full"
          aria-label="Close full"
          className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg border border-destructive/30 bg-destructive/10 text-destructive outline-none transition-colors hover:bg-destructive/20 disabled:cursor-not-allowed disabled:opacity-40"
          disabled={isClosing}
          onClick={() => void handleClose()}
        >
          {isClosing ? <Loader2Icon className="size-4 animate-spin" /> : <XCircleIcon className="size-4" />}
        </button>
      </div>

      <Dialog open={partialCloseOpen} onOpenChange={setPartialCloseOpen}>
        <DialogContent className="gradient-dialog-bg max-w-[420px] gap-0 rounded-[16px] border border-white/20 p-5 pt-12 text-white shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-white">Partial Close</DialogTitle>
            <DialogDescription className="text-xs leading-relaxed text-white/50">
              Close part of this position and keep the remaining lots open.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-5 space-y-2">
            <div className="flex items-center justify-between rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-xs text-white/60">
              <span>{symbol}</span>
              <span>{lots.toFixed(4)} lots open</span>
            </div>
            <Input
              type="text"
              inputMode="decimal"
              value={partialLots}
              onChange={(event) => {
                setPartialLots(event.target.value);
                setPartialCloseError(null);
              }}
              placeholder="Lots to close"
              className="gradient-btn-trade h-10 border-white/20 text-white placeholder:text-white/35 focus-visible:border-primary focus-visible:ring-primary/20"
            />
            {partialCloseError ? (
              <p className="text-xs text-destructive">{partialCloseError}</p>
            ) : null}
          </div>

          <DialogFooter className="gradient-btn-secondary -mx-5 -mb-5 mt-5 border-t border-white/10 p-4">
            <Button type="button" variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10" onClick={() => setPartialCloseOpen(false)}>
              Cancel
            </Button>
            <Button type="button" disabled={isClosing} className="btn-red text-white disabled:opacity-60" onClick={() => void handlePartialClose()}>
              {isClosing ? <Loader2Icon className="size-4 animate-spin" /> : null}
              Close Partial
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {onModifyProtection ? (
        <PlaceOrderDialog
          open={editOpen}
          onOpenChange={setEditOpen}
          modification={{
            positionId,
            symbol,
            side: side === "buy" || side === "long" ? "Buy" : "Sell",
            lots,
            markPrice: markPrice ?? null,
            stopLoss,
            takeProfit,
            onSubmit: onModifyProtection,
          }}
        />
      ) : null}
    </>
  );
}
