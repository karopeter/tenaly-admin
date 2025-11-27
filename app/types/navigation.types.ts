import { LucideIcon } from "lucide-react";

export interface NavItem {
  name: string;
  icon: LucideIcon;
  path: string;
  badge?: number;
}

export interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
}

export interface HeaderProps {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
}