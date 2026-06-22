"use client";

import { LogOutIcon } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ProfileMenuProps } from "@/types";

function getInitials(userLabel?: string) {
  if (!userLabel) {
    return "TM";
  }

  return userLabel
    .split("@")[0]
    .split(/[.\s_-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function ProfileMenu({ userLabel, onSignOut }: ProfileMenuProps) {
  const handleSignOut = () => {
    if (onSignOut) {
      onSignOut();
      return;
    }

    window.location.href = "/logout";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Open profile menu"
        className="flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm outline-none transition-all hover:border-slate-300 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Avatar>
          <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
            {getInitials(userLabel)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleSignOut} variant="destructive" className="cursor-pointer">
            <LogOutIcon className="h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
