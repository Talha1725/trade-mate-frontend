"use client";

import * as React from "react";
import { useState } from "react";
import { PanelLeftCloseIcon, PanelLeftOpenIcon, LogOutIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PRIMARY_NAV_ICON_MAP } from "@/constant/nav-config.tsx";
import type { AppShellProps } from "@/types";

function SidebarNav({
  items,
  collapsed,
  userLabel,
  onSignOut,
}: {
  items: AppShellProps["navItems"];
  collapsed: boolean;
  userLabel?: string;
  onSignOut?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      {/* Brand header — same height as the toggle bar in main */}
      <div className={cn(
        "flex items-center h-14 shrink-0 border-b border-gray-100 px-3",
        collapsed ? "justify-center" : "justify-start"
      )}>
        {collapsed ? (
          <Link
            href="/dashboard"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-bold"
          >
            TM
          </Link>
        ) : (
          <Link href="/dashboard" className="flex items-center gap-2 min-w-0">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-bold">
              TM
            </div>
            <span className="truncate font-semibold text-sm text-foreground">Trade Mate</span>
          </Link>
        )}
      </div>

      {/* Nav items */}
      <nav aria-label="Primary" className="flex flex-col gap-1 px-2 py-3 flex-1">
        {items.map((item) => {
          const Icon = PRIMARY_NAV_ICON_MAP[item.id];
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.id}
              href={item.disabled ? "#" : item.href}
              aria-disabled={item.disabled}
              tabIndex={item.disabled ? -1 : 0}
              title={collapsed ? item.label : undefined}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                item.disabled && "pointer-events-none opacity-50",
              )}
            >
              {Icon && (
                <Icon className={cn(
                  "size-4 shrink-0",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                )} />
              )}
              <span className={cn(
                "truncate font-medium transition-all duration-300 ease-in-out",
                collapsed ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom: user label */}
      {userLabel && (
        <div className={cn(
          "border-t border-gray-100 p-3 shrink-0",
          collapsed ? "flex justify-center" : "flex items-center justify-between gap-2"
        )}>
          {!collapsed && (
            <span className="truncate text-xs text-muted-foreground">{userLabel}</span>
          )}
          {onSignOut && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onSignOut}
              title="Sign out"
              className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
            >
              <LogOutIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export function AppShell({
  navItems,
  userLabel,
  onSignOut,
  children,
  className,
}: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={cn("flex h-screen bg-[#fafafa] font-sans text-[#1a1a1a] overflow-hidden", className)}>
      {/* Sidebar */}
      <aside className={cn(
        "hidden md:flex flex-col shrink-0 border-r border-gray-200 bg-white transition-all duration-300 ease-in-out overflow-hidden",
        collapsed ? "w-[56px]" : "w-64"
      )}>
        <SidebarNav
          items={navItems}
          collapsed={collapsed}
          userLabel={userLabel}
          onSignOut={onSignOut}
        />
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top strip — holds the collapse toggle, aligned with sidebar brand header */}
        <div className="flex h-14 shrink-0 items-center border-b border-gray-200 bg-white px-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed((v) => !v)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            {collapsed
              ? <PanelLeftOpenIcon className="h-4 w-4" />
              : <PanelLeftCloseIcon className="h-4 w-4" />
            }
          </Button>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
