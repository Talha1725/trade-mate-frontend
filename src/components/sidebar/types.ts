import type { ComponentType, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export interface SidebarItemProps {
  icon?: ComponentType<{ className?: string }>;
  iconSrc?: string;
  label: string;
  href: string;
  active?: boolean;
  badge?: string | number;
}

export interface CardRowProps {
  icon?: LucideIcon;
  iconSrc?: string;
  label: string;
  subLabel: string;
  value: string;
  iconColorClass?: string;
  iconBgClass?: string;
  valueIcon?: ReactNode;
  valueClassName?: string;
}
