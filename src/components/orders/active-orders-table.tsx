"use client";

import { IoCloseCircle } from "react-icons/io5";

import { TradingSymbolCell } from "@/components/shared/trading-symbol-cell";
import {
  formatTradingPrice,
  formatTradingQty,
  TRADING_TABLE_ROW_CLASS,
  TradingOrderStatusBadge,
  TradingSideBadge,
} from "@/components/shared/trading-table-cells";
import { TradingTableCard } from "@/components/shared/trading-table-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockActiveOrders } from "@/lib/mock-data/active-orders";
import type {
  ActiveOrderRow,
  ActiveOrdersTableProps,
  ActiveOrderStatus,
  ActiveOrderType,
} from "@/types/active-orders";

function formatTpSl(takeProfit: number | null, stopLoss: number | null) {
  if (takeProfit === null && stopLoss === null) {
    return "-";
  }

  const tp = takeProfit === null ? "-" : formatTradingPrice(takeProfit);
  const sl = stopLoss === null ? "-" : formatTradingPrice(stopLoss);
  return `${tp} / ${sl}`;
}

function formatOrderType(type: ActiveOrderType) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

function OrderStatusBadge({ status }: { status: ActiveOrderStatus }) {
  return (
    <TradingOrderStatusBadge
      label={status === "new" ? "New" : "Partial"}
      tone={status === "new" ? "primary" : "orange"}
    />
  );
}

function CancelButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex cursor-pointer items-center gap-2 rounded-[10px] border border-destructive/10 bg-destructive/10 px-3.5 py-2 text-xs font-medium text-destructive transition-colors hover:bg-destructive/20"
    >
      <IoCloseCircle className="size-4 text-destructive" />
      Cancel
    </button>
  );
}

function ActiveOrderRowCells({
  order,
  onCancel,
}: {
  order: ActiveOrderRow;
  onCancel?: (orderId: string) => void;
}) {
  return (
    <TableRow className={TRADING_TABLE_ROW_CLASS}>
      <TableCell className="px-4 py-[5px] text-sm text-white/60">{order.displayId}</TableCell>
      <TableCell className="px-4 py-[5px]">
        <TradingSymbolCell symbol={order.symbol} icon={order.icon} />
      </TableCell>
      <TableCell className="px-4 py-[5px]">
        <TradingSideBadge side={order.side} />
      </TableCell>
      <TableCell className="px-4 py-[5px] text-sm font-medium text-white/60">
        {formatOrderType(order.type)}
      </TableCell>
      <TableCell className="px-4 py-[5px] text-sm font-medium text-white/60">
        {formatTradingQty(order.qty)}
      </TableCell>
      <TableCell className="px-4 py-[5px] text-sm font-medium text-white/60">
        {formatTradingPrice(order.price)}
      </TableCell>
      <TableCell className="px-4 py-[5px] text-sm font-medium text-white/60">
        {formatTpSl(order.takeProfit, order.stopLoss)}
      </TableCell>
      <TableCell className="px-4 py-[5px]">
        <OrderStatusBadge status={order.status} />
      </TableCell>
      <TableCell className="px-4 py-[5px] text-right">
        <CancelButton onClick={() => onCancel?.(order.id)} />
      </TableCell>
    </TableRow>
  );
}

export function ActiveOrdersTable({
  title = "Active Orders",
  orders = mockActiveOrders,
  onExport,
  onCloseAll,
  onCancel,
  className,
}: ActiveOrdersTableProps) {
  return (
    <TradingTableCard
      title={title}
      onExport={onExport}
      onCloseAll={onCloseAll}
      className={className}
    >
      <Table className="min-w-[1040px]">
        <TableHeader variant="gradient">
          <TableRow className="hover:bg-transparent">
            <TableHead className="h-11 px-4 text-sm font-medium text-white/60">ID</TableHead>
            <TableHead className="h-11 px-4 text-sm font-medium text-white/60">Symbol</TableHead>
            <TableHead className="h-11 px-4 text-sm font-medium text-white/60">Side</TableHead>
            <TableHead className="h-11 px-4 text-sm font-medium text-white/60">Type</TableHead>
            <TableHead className="h-11 px-4 text-sm font-medium text-white/60">Qty</TableHead>
            <TableHead className="h-11 px-4 text-sm font-medium text-white/60">Price</TableHead>
            <TableHead className="h-11 px-4 text-sm font-medium text-white/60">TP / SL</TableHead>
            <TableHead className="h-11 px-4 text-sm font-medium text-white/60">Status</TableHead>
            <TableHead className="h-11 px-4 text-right text-sm font-medium text-white/60">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {orders.map((order) => (
            <ActiveOrderRowCells key={order.id} order={order} onCancel={onCancel} />
          ))}
        </TableBody>
      </Table>
    </TradingTableCard>
  );
}
