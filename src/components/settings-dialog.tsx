"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CheckCircle2, Eye, X } from "lucide-react";
import { RiEyeCloseLine } from "react-icons/ri";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { settingsApi } from "@/lib/services/settings.api";
import { useAuthStore } from "@/lib/stores/auth-store";
import type { SettingsDialogProps, SettingsProfile, SettingsViewProps } from "@/types/settings";

export function SettingsDialog({ view, onViewChange, profile }: SettingsDialogProps) {
  const isOpen = view !== null;

  const heightMap: Record<string, string> = {
    "edit-profile": "356px",
    "change-password": "auto",
    "email-verification": "auto",
    "billing-history": "auto",
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onViewChange(null)}>
      <DialogContent
        className="w-full max-w-[600px] sm:max-w-[600px] max-h-[90vh] overflow-y-auto custom-scrollbar gradient-dialog-bg border border-white/20 p-6 gap-0 shadow-2xl rounded-[20px] text-white min-h-auto!"
        style={{ minHeight: view ? heightMap[view] : "auto" }}
        showCloseButton={false}
      >
        <DialogClose
          render={
            <button className="absolute top-6 right-6 flex size-5 cursor-pointer items-center justify-center rounded-full bg-white text-black transition-opacity hover:opacity-90">
              <X className="size-3.5" />
              <span className="sr-only">Close</span>
            </button>
          }
        />

        {view === "edit-profile" && (
          <EditProfileView profile={profile} onClose={() => onViewChange(null)} />
        )}
        {view === "change-password" && <ChangePasswordView onClose={() => onViewChange(null)} />}
        {view === "email-verification" && (
          <EmailVerificationView profile={profile} onClose={() => onViewChange(null)} />
        )}
        {view === "billing-history" && <BillingHistoryView onClose={() => onViewChange(null)} />}
      </DialogContent>
    </Dialog>
  );
}

