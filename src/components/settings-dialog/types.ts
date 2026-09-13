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
