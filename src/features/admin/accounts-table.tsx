"use client";

import { useState, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { SortableColumnHeader } from "@/components/sortable-column-header";
import { DataTable } from "@/components/ui/data-table";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExternalLinkIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { mockAccounts } from "@/lib/mock-data/accounts";
import type { AccountSummary } from "@/types/admin";

const columns: ColumnDef<AccountSummary>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => <SortableColumnHeader column={column} label="Account ID" />,
    cell: ({ row }) => <div className="text-xs font-medium">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => <SortableColumnHeader column={column} label="Name" />,
    cell: ({ row }) => <div className="font-semibold">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => <SortableColumnHeader column={column} label="Email" />,
  },
  {
    accessorKey: "equity",
    header: ({ column }) => <SortableColumnHeader column={column} label="Equity" />,
    cell: ({ row }) => {
      const equity = parseFloat(row.getValue("equity"));
      return <div className="font-medium text-emerald-600">${equity.toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => <SortableColumnHeader column={column} label="Status" />,
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
          {status}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const account = row.original;
      return (
        <Link href={`/admin/accounts/${account.id}`} className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-2")}>
          Manage <ExternalLinkIcon className="h-4 w-4" />
        </Link>
      );
    },
  },
];

export function AccountsTable() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = useMemo(() => {
    let result = [...mockAccounts];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q) ||
          a.id.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "All") {
      result = result.filter((a) => a.status === statusFilter);
    }
    return result;
  }, [search, statusFilter]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email or ID..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value ?? "All")}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Statuses</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DataTable columns={columns} data={filtered} pageSize={100} />
    </div>
  );
}
