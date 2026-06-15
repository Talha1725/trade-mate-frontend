"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { adminApi } from "@/lib/services/admin.api";
import { auditApi } from "@/lib/services/audit.api";
import { accountsApi } from "@/lib/services/accounts.api";
import type { AccountSummary, AuditLogEntry } from "@/types/admin";
import { UsersIcon, ActivityIcon, ShieldCheckIcon, DollarSignIcon, ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalAccounts: 0,
    totalTrades: 0,
    totalProfit: 0,
    activePositions: 0,
  });
  const [recentAccounts, setRecentAccounts] = useState<AccountSummary[]>([]);
  const [recentAudits, setRecentAudits] = useState<AuditLogEntry[]>([]);
  const [popularSymbols, setPopularSymbols] = useState<{ symbol: string; count: number; percentage: number }[]>([]);
  const [buyRatio, setBuyRatio] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, accountsData, auditsData, tradesData] = await Promise.all([
          adminApi.getAdminStats(),
          accountsApi.getAccounts({ page: 1, limit: 5 }),
          auditApi.getAuditLogs({ page: 1, limit: 5 }),
          adminApi.getAllAdminTrades(),
        ]);

        setStats(statsData);
        setRecentAccounts(accountsData.items);
        setRecentAudits(auditsData.items);

        if (tradesData.length > 0) {
          const symbolCounts: Record<string, number> = {};
          let buyCount = 0;
          
          for (const t of tradesData) {
            symbolCounts[t.symbol] = (symbolCounts[t.symbol] || 0) + 1;
            if (t.type === "Buy") {
              buyCount++;
            }
          }

          setBuyRatio(Math.round((buyCount / tradesData.length) * 100));

          const sortedSymbols = Object.entries(symbolCounts)
            .map(([symbol, count]) => ({
              symbol,
              count,
              percentage: Math.round((count / tradesData.length) * 100),
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 4);

          setPopularSymbols(sortedSymbols);
        } else {
          setPopularSymbols([
            { symbol: "EURUSD", count: 0, percentage: 0 },
            { symbol: "GBPUSD", count: 0, percentage: 0 },
          ]);
        }
      } catch (e) {
        console.error("Error loading dashboard data", e);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <div className="text-muted-foreground animate-pulse">Loading dashboard parameters...</div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <PageHeader
        title="Admin Dashboard"
        description="Monitor system operations, manage accounts, and audit platform activity."
      />

      {/* Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SectionCard title="Total Accounts" icon={UsersIcon}>
          <p className="text-3xl font-semibold tracking-tight text-[#1a1a1a]">
            {stats.totalAccounts}
          </p>
          <p className="text-sm text-muted-foreground">Registered user accounts</p>
        </SectionCard>

        <SectionCard title="Active Accounts" icon={UsersIcon}>
          <p className="text-3xl font-semibold tracking-tight text-emerald-600">
            {recentAccounts.filter(a => a.status === "Active").length}
          </p>
          <p className="text-sm text-muted-foreground">Accounts currently enabled</p>
        </SectionCard>

        <SectionCard title="Open Trades" icon={ActivityIcon}>
          <p className="text-3xl font-semibold tracking-tight text-[#1a1a1a]">
            {stats.activePositions}
          </p>
          <p className="text-sm text-muted-foreground">Active simulated positions</p>
        </SectionCard>

        <SectionCard title="Total P/L" icon={DollarSignIcon}>
          <p className={cn("text-3xl font-semibold tracking-tight", stats.totalProfit >= 0 ? "text-emerald-600" : "text-rose-600")}>
            {stats.totalProfit >= 0 ? "+" : ""}${stats.totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-muted-foreground">System-wide simulated profit</p>
        </SectionCard>
      </div>

      {/* Main Grid Sections */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Recently Modified Accounts Table */}
        <div className="md:col-span-2">
          <SectionCard
            title="Recently Modified Accounts"
            description="Manage user equity and account status parameters."
            action={
              <Link
                href="/admin/accounts"
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-xs gap-1")}
              >
                View All Accounts
                <ArrowRightIcon className="h-3 w-3" />
              </Link>
            }
          >
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Account ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Equity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentAccounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell className="font-mono text-xs">{account.id}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm">{account.name}</span>
                          <span className="text-xs text-muted-foreground">{account.email}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-emerald-600">
                        ${account.equity.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "inline-flex px-2 py-0.5 rounded-full text-xs font-medium",
                            account.status === "Active"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-rose-100 text-rose-700"
                          )}
                        >
                          {account.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link
                          href={`/admin/accounts/${account.id}`}
                          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "h-7 text-xs px-2")}
                        >
                          Manage
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                  {recentAccounts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-4">
                        No accounts discovered yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </SectionCard>
        </div>

        {/* Trade Activity Summary Widget */}
        <div className="md:col-span-1">
          <SectionCard
            title="Trade Activity Summary"
            description="Overview of simulated trading volume."
          >
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1 rounded-lg border bg-muted/20 p-3">
                  <span className="text-xs text-muted-foreground font-medium uppercase">Total Trades</span>
                  <span className="text-xl font-bold">{stats.totalTrades}</span>
                </div>
                <div className="flex flex-col gap-1 rounded-lg border bg-muted/20 p-3">
                  <span className="text-xs text-muted-foreground font-medium uppercase">Buy Ratio</span>
                  <span className="text-xl font-bold">{buyRatio}%</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2 border-t">
                <span className="text-xs font-semibold text-muted-foreground uppercase">Popular Symbols</span>
                <div className="space-y-2">
                  {popularSymbols.map((item) => (
                    <div key={item.symbol} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-medium">
                        <span>{item.symbol}</span>
                        <span className="text-muted-foreground">{item.count} trades</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Recent Admin Activity Panel */}
      <div className="grid gap-6 md:grid-cols-1">
        <SectionCard
          title="Recent Admin Activity"
          description="Log of recently executed administrative actions."
          icon={ShieldCheckIcon}
          action={
            <Link
              href="/admin/audit"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-xs gap-1")}
            >
              View Full Audit Logs
              <ArrowRightIcon className="h-3 w-3" />
            </Link>
          }
        >
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Admin</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Target Account</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentAudits.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-muted-foreground text-xs">{log.timestamp}</TableCell>
                    <TableCell className="font-semibold text-sm">{log.adminEmail}</TableCell>
                    <TableCell>
                      <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        {log.action}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{log.targetAccountId}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{log.details}</TableCell>
                  </TableRow>
                ))}
                {recentAudits.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-4">
                      No administrative actions logged yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
