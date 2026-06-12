"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SectionCard } from "@/components/section-card";
import { useOpenTrade } from "@/hooks/use-trades";

type OrderTicketProps = {
  symbol: string;
};

export function OrderTicket({ symbol }: OrderTicketProps) {
  const [orderType, setOrderType] = useState("Market");
  const [volume, setVolume] = useState("1.0");
  const [sl, setSl] = useState("");
  const [tp, setTp] = useState("");
  const { mutate: openTrade, isPending } = useOpenTrade();

  const handleTrade = (type: "Buy" | "Sell") => {
    openTrade(
      {
        symbol,
        type,
        volume: parseFloat(volume),
        sl: sl ? parseFloat(sl) : undefined,
        tp: tp ? parseFloat(tp) : undefined,
      },
      {
        onSuccess: () => {
          toast.success(`${type} order placed for ${symbol}`);
        },
        onError: (error) => {
          toast.error(error.message || `Failed to place ${type} order`);
        },
      },
    );
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
          <Select
            value={orderType}
            onValueChange={(value) => setOrderType(value ?? "Market")}
          >
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
            onChange={(e) => setVolume(e.target.value)}
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
              value={sl}
              onChange={(e) => setSl(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tp">Take Profit</Label>
            <Input
              id="tp"
              type="number"
              placeholder="0.0000"
              value={tp}
              onChange={(e) => setTp(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-4">
        <Button
          variant="destructive"
          className="w-full"
          disabled={isPending}
          onClick={() => handleTrade("Sell")}
        >
          Sell by Market
        </Button>
        <Button
          className="w-full bg-emerald-600 hover:bg-emerald-700"
          disabled={isPending}
          onClick={() => handleTrade("Buy")}
        >
          Buy by Market
        </Button>
      </div>
    </SectionCard>
  );
}
