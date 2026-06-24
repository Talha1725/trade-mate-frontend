"use client";

import { useId } from "react";

import { CHALLENGE_PROGRESS_DONUT_INSET_SHADOW } from "@/lib/mock-data/challenge-progress";
import { cn } from "@/lib/utils";
import type { ChallengeProgressDonutProps } from "@/types/challenge-progress-card";

function buildRingMask(size: number, strokeWidth: number) {
  const innerRadius = size / 2 - strokeWidth;

  return `radial-gradient(circle, transparent ${innerRadius}px, #000 ${innerRadius + 0.5}px)`;
}

export function ChallengeProgressDonut({
  value,
  label = "Progress",
  className,
  size = 220,
}: ChallengeProgressDonutProps) {
  const gradientId = useId().replace(/:/g, "");
  const clampedValue = Math.min(100, Math.max(0, value));
  const strokeWidth = 40;
  const center = size / 2;
  const radius = center - strokeWidth / 2 - 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (clampedValue / 100) * circumference;
  const ringMask = buildRingMask(size, strokeWidth);

  return (
    <div
      className={cn("relative shrink-0", className)}
      style={{ width: size, height: size }}
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: "rgba(255,255,255,0.12)",
          boxShadow: CHALLENGE_PROGRESS_DONUT_INSET_SHADOW,
          WebkitMaskImage: ringMask,
          maskImage: ringMask,
        }}
      />

      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0 h-full w-full -rotate-90"
        aria-hidden
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0CE9A0" />
            <stop offset="100%" stopColor="#108961" />
          </linearGradient>
        </defs>

        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-semibold tracking-tight text-white md:text-[32px]">
          {Math.round(clampedValue)}%
        </span>
        <span className="mt-1 text-sm text-white/60">{label}</span>
      </div>
    </div>
  );
}