function EditProfileView({ onClose, profile }: SettingsViewProps) {
  const queryClient = useQueryClient();
  const [fullName, setFullName] = React.useState(profile?.fullName ?? "");
  const [email] = React.useState(profile?.email ?? "");
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(profile?.avatarUrl ?? null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    setFullName(profile?.fullName ?? "");
    setAvatarUrl(profile?.avatarUrl ?? null);
  }, [profile?.avatarUrl, profile?.fullName]);

  const initials =
    fullName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || (email.slice(0, 2).toUpperCase() ?? "TM");

  async function refreshProfile() {
    await useAuthStore.getState().loadSession();
    await queryClient.invalidateQueries({ queryKey: ["settings", "overview"] });
  }

  async function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) {
      return;
    }

    if (!/^image\/(png|jpe?g|webp)$/i.test(file.type)) {
      toast.error("Please upload a PNG, JPG, or WEBP image.");
      return;
    }

    setIsUploading(true);

    try {
      const presign = await settingsApi.createAvatarPresign({
        fileName: file.name,
        contentType: file.type,
      });

      const uploadResponse = await fetch(presign.uploadUrl, {
        method: presign.method,
        headers: presign.headers,
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload avatar to S3.");
      }

      const updated = await settingsApi.updateProfile({
        avatarUrl: presign.publicUrl,
      });

      setAvatarUrl(updated.user.avatarUrl ?? presign.publicUrl);
      await refreshProfile();
      toast.success("Profile image updated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to upload profile image.");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleSave() {
    const trimmedName = fullName.trim();

    if (!trimmedName) {
      toast.error("Full name is required.");
      return;
    }

    setIsSaving(true);

    try {
      await settingsApi.updateProfile({
        name: trimmedName,
      });

      await refreshProfile();
      toast.success("Profile updated.");
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update profile.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="flex flex-col">
      <DialogTitle className="mb-2 text-lg font-semibold text-white">Edit Profile</DialogTitle>

      <div className="mb-3.5 flex items-center gap-28">
        <label className="shrink-0 text-sm font-medium text-white/50">Profile Image</label>
        <div className="flex items-center gap-5">
          <Avatar size="xl">
            {avatarUrl ? <AvatarImage src={avatarUrl} alt={fullName || email || "Profile"} /> : null}
            <AvatarFallback className="overflow-hidden bg-[#2a2b35] text-black">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <div className="mb-1 text-sm font-medium text-white">Upload Image</div>
            <div className="mb-2 text-sm font-normal text-white/60">Min 400x400px, PNG or JPEG</div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              className="hidden"
              onChange={handleAvatarChange}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="gradient-btn-upload cursor-pointer rounded-[10px] border border-white/3 px-3.5 py-1.75 text-sm font-medium text-white transition-colors hover:bg-[#333] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isUploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>
      </div>

      <div className="mb-7 space-y-5">
        <div className="flex items-center gap-33">
          <label className="shrink-0 text-sm font-medium text-white/50">Full Name</label>
          <div className="flex-1 rounded-[10px] border border-white/20 gradient-btn-bar px-3 py-1.75">
            <input
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="w-full bg-transparent text-sm font-medium text-white outline-none"
            />
          </div>
        </div>
        <div className="flex items-center gap-40">
          <label className="shrink-0 text-sm font-medium text-white/50">Email</label>
          <div className="flex-1 rounded-[10px] border border-white/20 gradient-btn-bar px-3 py-1.75 opacity-75">
            <input
              type="email"
              value={email}
              readOnly
              className="w-full bg-transparent text-sm font-medium text-white outline-none"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        <button
          onClick={onClose}
          className="gradient-btn-cancel flex-1 cursor-pointer rounded-[10px] border border-white/20 py-2.25 text-sm font-medium text-white transition-colors hover:bg-white/10"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="trade-btn flex-1 cursor-pointer rounded-[10px] py-2.25 text-base font-medium text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

function ChangePasswordView({ onClose }: SettingsViewProps) {
  const router = useRouter();
  const [showCurrent, setShowCurrent] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const signOut = useAuthStore((state) => state.signOut);

  async function handleSubmit() {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please complete all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await settingsApi.updatePassword({
        currentPassword,
        newPassword,
      });
      toast.success("Password updated. Please sign in again.");
      onClose();
      await signOut();
      router.replace("/login");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update password.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col">
      <DialogTitle className="mb-6.5 text-base font-semibold text-white">Change Password</DialogTitle>

      <div className="mb-6.5 space-y-4">
        <div className="flex items-center gap-27">
          <label className="shrink-0 text-sm font-medium text-white/50">Current Password</label>
          <div className="flex flex-1 items-center justify-between rounded-[10px] border border-white/20 bg-linear-to-b from-[#6E6E6E1A] to-[#13131505] px-3 py-1.5">
            <input
              type={showCurrent ? "text" : "password"}
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              className="w-full bg-transparent text-sm font-medium text-white outline-none"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="hover:opacity-80 -mr-1 cursor-pointer p-1 transition-opacity"
            >
              {showCurrent ? (
                <RiEyeCloseLine className="size-4 shrink-0 text-white" />
              ) : (
                <Eye className="size-4 shrink-0 text-white/50" />
              )}
            </button>
          </div>
        </div>
        <div className="flex items-center gap-32">
          <label className="shrink-0 text-sm font-medium text-white/50">New Password</label>
          <div className="flex flex-1 items-center justify-between rounded-[10px] border border-white/20 bg-linear-to-b from-[#6E6E6E1A] to-white/3 px-3 py-1.5">
            <input
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className="w-full bg-transparent text-sm font-medium text-white outline-none"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="hover:opacity-80 -mr-1 cursor-pointer p-1 transition-opacity"
            >
              {showNew ? (
                <RiEyeCloseLine className="size-4 shrink-0 text-white" />
              ) : (
                <Eye className="size-4 shrink-0 text-white/50" />
              )}
            </button>
          </div>
        </div>
        <div className="flex items-center gap-18">
          <label className="shrink-0 text-sm font-medium text-white/50">Confirm New Password</label>
          <div className="flex flex-1 items-center justify-between rounded-[10px] border border-white/20 bg-linear-to-b from-[#6E6E6E1A] to-white/3 px-3 py-1.5">
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="w-full bg-transparent text-sm font-medium text-white outline-none"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="hover:opacity-80 -mr-1 cursor-pointer p-1 transition-opacity"
            >
              {showConfirm ? (
                <RiEyeCloseLine className="size-4 shrink-0 text-white" />
              ) : (
                <Eye className="size-4 shrink-0 text-white/50" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        <button
          onClick={onClose}
          className="gradient-btn-cancel flex-1 cursor-pointer rounded-[10px] border border-white/20 py-2.25 text-sm font-medium text-white transition-colors hover:bg-white/10"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="trade-btn flex-1 cursor-pointer rounded-[10px] py-2.25 text-base font-medium text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Updating..." : "Update Password"}
        </button>
      </div>
    </div>
  );
}

function EmailVerificationView({ onClose, profile }: SettingsViewProps) {
  return (
    <div className="flex flex-col">
      <DialogTitle className="mb-7 text-lg font-semibold text-white">Email Verification</DialogTitle>

      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-white/50">Email Address</span>
          <span className="text-sm font-medium text-white">{profile?.email ?? "—"}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-white/50">Status</span>
          <div className="flex items-center gap-1.5 text-[#0CE9A0]">
            <span className="text-sm font-medium">Verified</span>
            <CheckCircle2 className="size-4" />
          </div>
        </div>
        <div className="flex items-start justify-between gap-4">
          <p className="max-w-[350px] text-sm font-normal text-white/50">
            Your email is verified. You will receive important account notifications.
          </p>
          <button
            type="button"
            onClick={() => toast.info("Email verification settings are not editable yet.")}
            className="shrink-0 rounded-[10px] border border-destructive/8 bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/20"
          >
            Disable
          </button>
        </div>
      </div>

      <div className="mt-8 flex gap-6">
        <button
          onClick={onClose}
          className="gradient-btn-cancel flex-1 cursor-pointer rounded-[10px] border border-white/20 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function BillingHistoryView({ onClose }: SettingsViewProps) {
  const history = [
    { date: "Jun 28, 2025", type: "Free Account", amount: "$0.00" },
    { date: "May 28, 2025", type: "Free Account", amount: "$0.00" },
    { date: "Apr 28, 2025", type: "Free Account", amount: "$0.00" },
  ];

  return (
    <div className="flex flex-col">
      <DialogTitle className="mb-6 text-lg font-semibold leading-4.5 text-white">Billing History</DialogTitle>

      <div className="mb-6 space-y-4">
        {history.map((item, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <Image src="/calendar.svg" alt="Calendar" width={32} height={32} className="size-8" />
              </div>
              <div>
                <div className="mb-0.5 text-sm font-medium leading-3.5 text-white">{item.date}</div>
                <div className="text-xs font-normal leading-3 text-white/50">{item.type}</div>
              </div>
            </div>
            <div className="text-lg font-medium text-white">{item.amount}</div>
          </div>
        ))}
      </div>

      <div className="mb-8 text-center text-sm font-normal leading-3.5 text-white/50">
        No more data available
      </div>

      <div className="flex gap-6">
        <button
          onClick={onClose}
          className="gradient-btn-cancel flex-1 cursor-pointer rounded-[10px] border border-white/20 py-3 text-sm font-medium text-white transition-colors hover:bg-[#333]"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => toast.info("Billing changes are not enabled for free accounts.")}
          className="trade-btn flex-1 cursor-pointer rounded-[10px] py-3 text-base font-semibold text-white"
        >
          Manage Billing
        </button>
      </div>
    </div>
  );
}
