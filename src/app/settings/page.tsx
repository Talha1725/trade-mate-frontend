"use client";

import { useState } from "react";
import { SettingsDialogView } from "@/types/settings";
import { SettingsDialog } from "@/components/settings-dialog";
import { PageHeader } from "@/components/page-header";
import { AppShell } from "@/components/app-shell";

export default function SettingsPage() {
  const [activeView, setActiveView] = useState<SettingsDialogView>(null);

  return (
    <AppShell>
    <div className="flex flex-col h-full bg-[#0c0c0e]">
      <PageHeader title="Settings" />
      
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Edit Profile */}
            <div className="p-6 rounded-xl border border-[#222] bg-[#141414] flex flex-col justify-between items-start gap-4">
              <div>
                <h3 className="text-white font-semibold mb-1">Edit Profile</h3>
                <p className="text-white/50 text-sm">Update your personal information and avatar.</p>
              </div>
              <button 
                onClick={() => setActiveView("edit-profile")}
                className="px-4 py-2 rounded-lg bg-[#222] text-white text-sm hover:bg-[#333] transition-colors"
              >
                Edit Profile
              </button>
            </div>

            {/* Change Password */}
            <div className="p-6 rounded-xl border border-[#222] bg-[#141414] flex flex-col justify-between items-start gap-4">
              <div>
                <h3 className="text-white font-semibold mb-1">Change Password</h3>
                <p className="text-white/50 text-sm">Update your account password to stay secure.</p>
              </div>
              <button 
                onClick={() => setActiveView("change-password")}
                className="px-4 py-2 rounded-lg bg-[#222] text-white text-sm hover:bg-[#333] transition-colors"
              >
                Change Password
              </button>
            </div>

            {/* Email Verification */}
            <div className="p-6 rounded-xl border border-[#222] bg-[#141414] flex flex-col justify-between items-start gap-4">
              <div>
                <h3 className="text-white font-semibold mb-1">Email Verification</h3>
                <p className="text-white/50 text-sm">Check your email verification status.</p>
              </div>
              <button 
                onClick={() => setActiveView("email-verification")}
                className="px-4 py-2 rounded-lg bg-[#222] text-white text-sm hover:bg-[#333] transition-colors"
              >
                Email Verification
              </button>
            </div>

            {/* Billing History */}
            <div className="p-6 rounded-xl border border-[#222] bg-[#141414] flex flex-col justify-between items-start gap-4">
              <div>
                <h3 className="text-white font-semibold mb-1">Billing History</h3>
                <p className="text-white/50 text-sm">View your past billing cycles and plan status.</p>
              </div>
              <button 
                onClick={() => setActiveView("billing-history")}
                className="px-4 py-2 rounded-lg bg-[#222] text-white text-sm hover:bg-[#333] transition-colors"
              >
                Billing History
              </button>
            </div>

          </div>
        </div>
      </div>

      <SettingsDialog view={activeView} onViewChange={setActiveView} />
    </div>
    </AppShell>
  );
}
