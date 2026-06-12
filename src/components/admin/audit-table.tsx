"use client";

import { useState, useMemo, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { SortableColumnHeader } from "@/components/sortable-column-header";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchIcon } from "lucide-react";
import { auditApi } from "@/lib/services/audit.api";
import type { AuditLogEntry } from "@/types/admin";
import { toast } from "sonner";

const ACTION_BADGE: Record<string, string> = {
  "Inject Trade": "bg-blue-100 text-blue-700",
  "Close Position": "bg-amber-100 text-amber-700",
  "Account Update": "bg-purple-100 text-purple-700",
  "Bulk Push": "bg-indigo-100 text-indigo-700",
  "Modify Trade": "bg-teal-100 text-teal-700",
};

const auditActionTypes = ["All", "Inject Trade", "Close Position", "Account Update", "Bulk Push", "Modify Trade"];

const columns: ColumnDef<AuditLogEntry>[] = [
  {
    accessorKey: "timestamp",
    header: ({ column }) => <SortableColumnHeader column={column} label="Timestamp" />,
    cell: ({ row }) => <div className="text-muted-foreground text-xs">{row.getValue("timestamp")}</div>,
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
    cell: ({ row }) => <div className="font-mono text-xs">{row.getValue("targetAccountId")}</div>,
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
  const [audits, setAudits] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("All");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const fetchAudits = async () => {
    setLoading(true);
    try {
      const data = await auditApi.getAuditLogs();
      setAudits(data);
    } catch {
      toast.error("Failed to load audit logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudits();
  }, []);

  const filtered = useMemo(() => {
    let result = [...audits];
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
  }, [audits, search, actionFilter]);

  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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

      {loading ? (
        <div className="text-center py-8 text-muted-foreground animate-pulse">
          Loading audit logs...
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={paginated}
          serverPagination={{ page, pageCount, onPageChange: setPage }}
        />
      )}
    </div>
  );
}
