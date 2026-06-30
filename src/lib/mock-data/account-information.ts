import type { AccountInformationStat } from "@/types/account-information-card";

export const mockAccountInformationStats: AccountInformationStat[] = [
  {
    id: "account-type",
    label: "Account Type",
    value: "Free Account",
  },
  {
    id: "account-status",
    label: "Account Status",
    value: "Active",
    valueTone: "positive",
  },
  {
    id: "verification",
    label: "Verification",
    value: "Verified",
    valueTone: "positive",
    showVerifiedIcon: true,
  },
];

export const mockAccountInformation = {
  initials: "AT",
  fullName: "Alex Travis",
  email: "alex.trader@gmail.com",
  memberSince: "Jan 12, 2024",
};
