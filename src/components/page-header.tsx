import * as React from "react";
import Image from "next/image";
import { Search, Bell, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

import type { PageHeaderProps } from "@/types";

export function PageHeader({
  title,
  description,
  icon: Icon,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "flex items-center justify-between py-4 border-b border-neutral-800",
        className,
      )}
    >
      {/* Center: Search Bar */}
      <div className="flex-1 max-w-[520px]">
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-700">
          <Search className="size-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent text-sm text-white placeholder-neutral-500 outline-none w-full"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        <button className="flex gap-2 item-center justify-center trade-btn px-4 py-2 rounded-lg btn-new-trade text-white text-base font-medium">
          <Image src="/header/add circle.svg" alt="add" width={18} height={18} className="size-5" item-center="true"/>
          New Trade
        </button>

        <button className="flex items-center gap-2 px-4 py-2.25 rounded-full border border-neutral-700 text-medium-500 text-sm">
          <span className="size-2.5 animate-pulse rounded-full bg-primary shadow-[0_0_10px_var(--primary)]" />
          Live Market
        </button>

        <div className="flex items-center gap-2 px-3 py-2.25 rounded-full border leading-3.5 border-neutral-700 text-medium-500 text-sm">
          <Image src="/header/united states.svg" alt="US" width={20} height={20} className="size-5" />
          <span>NY</span>
          <span className="text-white-500">13:23:51</span>
        </div>

        <button className="relative p-2 rounded-lg border border-neutral-700 text-neutral-300 cursor-pointer hover:bg-neutral-800 transition-colors">
          <Bell className="size-5" />
          <span className="absolute -top-1 -right-1 size-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
            3
          </span>
        </button>

        <button className="flex items-center gap-2 px-3 py-1 rounded-lg leading-2 border border-neutral-700 text-white-500 ">
          <div className="size-8 rounded-full flex items-center justify-center text-sm font-medium">
            <Image src="/header/at.svg" alt="avatar" width={20} height={20} className="size-5" />
          </div>
          <span className="text-sm">Alex Travis</span>
          <ChevronDown className="size-4 text-white-500" />
        </button>
      </div>
    </header>
  );
}
