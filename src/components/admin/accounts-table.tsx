"use client";

import { useState, useEffect, useCallback } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { SortableColumnHeader } from "@/components/sortable-column-header";
import { DataTable } from "@/components/ui/data-table";
import { buttonVariants, Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchIcon, UserPlusIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { accountsApi } from "@/lib/services/accounts.api";
import { useServerTablePagination } from "@/hooks/use-server-table-pagination";
import type { AccountSummary } from "@/types/admin";
import { toast } from "sonner";

const columns: ColumnDef<AccountSummary>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => <SortableColumnHeader column={column} label="Account ID" />,
    cell: ({ row }) => <div className="text-xs font-mono font-medium">{row.getValue("id")}</div>,
  },
  {
    id: "user",
    header: ({ column }) => <SortableColumnHeader column={column} label="User" />,
    cell: ({ row }) => {
      const name = row.original.name;
      const email = row.original.email;
      return (
        <div className="flex flex-col">
          <span className="font-semibold text-sm">{name}</span>
          <span className="text-xs text-muted-foreground">{email}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "balance",
    header: ({ column }) => <SortableColumnHeader column={column} label="Balance" />,
    cell: ({ row }) => {
      const balance = parseFloat(row.getValue("balance"));
      return <div className="font-medium">${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>;
    },
  },
  {
    accessorKey: "equity",
    header: ({ column }) => <SortableColumnHeader column={column} label="Equity" />,
    cell: ({ row }) => {
      const equity = parseFloat(row.getValue("equity"));
      return <div className="font-medium text-emerald-600">${equity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>;
    },
  },
  {
    accessorKey: "openPositionsCount",
    header: ({ column }) => <SortableColumnHeader column={column} label="Open Positions" />,
    cell: ({ row }) => {
      const count = row.getValue("openPositionsCount") as number;
      return <div className="font-medium">{count}</div>;
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
    header: "Actions",
    cell: ({ row }) => {
      const account = row.original;
      return (
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/accounts/${account.id}`}
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-xs h-8 px-2.5")}
          >
            Manage
          </Link>
        </div>
      );
    },
  },
];

export function AccountsTable() {
  const [accounts, setAccounts] = useState<AccountSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | AccountSummary["status"]>("All");
  const [totalItems, setTotalItems] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [showProvisionForm, setShowProvisionForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    role: "TRADER" as "TRADER" | "ADMIN",
    balance: 10000,
  });
  const [provisioning, setProvisioning] = useState(false);
  const { page, pageSize, setPage, setPageSize } = useServerTablePagination({
    defaultPageSize: 10,
    pageSizeOptions: [10, 25, 50],
  });

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await accountsApi.getAccounts({
        page,
        limit: pageSize,
        search: search.trim() || undefined,
        status: statusFilter === "All" ? undefined : statusFilter,
      });

      setAccounts(data.items);
      setTotalItems(data.total);
      setPageCount(data.pageCount);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load accounts.");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, statusFilter]);

  useEffect(() => {
    void fetchAccounts();
  }, [fetchAccounts, refreshKey]);

  const handleProvision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Email and password are required.");
      return;
    }
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    setProvisioning(true);
    try {
      await accountsApi.provisionUser({
        email: formData.email,
        password: formData.password,
        name: formData.name || null,
        role: formData.role,
        account: {
          name: "Main",
          type: "DEMO",
          status: "ACTIVE",
          currency: "USD",
          balance: formData.balance,
        },
      });

      toast.success("User account provisioned successfully!");
      setShowProvisionForm(false);
      setFormData({ email: "", password: "", name: "", role: "TRADER", balance: 10000 });
      setPage(1);
      setRefreshKey((value) => value + 1);
    } catch (err: any) {
      console.error(err);
      const serverMsg: string = err.response?.data?.message ?? "";
      const isDuplicate =
        serverMsg.toLowerCase().includes("already") ||
        serverMsg.toLowerCase().includes("duplicate") ||
        serverMsg.toLowerCase().includes("unique") ||
        err.response?.data?.code === "P2002";
      toast.error(
        isDuplicate
          ? "A user with this email already exists."
          : serverMsg || "Failed to provision user.",
      );
    } finally {
      setProvisioning(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email or ID..."
            className="pl-8"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className="flex items-center gap-3">
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter((value ?? "All") as typeof statusFilter);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setShowProvisionForm(!showProvisionForm)} variant="default" className="gap-2">
            <UserPlusIcon className="h-4 w-4" />
            Provision Account
          </Button>
        </div>
      </div>

      {showProvisionForm && (
        <form onSubmit={handleProvision} className="grid gap-4 rounded-xl border bg-muted/30 p-4 md:grid-cols-3 items-end">
          <div className="space-y-1.5 md:col-span-1">
            <label className="text-xs font-semibold">Name</label>
            <Input
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="space-y-1.5 md:col-span-1">
            <label className="text-xs font-semibold">Email</label>
            <Input
              type="email"
              placeholder="email@trademate.local"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="space-y-1.5 md:col-span-1">
            <label className="text-xs font-semibold">Password</label>
            <Input
              type="password"
              placeholder="Min 8 chars"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
          <div className="space-y-1.5 md:col-span-1">
            <label className="text-xs font-semibold">Initial Balance ($)</label>
            <Input
              type="number"
              value={formData.balance}
              onChange={(e) => setFormData({ ...formData, balance: parseFloat(e.target.value) || 0 })}
            />
          </div>
          <div className="space-y-1.5 md:col-span-1">
            <label className="text-xs font-semibold">Role</label>
            <Select
              value={formData.role}
              onValueChange={(val) => {
                if (val) setFormData({ ...formData, role: val as "TRADER" | "ADMIN" });
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TRADER">Trader</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 md:col-span-1">
            <Button type="submit" disabled={provisioning} className="w-full">
              {provisioning ? "Provisioning..." : "Submit"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowProvisionForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="animate-pulse py-8 text-center text-muted-foreground">
          Loading accounts...
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={accounts}
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
    </div>
  );
}
