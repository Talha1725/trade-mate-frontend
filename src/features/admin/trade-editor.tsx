"use client";

import { SectionCard } from "@/components/section-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2Icon, TrashIcon } from "lucide-react";
import type { Trade } from "@/types/trade";

const MOCK_ACCOUNT_TRADES: Trade[] = [
  { id: "10244", symbol: "EURUSD", type: "Buy", vol: 1.0, openP: 1.0800, closeP: 1.0850, profit: 50.00, time: "2023-10-25 10:20" },
  { id: "10243", symbol: "GBPUSD", type: "Sell", vol: 0.5, openP: 1.2700, closeP: 1.2750, profit: -25.00, time: "2023-10-24 14:15" },
];

export function TradeEditor({ accountId }: { accountId: string }) {
  return (
    <SectionCard title={`Trade Editor for ${accountId}`}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">Manage historical and active trades for this account.</p>
        <Button size="sm">Add Trade manually</Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Ticket</TableHead>
              <TableHead>Symbol</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Volume</TableHead>
              <TableHead>Open</TableHead>
              <TableHead>Close</TableHead>
              <TableHead className="text-right">Profit</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_ACCOUNT_TRADES.map((trade) => (
              <TableRow key={trade.id}>
                <TableCell className="font-medium">{trade.id}</TableCell>
                <TableCell>{trade.symbol}</TableCell>
                <TableCell className={trade.type === "Buy" ? "text-emerald-600" : "text-rose-600"}>{trade.type}</TableCell>
                <TableCell>{trade.vol}</TableCell>
                <TableCell>{trade.openP.toFixed(4)}</TableCell>
                <TableCell>{trade.closeP.toFixed(4)}</TableCell>
                <TableCell className={`text-right font-medium ${trade.profit > 0 ? "text-emerald-600" : "text-rose-600"}`}>
                  {trade.profit > 0 ? "+" : ""}${trade.profit.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-indigo-600">
                      <Edit2Icon className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-rose-600">
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </SectionCard>
  );
}
