import * as React from "react";
import type { LucideIcon } from "lucide-react";
import type { NavItem, LoginFormValues } from "@/types";

export type AppShellProps = {
  navItems: NavItem[];
  userLabel?: string;
  onSignOut?: () => void;
  children: React.ReactNode;
  className?: string;
};

export type BrandMarkProps = {
  className?: string;
  showName?: boolean;
};

export type PageHeaderProps = {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
  className?: string;
};

export type SectionCardProps = {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  children: React.ReactNode;
};

export type SidebarNavProps = {
  items: NavItem[];
  iconFor?: (item: NavItem) => LucideIcon | undefined;
  className?: string;
};

export type TopBarProps = {
  userLabel?: string;
  onSignOut?: () => void;
};

export type LoginFormProps = {
  onSubmit?: (values: LoginFormValues) => Promise<void> | void;
  redirectTo?: string;
  className?: string;
};
