import * as React from "react";

import { SidebarNav } from "@/components/sidebar-nav";
import { TopBar } from "@/components/top-bar";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types";

type AppShellProps = {
  navItems: NavItem[];
  userLabel?: string;
  onSignOut?: () => void;
  children: React.ReactNode;
  className?: string;
};

export function AppShell({
  navItems,
  userLabel,
  onSignOut,
  children,
  className,
}: AppShellProps) {
  return (
    <div className={cn("flex min-h-screen flex-col bg-[#fafafa] font-sans text-[#1a1a1a]", className)}>
      <TopBar userLabel={userLabel} onSignOut={onSignOut} />
      <div className="flex flex-1">
        <aside className="hidden w-64 shrink-0 border-r border-gray-200 bg-white md:block">
          <SidebarNav items={navItems} />
        </aside>
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
