"use client";

import * as React from "react";
import Image from "next/image";
import { X, Calendar, CheckCircle2, Eye, EyeOff, ChevronDown } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SettingsDialogView, SettingsDialogProps, SettingsViewProps } from "@/types/settings";
import { cn } from "@/lib/utils";

export function SettingsDialog({ view, onViewChange }: SettingsDialogProps) {
  const isOpen = view !== null;

  const heightMap: Record<string, string> = {
    "edit-profile": "356px",
    "change-password": "auto",
    "email-verification": "auto",
    "billing-history": "342px",
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onViewChange(null)}>
      <DialogContent
        className="w-full max-w-[600px] sm:max-w-[600px] max-h-[90vh] overflow-y-auto custom-scrollbar gradient-dialog-bg border border-white/20 p-6 gap-0 shadow-2xl rounded-[16px] text-white"
        style={{ minHeight: view ? heightMap[view] : "auto" }}
        showCloseButton={false}
      >
        {/* Absolute Close Button */}
        <DialogClose
          render={
            <button className="absolute top-6 right-6 size-6 rounded-full bg-white hover:opacity-90 transition-opacity text-black flex items-center justify-center cursor-pointer">
              <X className="size-3.5" />
              <span className="sr-only">Close</span>
            </button>
          }
        />

        {view === "edit-profile" && <EditProfileView onClose={() => onViewChange(null)} />}
        {view === "change-password" && <ChangePasswordView onClose={() => onViewChange(null)} />}
        {view === "email-verification" && <EmailVerificationView onClose={() => onViewChange(null)} />}
        {view === "billing-history" && <BillingHistoryView onClose={() => onViewChange(null)} />}
      </DialogContent>
    </Dialog>
  );
}

function EditProfileView({ onClose }: SettingsViewProps) {
  return (
    <div className="flex flex-col">
      <DialogTitle className="text-lg font-semibold text-white mb-2">Edit Profile</DialogTitle>

      <div className="flex items-center mb-3.5 gap-28">
        <label className="text-sm font-medium text-white/50 shrink-0">Profile Image</label>
        <div className="flex items-center gap-5">
          <Avatar size="xl">
            <AvatarFallback className="bg-[#2a2b35] overflow-hidden">
              <Image src="/profile icon.svg" alt="Profile" width={64} height={64} className="size-full object-cover" />
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="text-sm font-medium text-white mb-1">Upload Image</div>
            <div className="text-sm font-normal text-white/60 text-white mb-2">Min 400x400px, PNG or JPEG</div>
            <button className="text-sm font-medium text-white px-3.5 py-1.75 rounded-[10px] gradient-btn-upload border border-white/3 hover:bg-[#333] transition-colors">
              Upload
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-7">
        <div className="flex items-center gap-33">
          <label className="text-sm font-medium text-white/50 shrink-0">Full Name</label>
          <div className="flex-1 rounded-[10px] gradient-btn-bar border border-white/20 px-3 py-1.75">
            <input
              type="text"
              defaultValue="Alex Travis"
              className="w-full bg-transparent text-sm font-medium text-white  outline-none"
            />
          </div>
        </div>
        <div className="flex items-center gap-40">
          <label className="text-sm font-medium text-white/50 shrink-0">Email</label>
          <div className="flex-1 rounded-[10px] gradient-btn-bar border border-white/20 px-3 py-1.75">
            <input
              type="email"
              defaultValue="alex.travis@gmail.com"
              className="w-full bg-transparent text-sm font-medium text-white outline-none"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        <button
          onClick={onClose}
          className="flex-1 rounded-[10px] py-2.25 text-sm font-medium text-white gradient-btn-cancel border border-white/20 transition-colors"
        >
          Cancel
        </button>
        <button className="flex-1 rounded-[10px] py-2.25 text-base font-medium text-white trade-btn">
          Save Changes
        </button>
      </div>
    </div>
  );
}

