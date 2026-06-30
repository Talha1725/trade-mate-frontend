"use client";
import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { AccountActionsCard } from "@/components/settings/account-actions-card";
import { AccountActivityCard } from "@/components/settings/account-activity-card";
import { AccountInformationCard } from "@/components/settings/account-information-card";
import { SecurityOverviewCard } from "@/components/settings/security-overview-card";
import { SubscriptionPlanCard } from "@/components/settings/subscription-plan-card";
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
        <div className="grid grid-cols-1 gap-5 md:gap-6 xl:grid-cols-2">
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
          <AccountActivityCard
            onActiveSessionsClick={() =>
              toast.info("Active session management is not available yet.")
            }
          />
          <SubscriptionPlanCard
            onManagePlan={() =>
              toast.info("Plan management is not available for free accounts yet.")
            }
            onViewHistory={() => setActiveView("billing-history")}
          />
        </div>

        <AccountActionsCard
          onActionClick={(actionId) => {
            const messages: Record<string, string> = {
              "export-data": "Data export is not available yet.",
              "download-reports": "Report downloads are not available yet.",
              "close-account": "Account closure is not enabled yet.",
              "contact-support": "Support chat is not available yet.",
            };
            toast.info(messages[actionId] ?? "This action is not available yet.");
          }}
        />

        {/* image */}
        <Image src="/images/setting/settinggraphs.png" alt="Settings" width={3000} height={200} className="w-full" />
      </div>
    </AppShell>
  );
}

