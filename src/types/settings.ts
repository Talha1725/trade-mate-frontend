export type SettingsOverviewUser = {
  id: string;
  email: string;
  assignedId: string | null;
  name: string | null;
  avatarUrl: string | null;
  role: "TRADER" | "ADMIN";
  isActive: boolean;
  createdAt: string;
};

export type SettingsOverviewAccount = {
  id: string;
  accountNumber: string | null;
  fundingType: string | null;
  name: string;
  type: "DEMO" | "LIVE";
  status: "ACTIVE" | "SUSPENDED" | "CLOSED";
  balance: string;
  equity: string;
  floatingPnl: string;
  marginUsed: string;
  currency: string;
  openPositionsCount: number;
};

export type SettingsOverviewResponse = {
  user: SettingsOverviewUser;
  account: SettingsOverviewAccount | null;
};

export type SettingsAvatarPresignResponse = {
  key: string;
  uploadUrl: string;
  publicUrl: string;
  method: "PUT";
  headers: {
    "Content-Type": string;
  };
};

export type SettingsProfile = {
  fullName: string;
  email: string;
  avatarUrl: string | null;
};

export type SettingsDialogView =
  | "edit-profile"
  | "change-password"
  | "email-verification"
  | "billing-history"
  | null;

export interface SettingsDialogProps {
  view: SettingsDialogView;
  onViewChange: (view: SettingsDialogView) => void;
  profile?: SettingsProfile;
}

export interface SettingsViewProps {
  onClose: () => void;
  profile?: SettingsProfile;
}
