"use client";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Sidebar } from "../reusables/Sidebar";
import { Header } from "../reusables/Header";
import { StatsCard } from "../reusables/StatsCard";
import { User, Clipboard, Crown, DollarSign, } from "lucide-react";
import { StatCard } from "../types";

export default function Dashboard() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const stats: StatCard[] = [
    {
      title: "Total Users",
      value: "70,000",
      change: "+30% from last 28 days",
      icon: User,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      title: "Total Ads",
      value: "70,000 ads",
      change: "+30% from last 28 days",
      icon: Clipboard,
      iconBg: "bg-pink-100",
      iconColor: "text-pink-600"
    },
    {
      title: "Total Revenue",
      value: "₦700,000",
      change: "+30% from last 28 days",
      icon: DollarSign,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600"
    },
    {
      title: "Total subscribed user",
      value: "70,000",
      change: "+30% from 28 days",
      icon: Crown,
      iconBg: "bg-teal-100",
      iconColor: "text-teal-600"
    }
  ];

  useEffect(() => {
    const handleResize = () => {
        if (window.innerWidth >= 1024) {
            // Desktop: sidebar open by default 
            setSidebarOpen(true);
        } else {
            setSidebarOpen(false);
        }
    };

    handleResize();

    // Listen for window resize 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

    useEffect(() => {
        if (!isLoading && !user) {
          router.push('/');
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
         <div className="min-h-screen flex items-center justify-center">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
         </div>
        );
    }

    if (!user) {
        return null;
    }

   return (
 <div className="flex min-h-screen bg-[#FFFFFF]">
  <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

 
  <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
    <Header isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

    <main className="p-6">
      {/* ADD THIS FILTER SECTION */}
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-[14px] font-[500] text-[#525252]">Sort By:</h2>

         {/* Year Filter Dropdown */ }
         <select 
           className="px-4 py-2 border-[1px] border-[#EDEDED] 
           rounded-[4px] text-sm md:w-[71px] focus:outline-none">
           <option value="">Filter by Year</option>
           <option value="2025">2025</option>
           <option value="2024">2024</option>
           <option value="2023">2023</option>
           <option value="2022">2022</option>
         </select>

         {/* Last Days Filter Dropdown */}
         <select 
           className="px-4 py-2 border-[1px] border-[#EDEDED]  
           rounded-[4px] text-sm md:w-[123px] focus:outline-none">
           <option value="7">Last 7 Days</option>
           <option value="14">Last 14 Days</option>
           <option value="28">Last 28 Days</option>
           <option value="30">Last 30 Days</option>
           <option value="90">Last 90 Days</option>
         </select>
      </div>
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, idx) => (
        <StatsCard key={idx} {...stat} />
      ))}
     </div>
    </main>
  </div>
 </div>
)
}