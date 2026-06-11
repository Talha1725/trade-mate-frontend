"use client";

import { SectionCard } from "@/components/section-card";
import { Input } from "@/components/ui/input";
import { SearchIcon, ChevronRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { mockAccounts } from "@/lib/mock-data/accounts";

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
          {mockAccounts.map((acc) => (
            <div 
              key={acc.id} 
              className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => router.push(`/admin/accounts/${acc.id}`)}
            >
              <div className="flex flex-col">
                <span className="font-semibold">{acc.name}</span>
                <span className="text-xs text-muted-foreground">{acc.email} - {acc.id}</span>
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
