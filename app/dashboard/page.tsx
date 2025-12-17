"use client";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Sidebar } from "../reusables/Sidebar";
import { Header } from "../reusables/Header";
import { StatsCard } from "../reusables/StatsCard";
import { User, Clipboard, Crown, DollarSign, ShoppingBag, Store } from "lucide-react";
import api from "@/services/api";
import { toast } from "react-toastify";

interface UserStats {
  totalUsers: number;
  roleBreakdown: {
    buyer: number;
    seller: number;
    admin: number;
    customer?: number;
  };
  providerBreakdown: {
    local: number;
    google: number;
  };
  verifiedUsers: number;
  completeProfiles: number;
  recentActivity: {
    today: number;
    last7Days: number;
    last30Days: number;
  };
}

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  // Fetch user statistics
  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        setStatsLoading(true);
        const response = await api.get('/auth/admin/users-stats');
        
        if (response.data.success) {
          setUserStats(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching user stats:", error);
        toast.error("Failed to load user statistics");
      } finally {
        setStatsLoading(false);
      }
    };

    if (user && user.role === 'admin') {
      fetchUserStats();
    }
  }, [user]);

  if (isLoading || statsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Calculate total buyers (including 'customer' as legacy buyer role)
  const totalBuyers = (userStats?.roleBreakdown.buyer || 0) + (userStats?.roleBreakdown.customer || 0);
  const totalSellers = userStats?.roleBreakdown.seller || 0;

  // Format numbers with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US');
  };

  // Calculate percentage change (you can customize this based on your needs)
  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return "+100%";
    const change = ((current - previous) / previous) * 100;
    return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
  };

  const stats = [
    {
      title: "Total Users",
      value: formatNumber(userStats?.totalUsers || 0),
      change: `${userStats?.recentActivity.last30Days || 0} new users in last 30 days`,
      icon: User,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      title: "Total Buyers",
      value: formatNumber(totalBuyers),
      change: `${Math.round((totalBuyers / (userStats?.totalUsers || 1)) * 100)}% of total users`,
      icon: ShoppingBag,
      iconBg: "bg-green-100",
      iconColor: "text-green-600"
    },
    {
      title: "Total Sellers",
      value: formatNumber(totalSellers),
      change: `${Math.round((totalSellers / (userStats?.totalUsers || 1)) * 100)}% of total users`,
      icon: Store,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600"
    },
    {
      title: "Verified Users",
      value: formatNumber(userStats?.verifiedUsers || 0),
      change: `${Math.round(((userStats?.verifiedUsers || 0) / (userStats?.totalUsers || 1)) * 100)}% verified`,
      icon: Crown,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600"
    },
    {
      title: "Google Sign-ups",
      value: formatNumber(userStats?.providerBreakdown.google || 0),
      change: `${Math.round(((userStats?.providerBreakdown.google || 0) / (userStats?.totalUsers || 1)) * 100)}% use Google`,
      icon: User,
      iconBg: "bg-red-100",
      iconColor: "text-red-600"
    },
    // {
    //   title: "Complete Profiles",
    //   value: formatNumber(userStats?.completeProfiles || 0),
    //   change: `${Math.round(((userStats?.completeProfiles || 0) / (userStats?.totalUsers || 1)) * 100)}% completed`,
    //   icon: Clipboard,
    //   iconBg: "bg-indigo-100",
    //   iconColor: "text-indigo-600"
    // },
    {
      title: "Active This Week",
      value: formatNumber(userStats?.recentActivity.last7Days || 0),
      change: "New users in last 7 days",
      icon: User,
      iconBg: "bg-teal-100",
      iconColor: "text-teal-600"
    },
    {
      title: "Active Today",
      value: formatNumber(userStats?.recentActivity.today || 0),
      change: "New registrations today",
      icon: User,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600"
    }
  ];

  return (
    <div className="flex min-h-screen bg-[#FFFFFF]">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <Header isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

        <main className="p-6">
          {/* Filter Section */}
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-[14px] font-[500] text-[#525252]">Sort By:</h2>

            {/* Year Filter Dropdown */}
            <select 
              className="px-4 py-2 border-[1px] border-[#EDEDED] 
              rounded-[4px] text-sm md:w-[71px] focus:outline-none"
            >
              <option value="">Filter by Year</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>

            {/* Last Days Filter Dropdown */}
            <select 
              className="px-4 py-2 border-[1px] border-[#EDEDED]  
              rounded-[4px] text-sm md:w-[123px] focus:outline-none"
            >
              <option value="7">Last 7 Days</option>
              <option value="14">Last 14 Days</option>
              <option value="28">Last 28 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
            </select>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <StatsCard key={idx} {...stat} />
            ))}
          </div>

          {/* Detailed Breakdown Section */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Role Distribution Card */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">User Role Distribution</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Buyers:</span>
                  <span className="text-sm font-semibold text-gray-800">
                    {formatNumber(totalBuyers)} ({Math.round((totalBuyers / (userStats?.totalUsers || 1)) * 100)}%)
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Sellers:</span>
                  <span className="text-sm font-semibold text-gray-800">
                    {formatNumber(totalSellers)} ({Math.round((totalSellers / (userStats?.totalUsers || 1)) * 100)}%)
                  </span>
                </div>
              </div>
            </div>

            {/* Auth Provider Card */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Authentication Methods</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Email/Password:</span>
                  <span className="text-sm font-semibold text-gray-800">
                    {formatNumber(userStats?.providerBreakdown.local || 0)} ({Math.round(((userStats?.providerBreakdown.local || 0) / (userStats?.totalUsers || 1)) * 100)}%)
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Google Sign-in:</span>
                  <span className="text-sm font-semibold text-gray-800">
                    {formatNumber(userStats?.providerBreakdown.google || 0)} ({Math.round(((userStats?.providerBreakdown.google || 0) / (userStats?.totalUsers || 1)) * 100)}%)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}