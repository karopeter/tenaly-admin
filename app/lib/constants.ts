import { 
  LayoutDashboard,
  Users,
  Bell,
  FileText,
  Wallet,
  Crown,
  FileBarChart,
  Headphones
} from "lucide-react";
import { NavItem } from "../types";


export const NAV_ITEMS: NavItem[] = [
  { name: "Overview", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Users", icon: Users, path: "/dashboard/users" },
  { name: "Ads Verification", icon: Bell, path: "/dashboard/ads-verification",  },
  { name: "Tier Verification", icon: FileText, path: "/dashboard/tier-verification", },
  { name: "User Verification", icon: FileText, path: "/dashboard/verification" },
  { name: "Transactions", icon: Wallet, path: "/dashboard/transactions" },
  { name: "Subscription", icon: Crown, path: "/dashboard/subscription" },
  // { name: "Team Management", icon: UserPlus, path: "/dashboard-team-management" },
  { name: "Customer Support", icon: Headphones, path: "/dashboard/support" }, 
  { name: "Report", icon: FileBarChart, path: "/dashboard/report"},
]