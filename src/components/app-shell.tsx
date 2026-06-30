"use client";

import * as React from "react";
import Image from "next/image";
import { Menu, Bell, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/sidebar";
import { useAuthStore } from "@/lib/stores/auth-store";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import type { AppShellProps } from "@/types";

export function AppShell({
  userLabel,
  onSignOut,
  children,
  className,
}: AppShellProps) {
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
    <div className={cn("flex min-h-screen bg-black text-white", className)}>
      {/* Desktop Sidebar — lg and above */}
      <div className="hidden lg:block shrink-0">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Mobile/Tablet Top Bar — below lg */}
        <div className="flex lg:hidden items-center justify-between px-4 py-3 border-b border-neutral-800 shrink-0">
          {/* Logo */}
          <Image src="/images/logo.svg" alt="Trade Mate" height={32} width={160} loading="eager" />

          {/* Right: Notification + Hamburger */}
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg border border-neutral-700 text-neutral-300 hover:bg-neutral-800 transition-colors">
              <Bell className="size-5" />
              <span className="absolute -top-1 -right-1 size-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                3
              </span>
            </button>
            <Drawer direction="left">
              <DrawerTrigger asChild>
                <button className="p-2 rounded-lg border border-neutral-700 text-neutral-300 hover:bg-neutral-800 transition-colors">
                  <Menu className="size-5" />
                </button>
              </DrawerTrigger>
              <DrawerContent
                className=" bg-[#0d0d0d] p-0 flex flex-col"
                style={{ width: "100%" }}
              >
                {/* Scrollable inner content */}
                <div className="relative h-full">
                  {/* Close button — absolutely positioned inline with the logo */}
                  <DrawerClose asChild>
                    <button className="absolute top-4 right-4 z-10 p-2 rounded-lg border border-neutral-700 text-neutral-300 hover:bg-neutral-800 transition-colors">
                      <X className="size-5" />
                    </button>
                  </DrawerClose>
                  <Sidebar className="w-full border-0 rounded-none h-full" />
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>


        {/* Page content */}
        <main className="min-h-0 flex-1 bg-black px-4 py-6 md:px-6">
          {children}
        </main>
      </div>
    </div>
  );
}

