"use client";

import Image from "next/image";

import { ChallengeProgressDonut } from "@/components/analytics/challenge-progress-donut";
import {
  CHALLENGE_PROGRESS_BACKGROUND_IMAGE,
  CHALLENGE_PROGRESS_SHIELD_ICON,
  mockChallengeProgressStats,
} from "@/lib/mock-data/challenge-progress";
import { cn } from "@/lib/utils";
import type {
  ChallengeProgressCardProps,
  ChallengeProgressStatRow,
} from "@/types/challenge-progress-card";

function OnTrackBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-linear-to-b from-white/15 to-white/10 px-3 py-2 text-sm font-medium text-white">
      <span className="size-2 font-medium rounded-full bg-primary shadow-[0_0_8px_rgba(34,224,162,0.9)]" />
      {label}
    </span>
  );
}

function StatToneDot({ tone }: { tone: ChallengeProgressStatRow["tone"] }) {
  return (
    <span
      className={cn(
        "size-2.5 shrink-0 rounded-full",
        tone === "completed" && "bg-primary shadow-[0_0_10px_rgba(12,233,160,0.8)]",
        tone === "remaining" && "bg-white/30 shadow-[0_0_10px_rgba(255,255,255,0.25)]",
      )}
    />
  );
}

function StatRow({ row }: { row: ChallengeProgressStatRow }) {
  return (
    <div className="grid grid-cols-3 items-center gap-x-4 gap-y-1 text-sm">
      <div className="flex items-center gap-2">
      <StatToneDot tone={row.tone} />
      <span className="font-medium text-white">{row.label}</span>
      </div>
      
      <span className="text-center text-white/80">{row.valuePrimary}</span>
      <span className="text-right text-white">{row.valueSecondary}</span>
    </div>
  );
}

export function ChallengeProgressCard({
  title = "Challenge Progress",
  statusLabel = "On Track",
  progress = 72,
  progressLabel = "Progress",
  stats = mockChallengeProgressStats,
  message = "Stay consistent to maintain your evaluation progress.",
  backgroundImageSrc = CHALLENGE_PROGRESS_BACKGROUND_IMAGE,
  shieldIconSrc = CHALLENGE_PROGRESS_SHIELD_ICON,
  className,
}: ChallengeProgressCardProps) {
  return (
    <article
      className={cn(
        "relative flex h-full min-h-[320px] flex-col overflow-hidden rounded-[20px] border border-white/20 bg-white/5 p-4 md:p-6",
        className,
      )}
    >
      <Image
        src={backgroundImageSrc}
        alt=""
        width={420}
        height={280}
        unoptimized
        className="pointer-events-none absolute bottom-0 right-0 h-auto w-[72%] max-w-none object-contain opacity-90"
      />

      <div className="relative z-10 flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-white md:text-lg">{title}</h3>
        <OnTrackBadge label={statusLabel} />
      </div>

      <div className="relative z-10 mt-5 flex flex-1 flex-col gap-5 lg:flex-row lg:items-center">
        <div className="flex justify-center lg:justify-start">
          <ChallengeProgressDonut value={progress} label={progressLabel} />
        </div>

        <div className="flex flex-1 flex-col gap-4">
          <div className="rounded-[10px] border border-white/20 bg-linear-to-b from-[#13131505] to-white/6 p-4 backdrop-blur-[2px] md:p-5">
            <div className="space-y-4">
              {stats.map((row) => (
                <StatRow key={row.id} row={row} />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-[10px] border border-white/20 bg-linear-to-b from-[#13131505] to-white/6 p-5 backdrop-blur-[2px]">
            <Image
              src={shieldIconSrc}
              alt=""
              width={27}
              height={30}
              unoptimized
              className="shrink-0"
            />
            <p className="text-sm leading-relaxed text-white/60">{message}</p>
          </div>
        </div>
      </div>
    </article>
  );
}
