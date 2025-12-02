import { 
  LayoutDashboard,
  Users,
  Bell,
  FileText,
  Wallet,
  UserPlus,
  Crown,
  FileBarChart,
  Headphones
} from "lucide-react";
import { NavItem } from "../types";


export const NAV_ITEMS: NavItem[] = [
  { name: "Overview", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Users", icon: Users, path: "/users" },
  { name: "Ads Verification", icon: Bell, path: "/ads-verification",  },
  { name: "User Verification", icon: FileText, path: "/verification" },
  { name: "Transactions", icon: Wallet, path: "/transactions" },
  { name: "Subscription", icon: Crown, path: "/subscription" },
  { name: "Team Management", icon: UserPlus, path: "/team-management" },
  { name: "Customer Support", icon: Headphones, path: "/support" }, 
  { name: "Report", icon: FileBarChart, path: "/report"},
]