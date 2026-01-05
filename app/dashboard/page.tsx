"use client";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Sidebar } from "../reusables/Sidebar";
import { Header } from "../reusables/Header";
import { StatsCard } from "../reusables/StatsCard";
import { User, Crown, ShoppingBag, Store, DollarSign } from "lucide-react";
import api from "@/services/api";
import { UserStats } from "../types/dashboard.types";
import RevenueGraph from "../reusables/RevenueGraph";
import { toast } from "react-toastify";

interface DashboardStats {
  totalUsers: { count: number; change: string };
  totalAds: { count: number; change: string };
  subscribedUsers: { count: number; change: string };
  totalRevenue: { count: number; change: string };
}

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedDays, setSelectedDays] = useState<string>("28");

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

  // Fetch user statistics and dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        
        // Build query params
        const params = new URLSearchParams();
        if (selectedYear) {
          params.append('year', selectedYear);
        }
        if (selectedDays) {
          params.append('lastDays', selectedDays);
        }

        const [userStatsResponse, dashboardStatsResponse] = await Promise.all([
          api.get('/auth/admin/users-stats'),
          api.get(`/profile/admin/dashboard/stats?${params.toString()}`)
        ]);
        
        if (userStatsResponse.data.success) {
          setUserStats(userStatsResponse.data.data);
        }

        if (dashboardStatsResponse.data.success) {
          setDashboardStats(dashboardStatsResponse.data.data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
        toast.error("Failed to load statistics");
      } finally {
        setStatsLoading(false);
      }
    };

    if (user && user.role === 'admin') {
      fetchStats();
    }
  }, [user, selectedYear, selectedDays]);

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

  // Format currency
  const formatCurrency = (num: number) => {
    return `₦${num.toLocaleString('en-NG')}`;
  };

  const stats = [
    {
      title: "Total Users",
      value: formatNumber(dashboardStats?.totalUsers.count || userStats?.totalUsers || 0),
      change: dashboardStats?.totalUsers.change 
        ? `${dashboardStats.totalUsers.change}% from last period`
        : `${userStats?.recentActivity.last30Days || 0} new users in last 30 days`,
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
      title: "Total Revenue",
      value: formatCurrency(dashboardStats?.totalRevenue.count || 0),
      change: dashboardStats?.totalRevenue.change 
        ? `${dashboardStats.totalRevenue.change}% from last period`
        : "0% change",
      icon: DollarSign,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600"
    },
     {
     title: "Total Admins",
     value: formatNumber(userStats?.roleBreakdown.admin || 0),
     change: `${Math.round(((userStats?.roleBreakdown.admin || 0) / (userStats?.totalUsers || 1)) * 100)}% of total users`,
     icon: Crown,
     iconBg: "bg-pink-100",
     iconColor: "text-pink-600",
    },
    {
      title: "Subscribed Users",
      value: formatNumber(dashboardStats?.subscribedUsers.count || 0),
      change: dashboardStats?.subscribedUsers.change 
        ? `${dashboardStats.subscribedUsers.change}% from last period`
        : "No change",
      icon: Crown,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600"
    },
    {
      title: "Total Ads",
      value: formatNumber(dashboardStats?.totalAds.count || 0),
      change: dashboardStats?.totalAds.change 
        ? `${dashboardStats.totalAds.change}% from last period`
        : "No change",
      icon: ShoppingBag,
      iconBg: "bg-pink-100",
      iconColor: "text-pink-600"
    },
    {
      title: "Verified Users",
      value: formatNumber(userStats?.verifiedUsers || 0),
      change: `${Math.round(((userStats?.verifiedUsers || 0) / (userStats?.totalUsers || 1)) * 100)}% verified`,
      icon: Crown,
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600"
    },
    {
      title: "Active This Week",
      value: formatNumber(userStats?.recentActivity.last7Days || 0),
      change: "New users in last 7 days",
      icon: User,
      iconBg: "bg-teal-100",
      iconColor: "text-teal-600"
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
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
                setSelectedDays(""); // Clear days filter when year is selected
              }}
              className="px-4 py-2 border-[1px] border-[#EDEDED] 
              rounded-[4px] text-sm md:w-[120px] focus:outline-none"
            >
              <option value="">All Years</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>

            {/* Last Days Filter Dropdown */}
            <select 
              value={selectedDays}
              onChange={(e) => {
                setSelectedDays(e.target.value);
                setSelectedYear(""); // Clear year filter when days is selected
              }}
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

          {/* Revenue Graph */}
          <div className="mt-8">
            <RevenueGraph period={selectedDays === "7" ? "7days" : selectedDays === "90" ? "12months" : "30days"} />
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