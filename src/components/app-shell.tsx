"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/sidebar";
import { ProfileMenu } from "@/components/profile-menu";
import { useAuthStore } from "@/lib/stores/auth-store";
import type { AppShellProps } from "@/types";

export function AppShell({
  userLabel,
  onSignOut,
  children,
  className,
}: AppShellProps) {
  const resolvedUserLabel = userLabel;
  const signOut = useAuthStore((state) => state.signOut);

  const handleSignOut = async () => {
    await signOut();

    if (onSignOut) {
      onSignOut();
      return;
    }

    window.location.href = "/logout";
  };

  return (
    <div className={cn("flex h-screen bg-black text-white", className)}>
      {/* Sidebar */}
      <div className="hidden md:flex flex-col shrink-0 h-full">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1">
        {/* Page content */}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 bg-black">
          {children}
        </main>
      </div>
    </div>
  );
}
