"use client";

import * as React from "react";
import Link from "next/link";

import { BrandMark } from "@/components/brand-mark";
import { ProfileMenu } from "@/components/profile-menu";
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
        <ProfileMenu userLabel={userLabel} onSignOut={onSignOut} />
      </div>
    </div>
  );
}
