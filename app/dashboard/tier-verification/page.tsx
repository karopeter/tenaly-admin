"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/app/reusables/Sidebar";
import { Header } from "@/app/reusables/Header";
import { FiDownload } from "react-icons/fi";
import Img from "@/app/reusables/Img";
import { useTierVerificationStore } from "@/app/store/Tier.verification.store";
import { TierVerificationDetailsModal } from "@/app/components/Tierverificationdetailsmodal";
import { 
  filterVerifications,
  getStatusCounts,
  formatDate,
  getStatusColor,
 } from "@/app/Utils/Tier.verification.utils";
import { useGetAllVerifications } from "@/app/hooks/tier-verification";

export default function TierVerification() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const {
     filters, 
     setStatusFilter,
     setTierFilter,
     setDateFilter,
     setSearchTerm,
     clearFilters,
     openDetailsModal,
    } = useTierVerificationStore();

    // Fetch verifications with React Query 
    const {
      data: verificationsData,
      isLoading: dataLoading,
      isError,
      error,
    } = useGetAllVerifications({
        tier: filters.tier === "all" ? undefined : filters.tier,
    });
    
    // Sidebar state
    const [sidebarOpen, setSidebarOpen] = useState(true);


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
     if (!authLoading && !user) {
        router.push("/");
     }
    }, [authLoading || dataLoading]);

    if (authLoading || dataLoading) {
       return (
         <div className="min-h-screen flex items-center justify-center">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
         </div>
        );  
    }

    if (!user) {
      return null;
    }

    if (isError) {
      return (
       <div className="min-h-screen flex items-center justify-center">
         <div className="text-center">
           <p className="text-red-600 mb-4">
            {error?.message || "Failed to load verifications"}
           </p>
            <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
          >
            Retry
          </button>
         </div>
       </div>
      );
    }

    // Get all verifications
    const allVerifications = verificationsData?.data || [];

    // Apply filters 
    const filteredVerifications = 
       filterVerifications(allVerifications, filters);

       // Get Status counts 
       const statusCounts = getStatusCounts(allVerifications);

       // Export to CSV
       const handleExportCSV = () => {
         const csvHeaders = [
             "User",
            "Email",
            "Tier Level",
            "Date Submitted",
            "Date Approved/Rejected",
            "Status"
         ];

         const csvRows = filteredVerifications.map((v) => [
            v.userId?.fullName || "Deleted User",
            v.userId?.email || "N/A",
            v.tier,
            formatDate(v.createdAt),
            v.approvedAt ? formatDate(v.approvedAt) : "--",
            v.status,
         ]);

         const csvContent = [
           csvHeaders.join(","),
           ...csvRows.map((row) => row.join(",")),
         ].join("\n");

         const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
         const link = document.createElement("a");
         const url = URL.createObjectURL(blob);

         link.setAttribute("href", url);
         link.setAttribute(
            "download",
            `tier-verifications-${new Date().toISOString()}.csv`
         );
         link.style.visibility = "hidden";
         document.body.appendChild(link);
         link.click();
         document.body.removeChild(link);
       };

    return (
     <div className="flex min-h-screen bg-[#FFFFFF]">
       <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

       <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
         <Header isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

         <main className="p-6">
         {/* Header */}
         <div className="mb-6">
            <h1 className="text-[20px] font-medium text-[#525252]">
              Tier Verification
            </h1>
         </div>

         {/* Tier Verification Overview Section */}
         <div className="rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
             <h2 className="text-[14px] font-medium text-[#000087] flex items-ccenter justify-between bg-[#F7F7FF] rounded-[8px] h-[44px] w-[281px] pt-[10px] pr-[16px] pb-[10px] pl-[16px]">
               Tier Verification Overview 
               <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
             </h2>
             <button 
              onClick={handleExportCSV}
               className="flex items-center gap-2 px-4 py-2 cursor-pointer
               bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white rounded-lg
               "
             >
              <FiDownload />
               Export csv 
             </button>
          </div>

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4">
            {/* Search Input */}
            <div>
              <input 
                type="text"
                placeholder="Search..."
                value={filters.search}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="
                 w-[283px] h-[44px]
                 px-[24px]
                 border border-[#EDEDED]
                 rounded-[8px]
                 focus:outline-none
                 shadow-[0px_4px_4px_#A79C9C0D]
                "
              />
            </div>

            {/* Filter Centered */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto lg:mx-auto">
              <span className="text-[#2C2C2C] font-[400] text-[14px]">Filter By:</span>

               {/* Category Dropdown */}
                 <select
                 value={filters.tier}
                 onChange={(e) => 
                    setTierFilter(
                        e.target.value === "all"
                        ? "all"
                        : (parseInt(e.target.value) as 1 | 2 | 3)
                    )
                 }
                 className="
                    px-4 py-2 
                    border border-[#CDCDD7]
                    rounded-[4px]
                    w-full sm:w-[96px]
                    h-[44px]
                    focus:outline-none
                  "
                >
                <option value="all">Tier</option>
                <option value="1">Tier 1</option>
                <option value="2">Tier 2</option>
                <option value="3">Tier 3</option>
               </select>

               {/* Date Dropdown */}
                 <select
                 value={filters.date}
                 onChange={(e) => 
                    setDateFilter(
                      e.target.value as "all" | "today" | "week" | "month"
                    )
                 }
                 className="
                    px-4 py-2
                    border border-[#CDCDD7]
                    rounded-lg
                    w-full sm:w-[173px]
                    h-[44px]
                    focus:outline-none
                 "
               >
                 <option value="all">Date</option>
                 <option value="today">Today</option>
                 <option value="week">This Week</option>
                 <option value="month">This Month</option>
               </select>

               {/* Status Dropdown */}
               <select
                 value={filters.status}
                 onChange={(e) => 
                    setStatusFilter(
                      e.target.value as "all" | "approved" | "pending" | "rejected"
                    )
                 }
                 className="
                    px-4 py-2
                    border border-[#CDCDD7]
                    rounded-lg
                    w-full sm:w-[173px]
                    h-[44px]
                    focus:outline-none
                 "
               >
                 <option value="all">All</option>
                 <option value="approved">Approved</option>
                 <option value="pending">Pending</option>
                 <option value="rejected">Rejected</option>
               </select>


               {/* clear filter */}
               <button
                onClick={clearFilters}
                className="
                  flex items-center
                  gap-1 text-[#525252] font-[400] text-[14px]
                  whitespace-nowrap
                 "
               >
                <Img 
                  src="/clear-filter.svg"
                  alt="Clear Filter"
                  width={13.33}
                  height={16.67}
                />
                Clear Filter
               </button>
            </div>
          </div>
            {/* Status Tabs */}
              <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-2">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`h-[32px] px-4 rounded-[4px] text-[14px] font-medium whitespace-nowrap ${
                    filters.status === "all"
                    ? "bg-[#8989E9] text-[#FFFFFF]"
                    : "border-[1px] border-[#CDCDD7] text-[#525252]"
                  }`}
                >
                  All ({statusCounts.total})
                </button>
                <button
                  onClick={() => setStatusFilter('approved')}
                  className={`h-[32px] px-4 rounded-[4px] text-sm font-medium whitespace-nowrap ${
                     filters.status === "approved"
                     ? "bg-[#8989E9] text-[#FFFFFF]"
                     : "border-[1px] border-[#CDCDD7] text-[#525252]"
                  }`}
                >
                  Approved ({statusCounts.approved})
                </button>
                <button 
                  onClick={() => setStatusFilter('pending')}
                  className={`h-[32px] px-4 rounded-[4px] text-sm font-medium whitespace-nowrap ${
                        filters.status === "pending"   
                        ? "bg-[#8989E9] text-[#FFFFFF]"
                        : "border-[1px] border-[#CDCDD7] text-[#525252]"
                     }`}>
                    Pending ({statusCounts.pending})
                </button>
                <button
                  onClick={() => setStatusFilter('rejected')}
                  className={`h-[32px] px-4 rounded-[4px] text-sm font-medium whitespace-nowrap ${
                    filters.status === "rejected"
                      ? "bg-[#8989E9] text-[#FFFFFF]"
                      : "border-[1px] border-[#CDCDD7] text-[#525252]"
                  }`}
                >
                  Rejected ({statusCounts.rejected})
                </button>
              </div>

              {/* Table */ }
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                 <div className="inline-block min-w-full align-middle">
                   <div className="overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-[#E7E7E7] border-y border-[#E1E1E1]">
                        <tr>
                          <th className="px-6 py-3 text-left text-[14px] font-[600] text-[#525252] tracking-wider">
                            User 
                          </th>
                          <th className="px-6 py-3 text-left text-[14px] font-[600] text-[#525252] tracking-wider">
                           Tier Level 
                          </th>
                          <th className="px-6 py-3 text-left text-[14px] font-[600] text-[#525252] tracking-wider">
                           Date Submitted 
                          </th>
                          <th className="px-6 py-3 text-left text-[14px] font-[600] text-[#525252] tracking-wider">
                            Date Approved/rejected
                          </th>
                          <th className="px-6 py-3 text-left text-[14px] font-[600] text-[#525252] tracking-wider">
                            Status
                          </th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                             <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                           </svg>
                         </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredVerifications.length === 0 ? (
                          <tr>
                            <td 
                             colSpan={6}
                             className="px-6 py-12 text-center text-gray-500"
                            >
                             No verifications found matching your filters 
                            </td>
                          </tr>
                        ): (
                          filteredVerifications.map((verification) => (
                           <tr key={verification._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap font-[400] text-[14px] text-[#525252]">
                              {verification.userId?.fullName || <span className="text-gray-400 italic text-[13px]">Deleted User</span>}
                            </td>
                             <td className="px-6 py-4 whitespace-nowrap font-[400] text-[14px] text-[#525252]">
                              Tier {verification.tier}
                            </td>
                             <td className="px-6 py-4 whitespace-nowrap font-[400] text-[14px] text-[#525252]">
                              {formatDate(verification.createdAt)}
                            </td>
                              <td className="px-6 py-4 whitespace-nowrap font-[400] text-[14px] text-[#525252]">
                              {verification.approvedAt
                                ? formatDate(verification.approvedAt)
                                : "--"}
                            </td>
                             <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center justify-center rounded-[28px] px-3 py-[7px] w-[79px] h-[31px] text-white text-sm font-medium ${getStatusColor(
                                  verification.status
                                )}`}
                              >
                                {verification.status.charAt(0).toUpperCase() +
                                  verification.status.slice(1)}
                              </span>
                            </td>
                             <td className="px-6 py-4 whitespace-nowrap text-sm relative">
                              <button
                                onClick={() => openDetailsModal(verification)}
                                className="text-[#5555DD] text-[14px] cursor-pointer font-[500] hover:text-indigo-900"
                              >
                                View Details
                              </button>
                            </td>
                           </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                   </div>
                 </div> 
              </div>

              {/* pagination */}
              <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
                <p className="text-sm text-gray-700">
                Showing {filteredVerifications.length} of {statusCounts.total}{" "}
                results
              </p>
              {/* Add Pagination logic here if needed */}
               <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
                <p className="text-sm text-gray-700">
                  Showing 1 - results
                </p>
                <div className="flex gap-2 flex-wrap justify-center">
                  <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
                    &lt;
                  </button>
                  <button className="px-3 py-1 bg-indigo-600 text-white rounded">
                    1
                  </button>
                  <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
                    2
                  </button>
                  <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
                    3
                  </button>
                  <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
                    4
                  </button>
                  <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
                    5
                  </button>
                  <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
                    ...
                  </button>
                  <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
                    10
                  </button>
                  <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
                    &gt;
                  </button>
                </div>
              </div>
              </div>
         </div>
         </main>
       </div>
       {/* Details Modal */}
       <TierVerificationDetailsModal />
     </div>   
    );
}