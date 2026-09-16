"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { SortableColumnHeader } from "@/components/sortable-column-header";
import { SectionCard } from "@/components/section-card";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit2Icon, TrashIcon, PlusIcon, SearchIcon } from "lucide-react";
import { accountsApi } from "@/lib/services/accounts.api";
import { post, patch, del } from "@/lib/utils/api";
import { useServerTablePagination } from "@/hooks/use-server-table-pagination";
import { ROUTES } from "@/constant/routes";
import type {
  AdminTradeCreatePayload,
  AdminTradeFormData,
  AdminTradeUpdatePayload,
  Trade,
  TradeEditorProps,
  TradeStatusFilter,
} from "@/types/trade";
import { toast } from "sonner";

const EMPTY_FORM_DATA: AdminTradeFormData = {
  symbol: "",
  direction: "BUY",
  lots: "1",
  entryPrice: "",
  exitPrice: "",
  stopLoss: "",
  takeProfit: "",
  openedAt: "",
  closedAt: "",
  notes: "",
};

function parseOptionalNumber(value: string) {
  if (value.trim() === "") {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

function parseOptionalProtection(value: string) {
  const parsed = parseOptionalNumber(value);
  return parsed === undefined ? null : parsed;
}

function toDateTimeLocalValue(value?: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

function toIsoDateTime(value: string) {
  return value ? new Date(value).toISOString() : undefined;
}

function hasInvalidNumber(value: number | null | undefined) {
  return typeof value === "number" && Number.isNaN(value);
}

export function TradeEditor({ accountId }: TradeEditorProps) {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TradeStatusFilter>("All");
  const [totalItems, setTotalItems] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const { page, pageSize, setPage, setPageSize } = useServerTablePagination({
    defaultPageSize: 10,
    pageSizeOptions: [10, 25, 50],
  });

  const [formData, setFormData] = useState<AdminTradeFormData>(EMPTY_FORM_DATA);

  const fetchTrades = useCallback(async () => {
    setLoading(true);
    try {
      const data = await accountsApi.getAccountTrades(accountId, {
        page,
        limit: pageSize,
        search: search.trim() || undefined,
        status: statusFilter,
      });

      setTrades(data.items);
      setTotalItems(data.total);
      setPageCount(data.pageCount);
    } catch {
      toast.error("Failed to load account trades.");
    } finally {
      setLoading(false);
    }
  }, [accountId, page, pageSize, search, statusFilter]);

  useEffect(() => {
    void fetchTrades();
  }, [fetchTrades, refreshKey]);

  const handleEdit = (trade: Trade) => {
    setEditingTrade(trade);
    setFormData({
      symbol: trade.symbol,
      direction: trade.type === "Buy" ? "BUY" : "SELL",
      lots: String(trade.vol),
      entryPrice: Number.isFinite(trade.openP) ? String(trade.openP) : "",
      exitPrice: trade.closeP > 0 ? String(trade.closeP) : "",
      stopLoss: trade.stopLoss == null ? "" : String(trade.stopLoss),
      takeProfit: trade.takeProfit == null ? "" : String(trade.takeProfit),
      openedAt: toDateTimeLocalValue(trade.openedAt ?? trade.time),
      closedAt: toDateTimeLocalValue(trade.closedAt),
      notes: trade.notes ?? "",
    });
    setShowForm(true);
  };

  const handleDelete = async (tradeId: string) => {
    if (!confirm("Are you sure you want to delete this trade?")) return;
    try {
      await del(ROUTES.ADMIN.TRADE_BY_ID(tradeId));
      toast.success("Trade deleted successfully.");
      setPage(1);
      setRefreshKey((value) => value + 1);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete trade.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const lots = Number(formData.lots);
      const entryPrice = parseOptionalNumber(formData.entryPrice);
      const exitPrice = parseOptionalNumber(formData.exitPrice);
      const stopLoss = parseOptionalProtection(formData.stopLoss);
      const takeProfit = parseOptionalProtection(formData.takeProfit);

      if (!Number.isFinite(lots) || lots <= 0) {
        toast.error("Lots must be greater than zero.");
        return;
      }

      if (
        hasInvalidNumber(entryPrice) ||
        hasInvalidNumber(exitPrice) ||
        hasInvalidNumber(stopLoss) ||
        hasInvalidNumber(takeProfit)
      ) {
        toast.error("Please enter valid numeric values.");
        return;
      }

      if (editingTrade) {
        const payload: AdminTradeUpdatePayload = {
          lots,
          stopLoss,
          takeProfit,
          notes: formData.notes.trim() || null,
        };

        if (entryPrice !== undefined) {
          payload.entryPrice = entryPrice;
        }

        payload.exitPrice = exitPrice === undefined ? null : exitPrice;
        payload.openedAt = toIsoDateTime(formData.openedAt) ?? null;
        payload.closedAt = toIsoDateTime(formData.closedAt) ?? null;

        await patch(ROUTES.ADMIN.TRADE_BY_ID(editingTrade.id), payload);
        toast.success("Trade updated successfully!");
      } else {
        const symbol = formData.symbol.trim().toUpperCase();
        if (!symbol) {
          toast.error("Symbol is required.");
          return;
        }

        const payload: AdminTradeCreatePayload = {
          accountId,
          symbol,
          direction: formData.direction,
          lots,
          stopLoss,
          takeProfit,
        };

        if (entryPrice !== undefined) {
          payload.entryPrice = entryPrice;
        }

        if (exitPrice !== undefined) {
          payload.exitPrice = exitPrice;
        }

        const openedAt = toIsoDateTime(formData.openedAt);
        if (openedAt) {
          payload.openedAt = openedAt;
        }

        await post(ROUTES.ADMIN.TRADES, payload);
        toast.success("Trade injected successfully!");
      }

      setShowForm(false);
      setEditingTrade(null);
      setFormData(EMPTY_FORM_DATA);
      setPage(1);
      setRefreshKey((value) => value + 1);
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
        return <div className={type === "Buy" ? "font-semibold text-emerald-600" : "font-semibold text-rose-600"}>{type}</div>;
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
              title="Edit trade"
              onClick={() => handleEdit(trade)}
              className="h-8 w-8 text-muted-foreground hover:text-indigo-600 disabled:opacity-40"
            >
              <Edit2Icon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              title="Delete trade"
              onClick={() => handleDelete(trade.id)}
              className="h-8 w-8 text-muted-foreground hover:text-rose-600 disabled:opacity-40"
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
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Manage historical and active trades for this account.</p>
        <Button
          onClick={() => {
            setShowForm((current) => !current);
            setEditingTrade(null);
            setFormData(EMPTY_FORM_DATA);
          }}
          size="sm"
          className="gap-1.5"
        >
          <PlusIcon className="h-4 w-4" />
          Add Trade
        </Button>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by symbol or ticket..."
            className="pl-8"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter((value ?? "All") as TradeStatusFilter);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-4 grid gap-4 rounded-xl border bg-muted/30 p-4 sm:grid-cols-4 items-end">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Symbol</label>
            <Input
              placeholder="EURUSD"
              value={formData.symbol}
              onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
              disabled={Boolean(editingTrade)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Direction</label>
            <Select
              value={formData.direction}
              onValueChange={(v) => setFormData({ ...formData, direction: v as "BUY" | "SELL" })}
            >
              <SelectTrigger disabled={Boolean(editingTrade)}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BUY">Buy</SelectItem>
                <SelectItem value="SELL">Sell</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Lots</label>
            <Input
              type="number"
              step="0.01"
              value={formData.lots}
              min="0.01"
              onChange={(e) => setFormData({ ...formData, lots: e.target.value })}
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Entry Price</label>
            <Input
              type="number"
              step="0.0001"
              value={formData.entryPrice}
              onChange={(e) => setFormData({ ...formData, entryPrice: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Exit Price</label>
            <Input
              type="number"
              step="0.0001"
              value={formData.exitPrice}
              onChange={(e) => setFormData({ ...formData, exitPrice: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Stop Loss</label>
            <Input
              type="number"
              step="0.0001"
              value={formData.stopLoss}
              onChange={(e) => setFormData({ ...formData, stopLoss: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Take Profit</label>
            <Input
              type="number"
              step="0.0001"
              value={formData.takeProfit}
              onChange={(e) => setFormData({ ...formData, takeProfit: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Opened At</label>
            <Input
              type="datetime-local"
              value={formData.openedAt}
              onChange={(e) => setFormData({ ...formData, openedAt: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Closed At</label>
            <Input
              type="datetime-local"
              value={formData.closedAt}
              onChange={(e) => setFormData({ ...formData, closedAt: e.target.value })}
              disabled={!editingTrade && !formData.exitPrice.trim()}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-semibold">Notes</label>
            <Input
              placeholder="Optional notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              disabled={!editingTrade}
            />
          </div>
          <div className="flex items-center gap-2 sm:col-span-4">
            <Button type="submit" className="gap-2">
              {editingTrade ? "Update Trade" : "Submit Trade"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowForm(false);
                setEditingTrade(null);
                setFormData(EMPTY_FORM_DATA);
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="animate-pulse py-8 text-center text-muted-foreground">Loading account trades...</div>
      ) : (
        <DataTable
          columns={columns}
          data={trades}
          serverPagination={{
            page,
            pageCount,
            totalItems,
            pageSize,
            pageSizeOptions: [10, 25, 50],
            onPageChange: setPage,
            onPageSizeChange: (nextPageSize) => {
              setPageSize(nextPageSize);
              setPage(1);
            },
          }}
        />
      )}
    </SectionCard>
  );
}
