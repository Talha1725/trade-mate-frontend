import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export type SectionCardProps = {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: ReactNode;
  className?: string;
  contentClassName?: string;
  children: ReactNode;
};
