export type SettingsDialogView =
  | "edit-profile"
  | "change-password"
  | "email-verification"
  | "billing-history"
  | null;

export interface SettingsDialogProps {
  view: SettingsDialogView;
  onViewChange: (view: SettingsDialogView) => void;
}

export interface SettingsViewProps {
  onClose: () => void;
}
