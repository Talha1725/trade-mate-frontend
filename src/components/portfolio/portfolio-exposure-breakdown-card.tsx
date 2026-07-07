"use client";

import Image from "next/image";

import { GradientHorizontalProgress } from "@/components/portfolio/gradient-horizontal-progress";
import {
  mockPortfolioExposureItems,
  PORTFOLIO_EXPOSURE_BACKGROUND_IMAGE,
} from "@/lib/mock-data/portfolio-exposure-breakdown";
import { cn } from "@/lib/utils";
import type {
  PortfolioExposureBreakdownCardProps,
  PortfolioExposureItem,
} from "@/types/portfolio-exposure-breakdown";

function ExposureIconBox({
  iconSrc,
  tone,
}: {
  iconSrc: string;
  tone: PortfolioExposureItem["iconTone"];
}) {
  return (
    <span
      className={cn(
        "relative flex size-8 shrink-0 items-center justify-center rounded-full!",
        tone === "green" && "btn-green",
        tone === "blue" && "btn-blue",
        tone === "orange" && "btn-orange",
      )}
    >
      <Image src={iconSrc} alt="" width={18} height={18} unoptimized />
    </span>
  );
}

function ExposureRow({ item }: { item: PortfolioExposureItem }) {
  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)_auto] lg:grid-cols-[auto_minmax(0,0.3fr)_minmax(0,1fr)_auto] items-center gap-3">
      <ExposureIconBox iconSrc={item.iconSrc} tone={item.iconTone} />
      <span
        className="min-w-0 truncate text-sm font-medium text-white"
        title={item.label}
      >
        {item.label}
      </span>
      <GradientHorizontalProgress
        value={item.percent}
        fill={item.fill}
        className="min-w-0"
      />
      <span className="w-10 text-right text-sm font-medium text-white">
        {item.percent}%
      </span>
    </div>
  );
}

export function PortfolioExposureBreakdownCard({
  title = "Exposure Breakdown",
  badgeLabel = "Long / Short",
  items = mockPortfolioExposureItems,
  backgroundImageSrc = PORTFOLIO_EXPOSURE_BACKGROUND_IMAGE,
  className,
}: PortfolioExposureBreakdownCardProps) {
  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-[20px] border border-white/20 bg-white/5 p-4 md:p-6",
        className,
      )}
    >
      <Image
        src={backgroundImageSrc}
        alt=""
        width={370}
        height={270}
        unoptimized
        className="pointer-events-none absolute right-0 bottom-0 h-auto max-w-[370px] object-contain opacity-70"
      />

      <div className="relative z-10 mb-5 flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-white md:text-lg">{title}</h3>
        <span className="text-sm text-white/60">{badgeLabel}</span>
      </div>

      <div className="relative z-10 space-y-5">
        {items.map((item) => (
          <ExposureRow key={item.id} item={item} />
        ))}
      </div>
    </article>
  );
}
