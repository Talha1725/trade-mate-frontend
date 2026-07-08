"use client";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { MdEdit } from "react-icons/md";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  mockAccountInformation,
  mockAccountInformationStats,
} from "@/lib/mock-data/account-information";
import { cn } from "@/lib/utils";
import type {
  AccountInformationCardProps,
  AccountInformationStat,
} from "@/types/account-information-card";

function AccountStatBox({ stat }: { stat: AccountInformationStat }) {
  return (
    <div className="rounded-[10px] border border-white/20 bg-linear-to-br from-white/7 to-white/5 px-3 py-3 md:px-3.5 md:py-2.5">
      <p className="text-xs font-medium text-white/50 md:text-sm">{stat.label}</p>
      <div className="mt-0.5 flex items-center gap-1.5 ">
        <p
          className={cn(
            "text-sm font-medium text-white",
            stat.valueTone === "positive" && "text-primary",
          )}
        >
          {stat.value}
        </p>
        {stat.showVerifiedIcon ? (
          <RiVerifiedBadgeFill  className="size-4 shrink-0 text-primary" />
        ) : null}
      </div>
    </div>
  );
}

export function AccountInformationCard({
  title = "Account Information",
  initials = mockAccountInformation.initials,
  fullName = mockAccountInformation.fullName,
  email = mockAccountInformation.email,
  memberSince = mockAccountInformation.memberSince,
  avatarUrl = null,
  stats = mockAccountInformationStats,
  editProfileLabel = "Edit Profile",
  onEditProfile,
  className,
}: AccountInformationCardProps) {
  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-[20px] border border-white/20 bg-linear-to-b from-white/7 to-white/3 p-4 md:p-6",
        className,
      )}
    >
      <h3 className="text-base font-semibold text-white md:text-lg">{title}</h3>
      <div className="mt-6 flex flex-col gap-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <Avatar className="size-19 shrink-0 md:size-[72px]">
              {avatarUrl ? <AvatarImage src={avatarUrl} alt={fullName} /> : null}
              <AvatarFallback className="bg-linear-to-br from-[#0CE9A0] to-[#3B82F6] text-2xl font-bold text-black md:text-3xl">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <p className="truncate text-base font-medium text-white md:text-lg">
                {fullName}
              </p>
              <a
                href={`mailto:${email}`}
                className="mt-0.5 block truncate text-sm text-white/60 underline underline-offset-2"
              >
                {email}
              </a>
              <p className="mt-1.5 text-xs text-white/50 md:text-sm">Member since <span className="text-white">{memberSince}</span></p>
            </div>
          </div>
          <button
            type="button"
            onClick={onEditProfile}
            className="inline-flex shrink-0 cursor-pointer items-center gap-2 self-start rounded-[10px] border border-white/5 bg-linear-to-b from-white/7 to-white/3 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            <MdEdit className="size-5" />
            {editProfileLabel}
          </button>
        </div>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          {stats.map((stat) => (
            <AccountStatBox key={stat.id} stat={stat} />
          ))}
        </div>
      </div>
    </article>
  );
}
