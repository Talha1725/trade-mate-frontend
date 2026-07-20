"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronDown, DownloadIcon, LaptopIcon, LogOutIcon, MonitorIcon } from "lucide-react";
import { toast } from "sonner";

import { AccountSwitcherDropdown } from "@/components/account-switcher-dropdown";
import { SymbolSelector } from "@/components/symbol-selector";
import { HeaderNotificationsDropdown } from "@/components/header-notifications-dropdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

const DESKTOP_DOWNLOAD_LINKS = [
  {
    label: "Download for Mac",
    description: "ZIP with app and instructions",
    href: "/downloads/TradeMate-mac-v1.0.0.zip",
    icon: LaptopIcon,
  },
  {
    label: "Download for Windows",
    description: "ZIP with setup and instructions",
    href: "/downloads/TradeMate-windows-v1.0.0.zip",
    icon: MonitorIcon,
  },
] as const;

function getUserInitials(userLabel?: string | null) {
  if (!userLabel) {
    return "TM";
  }

  const initials = userLabel
    .trim()
    .split(/[.\s_-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return initials || "TM";
}

export function PageHeader({
  className,
}: PageHeaderProps) {
  const router = useRouter();
  const signOut = useAuthStore((state) => state.signOut);
  const user = useAuthStore((state) => state.session?.user);
  const userName = user?.name || user?.email || "Trader";
  const avatarUrl = user?.avatarUrl ?? null;
  const userInitials = getUserInitials(userName);

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
      {/* Global symbol selector — one shared selection across the whole app */}
      <div className="w-full min-w-0 lg:w-auto">
        <SymbolSelector className="w-full lg:w-[220px]" />
      </div>

      {/* Actions — 2-col grid on mobile/tablet, flex row on desktop */}
      <div className="grid grid-cols-2 gap-2 lg:flex lg:items-center lg:gap-3">
        <PlaceOrderDialog>
          <button className="flex gap-2 cursor-pointer hover:opacity-80 duration-300 items-center justify-center trade-btn px-4 py-[9px] rounded-lg btn-new-trade text-white text-sm font-medium whitespace-nowrap">
            <Image src="/header/add circle.svg" alt="add" width={18} height={18} className=" shrink-0" />
            New Trade
          </button>
        </PlaceOrderDialog>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-border/20 px-4 py-[9px] text-sm font-medium text-white outline-none transition-colors hover:bg-white/5 whitespace-nowrap">
            <DownloadIcon className="size-4" />
            <span>Desktop App</span>
            <ChevronDown className="size-4 text-white/70" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              {DESKTOP_DOWNLOAD_LINKS.map((item) => {
                const Icon = item.icon;

                return (
                  <DropdownMenuItem
                    key={item.label}
                    className="cursor-pointer gap-3 px-3 py-2.5"
                    onClick={() => window.location.assign(item.href)}
                  >
                    <Icon className="size-4 text-primary" />
                    <span className="flex min-w-0 flex-col">
                      <span className="truncate text-sm font-medium">{item.label}</span>
                      <span className="truncate text-xs text-white/50">{item.description}</span>
                    </span>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-border/20 text-medium-500 text-sm">
          <span className="size-2.5 animate-pulse rounded-full bg-primary shadow-[0_0_10px_var(--primary)]" />
          Live Market
        </button> */}
        {/* Account Switcher Dropdown */}
        <AccountSwitcherDropdown />

        {/* <HeaderNotificationsDropdown
          onNotificationClick={() =>
            toast.info("Notification details are not available yet.")
          }
        /> */}

        <DropdownMenu>
          <DropdownMenuTrigger className="flex cursor-pointer items-center justify-center gap-0 md:gap-2 px-3 py-0.5 rounded-lg border border-border/20 text-white outline-none">
            <Avatar className="size-8">
              {avatarUrl ? (
                <AvatarImage src={avatarUrl} alt={userName} />
              ) : null}
              <AvatarFallback className="bg-linear-to-br from-[#0CE9A0] to-[#3B82F6] text-[11px] font-bold text-black">
                {userInitials}
              </AvatarFallback>
            </Avatar>
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
