"use client";

import { useState, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { SortableColumnHeader } from "@/components/sortable-column-header";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchIcon } from "lucide-react";
import { auditActionTypes, mockAudits } from "@/lib/mock-data/audits";
import type { AuditLogEntry } from "@/types/admin";

const ACTION_BADGE: Record<string, string> = {
  "Inject Trade": "bg-blue-100 text-blue-700",
  "Close Position": "bg-amber-100 text-amber-700",
  "Account Update": "bg-purple-100 text-purple-700",
};

const columns: ColumnDef<AuditLogEntry>[] = [
  {
    accessorKey: "timestamp",
    header: ({ column }) => <SortableColumnHeader column={column} label="Time" />,
    cell: ({ row }) => <div className="text-muted-foreground">{row.getValue("timestamp")}</div>,
  },
  {
    accessorKey: "adminEmail",
    header: ({ column }) => <SortableColumnHeader column={column} label="Admin" />,
  },
  {
    accessorKey: "action",
    header: ({ column }) => <SortableColumnHeader column={column} label="Action" />,
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
    header: ({ column }) => <SortableColumnHeader column={column} label="Target Account" />,
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

export function AuditTable() {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("All");

  const filtered = useMemo(() => {
    let result = [...mockAudits];
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
        <Select value={actionFilter} onValueChange={(value) => setActionFilter(value ?? "All")}>
          <SelectTrigger className="w-[170px]">
            <SelectValue placeholder="All Actions" />
          </SelectTrigger>
          <SelectContent>
            {auditActionTypes.map((type) => (
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
