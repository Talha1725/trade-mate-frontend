"use client";

import { SectionCard } from "@/components/section-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon, ChevronRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import type { AccountSummary } from "@/types/admin";

const MOCK_ACCOUNTS: AccountSummary[] = [
  { id: "ACC-1001", name: "Alice Smith", email: "alice@example.com", balance: 10000, equity: 10250, openPositionsCount: 2, status: "Active" },
  { id: "ACC-1002", name: "Bob Jones", email: "bob@example.com", balance: 5000, equity: 4800, openPositionsCount: 1, status: "Active" },
  { id: "ACC-1003", name: "Charlie Day", email: "charlie@example.com", balance: 25000, equity: 25000, openPositionsCount: 0, status: "Suspended" },
];

export function AccountSelector() {
  const router = useRouter();

  return (
    <SectionCard title="Manage Accounts">
      <div className="flex flex-col gap-4">
        <div className="relative">
          <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name, email, or ID..." className="pl-8" />
        </div>
        <div className="grid gap-2">
          {MOCK_ACCOUNTS.map((acc) => (
            <div 
              key={acc.id} 
              className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => router.push(`/admin/accounts/${acc.id}`)}
            >
              <div className="flex flex-col">
                <span className="font-semibold">{acc.name}</span>
                <span className="text-xs text-muted-foreground">{acc.email} • {acc.id}</span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex flex-col items-end hidden sm:flex">
                  <span className="font-medium">${acc.equity.toLocaleString()}</span>
                  <span className="text-xs text-muted-foreground">Equity</span>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${acc.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                  {acc.status}
                </div>
                <ChevronRightIcon className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}
