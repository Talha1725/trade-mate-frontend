"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { settingsApi } from "@/lib/services/settings.api";
import { useAuthStore } from "@/lib/stores/auth-store";
import { Spinner } from "@/components/ui/spinner";
import type { SecurityOverviewCardProps } from "@/types/security-overview-card";

export function SecurityOverviewCard({
  className,
}: SecurityOverviewCardProps) {
  const router = useRouter();
  const signOut = useAuthStore((state) => state.signOut);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please complete all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsSubmitting(true);

    try {
      await settingsApi.updatePassword({
        currentPassword,
        newPassword,
      });

      toast.success("Password changed successfully. Please sign in again.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      await signOut();
      router.replace("/login");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-[20px] border border-white/20 bg-linear-to-b from-white/7 to-white/3 p-4 md:p-6",
        className,
      )}
    >
      <h3 className="text-base font-semibold text-white md:text-lg">Change Password</h3>
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4 max-w-md">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-white/50">Current Password</label>
          <div className="relative">
            <input 
              type={showCurrent ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 pr-10 text-sm text-white outline-none focus:border-primary" 
              required
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              {showCurrent ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-white/50">New Password</label>
          <div className="relative">
            <input 
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 pr-10 text-sm text-white outline-none focus:border-primary" 
              required
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-white/50">Confirm Password</label>
          <div className="relative">
            <input 
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 pr-10 text-sm text-white outline-none focus:border-primary" 
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 inline-flex w-fit cursor-pointer items-center rounded-xl btn-green px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <Spinner className="mr-2 size-4" />
              Changing...
            </>
          ) : (
            "Change Password"
          )}
        </button>
      </form>
    </article>
  );
}
