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

export type UpdateSettingsProfilePayload = {
  name?: string;
  avatarUrl?: string | null;
};

export type UpdateSettingsPasswordPayload = {
  currentPassword: string;
  newPassword: string;
  confirmPassword?: string;
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
