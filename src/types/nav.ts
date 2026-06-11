import type { ID } from "@/types";

export type NavItem = {
  id: ID;
  label: string;
  href?: string;
  description?: string;
  disabled?: boolean;
  subItems?: NavItem[];
};
