"use client";

import * as React from "react";
import Link from "next/link";
import { LogOutIcon } from "lucide-react";

import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import type { TopBarProps } from "@/types";

export function TopBar({ userLabel, onSignOut }: TopBarProps) {
  return (
    <div className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard" aria-label="Trade Mate home">
          <BrandMark />
        </Link>
        <Separator orientation="vertical" className="h-6 bg-gray-200" />
        <span className="hidden text-sm font-medium text-gray-500 sm:inline">
          Trading Terminal
        </span>
      </div>
      <div className="flex items-center gap-3">
        {userLabel ? (
          <span className="hidden text-sm text-gray-500 sm:inline">
            {userLabel}
          </span>
        ) : null}
        {onSignOut ? (
          <Button variant="outline" size="sm" onClick={onSignOut} className="gap-2 border-gray-200 text-[#1a1a1a] hover:bg-gray-50">
            <LogOutIcon className="size-4" />
            Sign out
          </Button>
        ) : null}
      </div>
    </div>
  );
}