function ChangePasswordView({ onClose }: SettingsViewProps) {
  const [showCurrent, setShowCurrent] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  return (
    <div className="flex flex-col">
      <DialogTitle className="text-base font-bold text-white mb-4.75">Change Password</DialogTitle>

      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-8">
          <label className="text-sm font-medium text-white/50 w-[176px] shrink-0">Current Password</label>
          <div className="flex-1 rounded-[10px] border border-[#222] bg-[#141414] px-3 py-1.5 flex items-center justify-between">
            <input
              type={showCurrent ? "text" : "password"}
              defaultValue="dW3z5hgUi!&^"
              className="w-full bg-transparent text-sm font-medium text-white outline-none"
            />
            <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="p-1 -mr-1 hover:opacity-80 transition-opacity">
              {showCurrent ? <EyeOff className="size-4 text-white/50 shrink-0" /> : <Eye className="size-4 text-white/50 shrink-0" />}
            </button>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <label className="text-sm font-medium text-white/50 w-[176px] shrink-0">New Password</label>
          <div className="flex-1 rounded-[10px] border border-[#222] bg-[#141414] px-3 py-1.5 flex items-center justify-between">
            <input
              type={showNew ? "text" : "password"}
              defaultValue=".........."
              className="w-full bg-transparent text-sm font-medium text-white outline-none"
            />
            <button type="button" onClick={() => setShowNew(!showNew)} className="p-1 -mr-1 hover:opacity-80 transition-opacity">
              {showNew ? <EyeOff className="size-4 text-white/50 shrink-0" /> : <Eye className="size-4 text-white/50 shrink-0" />}
            </button>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <label className="text-sm font-medium text-white/50 w-[176px] shrink-0">Confirm New Password</label>
          <div className="flex-1 rounded-[10px] border border-[#222] bg-[#141414] px-3 py-1.5 flex items-center justify-between">
            <input
              type={showConfirm ? "text" : "password"}
              defaultValue=".........."
              className="w-full bg-transparent text-sm font-medium text-white outline-none"
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="p-1 -mr-1 hover:opacity-80 transition-opacity">
              {showConfirm ? <EyeOff className="size-4 text-white/50 shrink-0" /> : <Eye className="size-4 text-white/50 shrink-0" />}
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        <button
          onClick={onClose}
          className="flex-1 rounded-[10px] py-3 text-sm font-semibold text-white-500 border border-white/20 transition-colors"
        >
          Cancel
        </button>
        <button className="flex-1 rounded-[10px] py-3 text-base font-semibold text-white-500 trade-btn">
          Update Password
        </button>
      </div>
    </div>
  );
}

function EmailVerificationView({ onClose }: SettingsViewProps) {
  return (
    <div className="flex flex-col">
      <DialogTitle className="text-base font-bold text-white mb-6">Email Verification</DialogTitle>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/50">Email Address</span>
          <span className="text-sm text-white font-medium">alex.travis@gmail.com</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/50">Status</span>
          <div className="flex items-center gap-1.5 text-[#0CE9A0]">
            <span className="text-sm font-medium">Verified</span>
            <CheckCircle2 className="size-4" />
          </div>
        </div>
        <div className="flex items-start justify-between gap-4">
          <p className="text-sm text-white/50 leading-relaxed max-w-[250px]">
            Your email is verified. You will receive important account notifications.
          </p>
          <button className="text-sm font-medium text-red-500 bg-[#251212] px-4 py-2 rounded-lg hover:bg-red-500/20 transition-colors shrink-0">
            Disable
          </button>
        </div>
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
      <DialogTitle className="text-lg leading-4.5 font-semibold text-white-600 mb-6">Billing History</DialogTitle>

      <div className="space-y-4 mb-6">
        {history.map((item, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#222] text-white/50">
                <Calendar className="size-5" />
              </div>
              <div>
                <div className="text-sm leading-3.5 font-medium text-white-500 mb-0.5">{item.date}</div>
                <div className="text-xs font-regular leading-3 text-white/50-400">{item.type}</div>
              </div>
            </div>
            <div className="text-lg font-medium text-white-500">{item.amount}</div>
          </div>
        ))}
      </div>

      <div className="text-center text-sm leading-3.5 text-white/50-400 mb-8">
        No more data available
      </div>

      <div className="flex gap-6">
        <button
          onClick={onClose}
          className="flex-1 rounded-[10px] py-3 text-sm font-medium text-white-500 bg-[#222] hover:bg-[#333] transition-colors"
        >
          Cancel
        </button>
        <button className="flex-1 rounded-[10px] py-3 text-base font-semibold text-white-500 trade-btn">
          Update Password
        </button>
      </div>
    </div>
  );
}
