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
    <div className={cn("flex h-screen overflow-hidden bg-black text-white", className)}>
      {/* Sidebar */}
      <div className="hidden md:flex flex-col shrink-0 pl-2 pt-2 pb-2 h-full overflow-y-auto">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top strip — holds the profile menu and alignment elements */}
        <div className="flex h-14 shrink-0 items-center justify-end border-b border-neutral-800/60 bg-[#0C0C0E]/40 backdrop-blur-md px-6">
          {resolvedUserLabel ? (
            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-neutral-400 sm:inline">
                {resolvedUserLabel}
              </span>
              <ProfileMenu userLabel={resolvedUserLabel} onSignOut={handleSignOut} />
            </div>
          ) : null}
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 bg-black">
          {children}
        </main>
      </div>
    </div>
  );
}
