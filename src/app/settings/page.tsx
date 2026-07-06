"use client";
import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { AccountInformationCard } from "@/components/settings/account-information-card";
import { SecurityOverviewCard } from "@/components/settings/security-overview-card";
import { SettingsDialog } from "@/components/settings-dialog";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import type { SettingsDialogView } from "@/types/settings";

export default function SettingsPage() {
  const [activeView, setActiveView] = useState<SettingsDialogView>(null);
  return (
    <AppShell>
      <SettingsDialog view={activeView} onViewChange={setActiveView} />
      <div className="flex w-full min-w-0 flex-col gap-6">
        <PageHeader title="Settings" />
        <div className="flex flex-col gap-5 md:gap-6 max-w-3xl">
          <AccountInformationCard
            className=""
            onEditProfile={() => setActiveView("edit-profile")}
          />
          <SecurityOverviewCard
            onChangePassword={() => setActiveView("change-password")}
            onManageEmailVerification={() => setActiveView("email-verification")}
            onManageLoginAlerts={() =>
              toast.info("Login alert settings are not editable yet.")
            }
          />
        </div>

        {/* image */}
        <Image src="/images/setting/settinggraphs.png" alt="Settings" width={3000} height={200} className="w-full mt-4" />
      </div>
    </AppShell>
  );
}
