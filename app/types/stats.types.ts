import { LucideIcon } from "lucide-react";

export interface StatCard {
    title: string;
    value: string;
    change: string;
    icon: LucideIcon;
    iconBg: string;
    iconColor: string;
}

export type StatCardProps = StatCard;