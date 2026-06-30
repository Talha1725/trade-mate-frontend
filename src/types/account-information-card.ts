export type AccountInformationStatTone = "default" | "positive";

export type AccountInformationStat = {
  id: string;
  label: string;
  value: string;
  valueTone?: AccountInformationStatTone;
  showVerifiedIcon?: boolean;
};

export type AccountInformationCardProps = {
  title?: string;
  initials?: string;
  fullName?: string;
  email?: string;
  memberSince?: string;
  stats?: AccountInformationStat[];
  editProfileLabel?: string;
  onEditProfile?: () => void;
  className?: string;
};
