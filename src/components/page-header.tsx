"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, Bell, ChevronDown, LogOutIcon } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { PageHeaderProps } from "@/types";
import { PlaceOrderDialog } from "@/components/place-order-dialog";
import { useAuthStore } from "@/lib/stores/auth-store";

export function PageHeader({
  title,
  description,
  icon: Icon,
  actions,
  className,
}: PageHeaderProps) {
  const router = useRouter();
  const signOut = useAuthStore((state) => state.signOut);
  const userName = useAuthStore((state) => state.session?.user.name || state.session?.user.email || "Trader");

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    router.replace("/login");
  };

  return (
    <header
      suppressHydrationWarning
      className={cn(
        "flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-6",
        className,
      )}
    >
      {/* Search Bar — full width on mobile, constrained on desktop */}
      <div className="w-full lg:flex-1 lg:min-w-[160px] lg:max-w-[520px]">
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-700">
          <Search className="size-4 text-neutral-500 shrink-0" />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent text-sm text-white placeholder-neutral-500 outline-none w-full"
          />
        </div>
      </div>

      {/* Actions — 2-col grid on mobile/tablet, flex row on desktop */}
      <div className="grid grid-cols-2 gap-2 lg:flex lg:items-center lg:gap-3">
        <PlaceOrderDialog>
          <button className="flex gap-2 items-center justify-center trade-btn px-4 py-2 rounded-lg btn-new-trade text-white text-sm font-medium whitespace-nowrap">
            <Image src="/header/add circle.svg" alt="add" width={18} height={18} className="size-4 shrink-0" />
            New Trade
          </button>
        </PlaceOrderDialog>

        <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-neutral-700 text-medium-500 text-sm">
          <span className="size-2.5 animate-pulse rounded-full bg-primary shadow-[0_0_10px_var(--primary)]" />
          Live Market
        </button>

        <div className="flex items-center justify-center gap-2 px-3 py-2 rounded-full border border-neutral-700 text-medium-500 text-sm">
          <Image src="/header/united states.svg" alt="US" width={20} height={20} className="size-5" />
          <span>NY</span>
          <span className="text-white">13:23:51</span>
        </div>

        <button className="relative hidden lg:flex items-center justify-center p-2 rounded-lg border border-neutral-700 text-neutral-300 cursor-pointer hover:bg-neutral-800 transition-colors">
          <Bell className="size-5" />
          <span className="absolute -top-1 -right-1 size-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
            3
          </span>
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center justify-center gap-0 md:gap-2 px-3 py-0.5 rounded-lg border border-neutral-700 text-white outline-none">
            <div className="size-8 rounded-full flex items-center justify-center text-sm font-medium">
              <Image src="/header/at.svg" alt="avatar" width={20} height={20} className="size-5" />
            </div>
            <span className="text-sm">{userName}</span>
            <ChevronDown className="size-4 text-white" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuGroup>
              <DropdownMenuItem variant="destructive" className="cursor-pointer" onClick={handleSignOut}>
                <LogOutIcon className="h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
