"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { SortableColumnHeader } from "@/components/sortable-column-header";
import { SectionCard } from "@/components/section-card";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit2Icon, TrashIcon, PlusIcon } from "lucide-react";
import { accountsApi } from "@/lib/services/accounts.api";
import { post, patch, del } from "@/lib/utils/api";
import { ROUTES } from "@/constant/routes";
import type { Trade, TradeEditorProps } from "@/types/trade";
import { toast } from "sonner";

const PAGE_SIZE = 10;

export function TradeEditor({ accountId }: TradeEditorProps) {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);

  const [formData, setFormData] = useState({
    symbol: "",
    direction: "BUY" as "BUY" | "SELL",
    lots: 1.0,
    entryPrice: 1.0,
    exitPrice: 1.0,
    stopLoss: "" as string | number,
    takeProfit: "" as string | number,
    notes: "",
  });

  const fetchTrades = useCallback(async () => {
    setLoading(true);
    try {
      const data = await accountsApi.getAccountTrades(accountId, { page, limit: PAGE_SIZE });
      setTrades(data.items);
      setTotalCount(data.total);
    } catch {
      toast.error("Failed to load account trades.");
    } finally {
      setLoading(false);
    }
  }, [accountId, page]);

  useEffect(() => {
    fetchTrades();
  }, [fetchTrades]);

  const handleEdit = (trade: Trade) => {
    setEditingTrade(trade);
    setFormData({
      symbol: trade.symbol,
      direction: trade.type === "Buy" ? "BUY" : "SELL",
      lots: trade.vol,
      entryPrice: trade.openP,
      exitPrice: trade.closeP,
      stopLoss: trade.profit ? "" : "", // Map if applicable, otherwise keep it blank
      takeProfit: "",
      notes: "",
    });
    setShowForm(true);
  };

  const handleDelete = async (tradeId: string) => {
    if (!confirm("Are you sure you want to delete this trade?")) return;
    try {
      await del(ROUTES.ADMIN.TRADE_BY_ID(tradeId));
      toast.success("Trade deleted successfully.");
      setPage(1);
      fetchTrades();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete trade.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        symbol: formData.symbol.toUpperCase(),
        direction: formData.direction,
        lots: formData.lots,
        entryPrice: formData.entryPrice,
        exitPrice: formData.exitPrice,
        stopLoss: formData.stopLoss ? parseFloat(formData.stopLoss as string) : null,
        takeProfit: formData.takeProfit ? parseFloat(formData.takeProfit as string) : null,
        notes: formData.notes || null,
        accountId,
      };

      if (editingTrade) {
        await patch(ROUTES.ADMIN.TRADE_BY_ID(editingTrade.id), payload);
        toast.success("Trade updated successfully!");
      } else {
        await post(ROUTES.ADMIN.TRADES, payload);
        toast.success("Trade injected successfully!");
      }
      
      setShowForm(false);
      setEditingTrade(null);
      setFormData({ symbol: "", direction: "BUY", lots: 1.0, entryPrice: 1.0, exitPrice: 1.0, stopLoss: "", takeProfit: "", notes: "" });
      setPage(1);
      fetchTrades();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Operation failed.");
    }
  };

  const columns = useMemo<ColumnDef<Trade>[]>(() => [
    {
      accessorKey: "id",
      header: ({ column }) => <SortableColumnHeader column={column} label="Ticket" />,
      cell: ({ row }) => <div className="font-mono text-xs font-medium">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "symbol",
      header: ({ column }) => <SortableColumnHeader column={column} label="Symbol" />,
    },
    {
      accessorKey: "type",
      header: ({ column }) => <SortableColumnHeader column={column} label="Type" />,
      cell: ({ row }) => {
        const type = row.getValue("type") as Trade["type"];
        return <div className={type === "Buy" ? "text-emerald-600 font-semibold" : "text-rose-600 font-semibold"}>{type}</div>;
      },
    },
    {
      accessorKey: "vol",
      header: ({ column }) => <SortableColumnHeader column={column} label="Volume" />,
    },
    {
      accessorKey: "openP",
      header: ({ column }) => <SortableColumnHeader column={column} label="Open" />,
      cell: ({ row }) => <div>{parseFloat(row.getValue("openP")).toFixed(4)}</div>,
    },
    {
      accessorKey: "closeP",
      header: ({ column }) => <SortableColumnHeader column={column} label="Close" />,
      cell: ({ row }) => <div>{parseFloat(row.getValue("closeP")).toFixed(4)}</div>,
    },
    {
      accessorKey: "profit",
      header: ({ column }) => <SortableColumnHeader column={column} label="Profit" />,
      cell: ({ row }) => {
        const profit = parseFloat(row.getValue("profit"));
        return (
          <div className={`font-medium ${profit >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
            {profit >= 0 ? "+" : ""}${profit.toFixed(2)}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const trade = row.original;
        return (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEdit(trade)}
              className="h-8 w-8 text-muted-foreground hover:text-indigo-600"
            >
              <Edit2Icon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(trade.id)}
              className="h-8 w-8 text-muted-foreground hover:text-rose-600"
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ], []);

  return (
    <SectionCard title={`Trade Editor for ${accountId}`}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">Manage historical and active trades for this account.</p>
        <Button onClick={() => setShowForm(!showForm)} size="sm" className="gap-1.5">
          <PlusIcon className="h-4 w-4" />
          Add Trade
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-muted/30 border rounded-xl p-4 grid gap-4 sm:grid-cols-4 items-end mb-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Symbol</label>
            <Input
              placeholder="EURUSD"
              value={formData.symbol}
              onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Direction</label>
            <Select
              onValueChange={(val) => {
                if (val) setFormData({ ...formData, direction: val as "BUY" | "SELL" });
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BUY">BUY</SelectItem>
                <SelectItem value="SELL">SELL</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Lots</label>
            <Input
              type="number"
              step="0.01"
              value={formData.lots}
              onChange={(e) => setFormData({ ...formData, lots: parseFloat(e.target.value) || 0.01 })}
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Entry Price</label>
            <Input
              type="number"
              step="0.00001"
              value={formData.entryPrice}
              onChange={(e) => setFormData({ ...formData, entryPrice: parseFloat(e.target.value) || 0 })}
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Exit Price</label>
            <Input
              type="number"
              step="0.00001"
              value={formData.exitPrice}
              onChange={(e) => setFormData({ ...formData, exitPrice: parseFloat(e.target.value) || 0 })}
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Stop Loss (SL)</label>
            <Input
              type="number"
              step="0.00001"
              placeholder="Optional"
              value={formData.stopLoss}
              onChange={(e) => setFormData({ ...formData, stopLoss: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Take Profit (TP)</label>
            <Input
              type="number"
              step="0.00001"
              placeholder="Optional"
              value={formData.takeProfit}
              onChange={(e) => setFormData({ ...formData, takeProfit: e.target.value })}
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              {editingTrade ? "Save Changes" : "Create Trade"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowForm(false);
                setEditingTrade(null);
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-8 text-muted-foreground animate-pulse">
          Loading trades...
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={trades}
          serverPagination={{
            page,
            pageCount: Math.ceil(totalCount / PAGE_SIZE),
            onPageChange: setPage,
          }}
        />
      )}
    </SectionCard>
  );
}
