import * as React from "react";

import { cn } from "@/lib/utils";

import type { PageHeaderProps } from "@/types";

export function PageHeader({
  title,
  description,
  icon: Icon,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-3 border-b border-gray-200 pb-6 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        {Icon ? (
          <span className="mt-0.5 grid size-10 place-items-center rounded-xl bg-[#eff3f8] text-gray-500">
            <Icon className="size-5" />
          </span>
        ) : null}
        <div className="space-y-1">
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-[#1a1a1a] sm:text-3xl">
            {title}
          </h1>
          {description ? (
            <p className="max-w-2xl text-sm text-gray-500">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}
