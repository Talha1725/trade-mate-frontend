import type { AccountActionItem } from "@/types/account-actions-card";

export const ACCOUNT_ACTION_EXPORT_ICON = "/images/setting/export.svg";
export const ACCOUNT_ACTION_DOWNLOAD_ICON = "/images/setting/download.svg";
export const ACCOUNT_ACTION_BIN_ICON = "/images/setting/bin.svg";
export const ACCOUNT_ACTION_HEADPHONES_ICON = "/images/setting/headphones.svg";

export const mockAccountActions: AccountActionItem[] = [
  {
    id: "export-data",
    title: "Export Data",
    description: "Download your account data and trading history",
    iconSrc: ACCOUNT_ACTION_EXPORT_ICON,
    iconTone: "green",
  },
  {
    id: "download-reports",
    title: "Download Reports",
    description: "Generate and download performance reports",
    iconSrc: ACCOUNT_ACTION_DOWNLOAD_ICON,
    iconTone: "green",
  },
  {
    id: "close-account",
    title: "Close Account",
    description: "Permanently close your account and delete all data",
    iconSrc: ACCOUNT_ACTION_BIN_ICON,
    iconTone: "red",
  },
  {
    id: "contact-support",
    title: "Contact Support",
    description: "Get help from our support team",
    iconSrc: ACCOUNT_ACTION_HEADPHONES_ICON,
    iconTone: "purple",
  },
];
