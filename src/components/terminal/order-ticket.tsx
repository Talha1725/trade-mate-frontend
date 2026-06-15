"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SectionCard } from "@/components/section-card";
import type { OrderTicketProps, TradeOrderDirection } from "@/types";

export function OrderTicket({ accountId, symbol = "EURUSD", price, onSubmit, isSubmitting }: OrderTicketProps) {
  const [orderType, setOrderType] = useState("Market");
  const [volume, setVolume] = useState("1.0");
  const [stopLoss, setStopLoss] = useState("");
  const [takeProfit, setTakeProfit] = useState("");

  const handlePlaceOrder = async (direction: TradeOrderDirection) => {
    if (!onSubmit || !accountId) {
      return;
    }

    const lots = Number(volume);

    if (!Number.isFinite(lots) || lots <= 0) {
      return;
    }

    await onSubmit({
      accountId,
      symbol,
      direction,
      lots,
      stopLoss: stopLoss ? Number(stopLoss) : null,
      takeProfit: takeProfit ? Number(takeProfit) : null,
    });
  };

  return (
    <SectionCard
      title="Order Ticket"
      className="h-full flex flex-col"
      contentClassName="flex-1 flex flex-col justify-between gap-4"
    >
      <div className="flex flex-col gap-4">
        <div className="grid gap-2">
          <Label htmlFor="symbol">Symbol</Label>
          <Input id="symbol" value={symbol} disabled />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="type">Order Type</Label>
          <Select value={orderType} onValueChange={(value) => setOrderType(value ?? "Market")}>
            <SelectTrigger id="type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Market">Market</SelectItem>
              <SelectItem value="Limit">Limit</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="volume">Volume (Lots)</Label>
          <Input
            id="volume"
            type="number"
            value={volume}
            onChange={(event) => setVolume(event.target.value)}
            step="0.1"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="sl">Stop Loss</Label>
            <Input
              id="sl"
              type="number"
              placeholder="0.0000"
              value={stopLoss}
              onChange={(event) => setStopLoss(event.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="tp">Take Profit</Label>
            <Input
              id="tp"
              type="number"
              placeholder="0.0000"
              value={takeProfit}
              onChange={(event) => setTakeProfit(event.target.value)}
            />
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          {symbol} {price != null ? `around ${price.toFixed(4)}` : "market order"}
        </p>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-4">
        <Button
          variant="destructive"
          className="w-full"
          disabled={!onSubmit || !accountId || isSubmitting}
          onClick={() => handlePlaceOrder("SELL")}
        >
          Sell by Market
        </Button>
        <Button
          className="w-full bg-emerald-600 hover:bg-emerald-700"
          disabled={!onSubmit || !accountId || isSubmitting}
          onClick={() => handlePlaceOrder("BUY")}
        >
          Buy by Market
        </Button>
      </div>
    </SectionCard>
  );
}
