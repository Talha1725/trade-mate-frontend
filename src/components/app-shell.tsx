"use client";

import * as React from "react";
import { useState } from "react";
import { PanelLeftCloseIcon, PanelLeftOpenIcon, ChevronDownIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ProfileMenu } from "@/components/profile-menu";
import { PRIMARY_NAV_ICON_MAP } from "@/constant/nav-config";
import { useAuthStore } from "@/lib/stores/auth-store";
import type { AppShellProps, AppShellSidebarNavProps } from "@/types";

function matchesPath(pathname: string | null, href: string) {
  if (!pathname) {
    return false;
  }

  if (href === "/") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function SidebarNav({
  items,
  collapsed,
}: AppShellSidebarNavProps) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    admin: true,
  });

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

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
          const isChildActive = item.subItems?.some((sub) => sub.href ? matchesPath(pathname, sub.href) : false) ?? false;
          const isActive = item.subItems
            ? Boolean(item.href && matchesPath(pathname, item.href)) || isChildActive
            : Boolean(item.href && pathname === item.href);

          if (item.subItems) {
            const isExpanded = expanded[item.id];
            return (
              <div key={item.id} className="flex flex-col gap-1">
                <button
                  onClick={() => toggleExpand(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    "group flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors cursor-pointer outline-none",
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    item.disabled && "pointer-events-none opacity-50",
                  )}
                >
                  <div className="flex items-center gap-3">
                    {Icon && (
                      <Icon className={cn(
                        "size-4 shrink-0",
                        isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                      )} />
                    )}
                    <span className={cn(
                      "truncate transition-all duration-300 ease-in-out",
                      collapsed ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"
                    )}>
                      {item.label}
                    </span>
                  </div>
                  {!collapsed && (
                    <ChevronDownIcon className={cn(
                      "size-4 shrink-0 transition-transform duration-200 text-muted-foreground group-hover:text-foreground",
                      isExpanded ? "rotate-180" : ""
                    )} />
                  )}
                </button>
                
                {!collapsed && isExpanded && (
                  <div className="flex flex-col gap-1 pl-9 pr-2 py-1">
                    {item.subItems.map((subItem) => {
                      const isSubActive = subItem.href ? matchesPath(pathname, subItem.href) : false;
                      return (
                        <Link
                          key={subItem.id}
                          href={subItem.href || "#"}
                          className={cn(
                            "block rounded-md px-3 py-1.5 text-sm transition-colors",
                            isSubActive 
                              ? "bg-primary/10 text-primary font-medium" 
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                        >
                          {subItem.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.id}
              href={item.disabled || !item.href ? "#" : item.href}
              aria-disabled={item.disabled}
              tabIndex={item.disabled ? -1 : 0}
              title={collapsed ? item.label : undefined}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-primary/10 text-primary font-medium"
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
                "truncate transition-all duration-300 ease-in-out",
                collapsed ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
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
  const resolvedUserLabel = userLabel;
  const signOut = useAuthStore((state) => state.signOut);

  const handleSignOut = async () => {
    await signOut();

    if (onSignOut) {
      onSignOut();
      return;
    }

    window.location.href = "/login";
  };

  return (
    <div className={cn("flex h-screen  overflow-hidden", className)}>
      {/* Sidebar */}
      <aside className={cn(
        "hidden md:flex flex-col shrink-0 border-r border-gray-200  transition-all duration-300 ease-in-out overflow-hidden",
        collapsed ? "w-[56px]" : "w-64"
      )}>
        <SidebarNav
          items={navItems}
          collapsed={collapsed}
        />
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top strip — holds the collapse toggle, aligned with sidebar brand header */}
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-gray-200 px-3">
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
          {resolvedUserLabel ? (
            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-muted-foreground sm:inline">
                {resolvedUserLabel}
              </span>
              <ProfileMenu userLabel={resolvedUserLabel} onSignOut={handleSignOut} />
            </div>
          ) : null}
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
