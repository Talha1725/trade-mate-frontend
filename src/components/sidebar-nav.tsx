"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import type { NavItem as NavItemType, SidebarNavProps } from "@/types";

export function SidebarNav({ items, iconFor, className }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className={cn("flex flex-col gap-1 p-3", className)}
    >
      {items.map((item) => {
        const Icon = iconFor?.(item);
        const isActive =
          pathname === item.href ||
          (item.href !== "/" && pathname?.startsWith(item.href));

        return (
          <Link
            key={item.id}
            href={item.disabled ? "#" : item.href}
            aria-disabled={item.disabled}
            tabIndex={item.disabled ? -1 : 0}
            className={cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
              item.disabled && "pointer-events-none opacity-50",
            )}
          >
            {Icon ? (
              <Icon
                className={cn(
                  "size-4",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                )}
              />
            ) : null}
            <div className="min-w-0">
              <div className="truncate font-medium">{item.label}</div>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
