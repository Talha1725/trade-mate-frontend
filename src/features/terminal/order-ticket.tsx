"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SectionCard } from "@/components/section-card";

export function OrderTicket() {
  const [orderType, setOrderType] = useState("Market");

  return (
    <SectionCard title="Order Ticket" className="h-full flex flex-col" contentClassName="flex-1 flex flex-col justify-between gap-4">
      <div className="flex flex-col gap-4">
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
          <Input id="volume" type="number" defaultValue="1.0" step="0.1" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="sl">Stop Loss</Label>
            <Input id="sl" type="number" placeholder="0.0000" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tp">Take Profit</Label>
            <Input id="tp" type="number" placeholder="0.0000" />
          </div>
        </div>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-4">
        <Button variant="destructive" className="w-full">
          Sell by Market
        </Button>
        <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
          Buy by Market
        </Button>
      </div>
    </SectionCard>
  );
}
