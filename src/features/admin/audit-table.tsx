"use client";

import { useState, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpDown, SearchIcon } from "lucide-react";
import type { AuditLogEntry } from "@/types/admin";

const ACTION_TYPES = ["All", "Inject Trade", "Close Position", "Account Update"];

const ACTION_BADGE: Record<string, string> = {
  "Inject Trade": "bg-blue-100 text-blue-700",
  "Close Position": "bg-amber-100 text-amber-700",
  "Account Update": "bg-purple-100 text-purple-700",
};

const columns: ColumnDef<AuditLogEntry>[] = [
  {
    accessorKey: "timestamp",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="px-0 h-auto font-medium">
        Time <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="text-muted-foreground">{row.getValue("timestamp")}</div>,
  },
  {
    accessorKey: "adminEmail",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="px-0 h-auto font-medium">
        Admin <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "action",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="px-0 h-auto font-medium">
        Action <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const action = row.getValue("action") as string;
      return (
        <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${ACTION_BADGE[action] ?? "bg-muted text-muted-foreground"}`}>
          {action}
        </div>
      );
    },
  },
  {
    accessorKey: "targetAccountId",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="px-0 h-auto font-medium">
        Target Account <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "details",
    header: "Details",
    cell: ({ row }) => (
      <div className="max-w-[400px] truncate text-muted-foreground text-sm" title={row.getValue("details")}>
        {row.getValue("details")}
      </div>
    ),
  },
];

const MOCK_AUDITS: AuditLogEntry[] = [
  { id: "LOG-01", timestamp: "2023-10-25 14:30", adminId: "ADM-1", adminEmail: "admin@trademate.app", action: "Inject Trade", targetAccountId: "ACC-1001", details: "Injected BUY 1.0 EURUSD @ Market" },
  { id: "LOG-02", timestamp: "2023-10-25 13:15", adminId: "ADM-1", adminEmail: "admin@trademate.app", action: "Close Position", targetAccountId: "ACC-1002", details: "Closed ticket #10246" },
  { id: "LOG-03", timestamp: "2023-10-24 09:00", adminId: "ADM-2", adminEmail: "support@trademate.app", action: "Account Update", targetAccountId: "ACC-1003", details: "Suspended account due to margin call" },
];

export function AuditTable() {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("All");

  const filtered = useMemo(() => {
    let result = [...MOCK_AUDITS];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.adminEmail.toLowerCase().includes(q) ||
          a.targetAccountId.toLowerCase().includes(q) ||
          a.details.toLowerCase().includes(q)
      );
    }
    if (actionFilter !== "All") {
      result = result.filter((a) => a.action === actionFilter);
    }
    return result;
  }, [search, actionFilter]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by admin, account or details..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="w-[170px]">
            <SelectValue placeholder="All Actions" />
          </SelectTrigger>
          <SelectContent>
            {ACTION_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type === "All" ? "All Actions" : type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <DataTable columns={columns} data={filtered} pageSize={100} />
    </div>
  );
}
