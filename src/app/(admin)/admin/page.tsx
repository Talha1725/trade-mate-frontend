import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockAccounts } from "@/lib/mock-data/accounts";
import { mockAudits } from "@/lib/mock-data/audits";
import { mockTrades } from "@/lib/mock-data/trades";
import { UsersIcon, ActivityIcon, ShieldCheckIcon, DollarSignIcon, ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default function AdminDashboardPage() {
  const totalAccounts = mockAccounts.length;
  const activeAccounts = mockAccounts.filter((a) => a.status === "Active").length;
  const openTrades = mockAccounts.reduce((sum, a) => sum + a.openPositionsCount, 0);
  const todaysPL = 12450.0;

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
            {totalAccounts}
          </p>
          <p className="text-sm text-muted-foreground">Registered user accounts</p>
        </SectionCard>

        <SectionCard title="Active Accounts" icon={UsersIcon}>
          <p className="text-3xl font-semibold tracking-tight text-emerald-600">
            {activeAccounts}
          </p>
          <p className="text-sm text-muted-foreground">Accounts currently enabled</p>
        </SectionCard>

        <SectionCard title="Open Trades" icon={ActivityIcon}>
          <p className="text-3xl font-semibold tracking-tight text-[#1a1a1a]">
            {openTrades}
          </p>
          <p className="text-sm text-muted-foreground">Active simulated positions</p>
        </SectionCard>

        <SectionCard title="Today's P/L" icon={DollarSignIcon}>
          <p className={cn("text-3xl font-semibold tracking-tight", todaysPL >= 0 ? "text-emerald-600" : "text-rose-600")}>
            {todaysPL >= 0 ? "+" : ""}${todaysPL.toLocaleString(undefined, { minimumFractionDigits: 2 })}
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
                  {mockAccounts.map((account) => (
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
                  <span className="text-xl font-bold">{mockTrades.length}</span>
                </div>
                <div className="flex flex-col gap-1 rounded-lg border bg-muted/20 p-3">
                  <span className="text-xs text-muted-foreground font-medium uppercase">Buy Ratio</span>
                  <span className="text-xl font-bold">
                    {Math.round(
                      (mockTrades.filter((t) => t.type === "Buy").length / mockTrades.length) * 100
                    )}
                    %
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2 border-t">
                <span className="text-xs font-semibold text-muted-foreground uppercase">Popular Symbols</span>
                <div className="space-y-2">
                  {[
                    { symbol: "EURUSD", count: 2, percentage: 40 },
                    { symbol: "GBPUSD", count: 1, percentage: 20 },
                    { symbol: "XAUUSD", count: 1, percentage: 20 },
                    { symbol: "USDJPY", count: 1, percentage: 20 },
                  ].map((item) => (
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
                {mockAudits.map((log) => (
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
              </TableBody>
            </Table>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
