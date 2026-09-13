import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export type PageHeaderProps = {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actions?: ReactNode;
  className?: string;
};

export type DesktopDownloadPlatform = "macArm64" | "macIntel" | "windows";

export type DesktopReleaseManifest = {
  version?: string;
  releasedAt?: string;
  notes?: string;
  macUrl?: string;
  windowsUrl?: string;
  downloads?: {
    mac?: {
      url?: string;
      fileName?: string;
    };
    macArm64?: {
      url?: string;
      fileName?: string;
    };
    macIntel?: {
      url?: string;
      fileName?: string;
    };
    windows?: {
      url?: string;
      fileName?: string;
    };
  };
};
