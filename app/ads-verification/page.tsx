"use client";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { Sidebar } from "../reusables/Sidebar";
import { Header } from "../reusables/Header";
import api from "@/services/api";
import { Ad } from "../types/ads";
import { useRouter } from "next/navigation";
import { FiMoreVertical, FiDownload } from "react-icons/fi";
import { format, } from "date-fns";
import Img from "../reusables/Img";

type StatusFilter = 'all' | 'approved' | 'pending' | 'rejected' | 'sold'; 
type CategoryFilter = string;

interface FlattenedAd extends Ad {
  businessName: string;
  userName: string;
  adType: string;
}

export default function AdsVerification() {
  const router = useRouter();
    const { isLoading } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState<string>('all');
    const [flattenedAds, setFlattenedAds] = useState<FlattenedAd[]>([]);
    const [selectedAd, setSelectedAd] = useState<FlattenedAd | null>(null);
    const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);


    const filteredAds = flattenedAds.filter(ad => {
      const matchesStatus = statusFilter === 'all' || ad.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || ad.adType.toLowerCase() === categoryFilter.toLowerCase();
      
      // Search filter - search in both userName and businessName 
      const matchesSearch = searchTerm === '' || 
        ad.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        ad.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ad.category.toLowerCase().includes(searchTerm.toLowerCase());

    // Date filter 
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const adDate = new Date(ad.createdAt);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (dateFilter === 'today') {
        matchesDate = adDate >= today;
      } else if (dateFilter === 'week') {
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        matchesDate = adDate >= weekAgo;
      } else if (dateFilter === 'month') {
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        matchesDate = adDate >= monthAgo;
      }
    }

      return matchesStatus && matchesCategory && matchesSearch && matchesDate;
    });

    // Count ads by status
    const approvedCount = flattenedAds.filter(ad => ad.status === 'approved').length;
    const pendingCount = flattenedAds.filter(ad => ad.status  === 'pending').length;
    const rejectedCount = flattenedAds.filter(ad => ad.status === 'rejected').length;
    const soldCount = flattenedAds.filter(ad => ad.status === 'sold').length;

    // Get unique categories
    const categories = ['all', ...Array.from(new Set(flattenedAds.map(ad => ad.adType)))];

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
      fetchUsers();
    }, [statusFilter, categoryFilter, dateFilter, searchTerm]);

    const fetchUsers = async () => {
      try {
       setLoading(true);
       const queryParam = statusFilter !== 'all' ? `?status=${statusFilter}` : '';
       const response = await api.get(`/profile/admin/listed-ads${queryParam}`);
    
  
    const mappedAds = response.data.data.map((ad: any) => ({
      _id: ad._id, 
      businessName: ad.businessName,
      userName: ad.businessName, 
      category: ad.category,
      adType: ad.adType,
      status: ad.status,
      createdAt: ad.createdAt,
      approvedAt: ad.approvedAt,
      carAdId: ad.carAdId
    }));
    
    setFlattenedAds(mappedAds);
  } catch (error) {
    console.error('Error fetching ads:', error);
  } finally {
    setLoading(false);
  }
};

   const getAdCategoryStatus = (status: string) => {
     if (!status) return 'Pending';

     return status.charAt(0).toUpperCase() + status.slice(1);
   }

    const handleApprove = async (adId: string) => {
      try {
        setActionLoading(true);
        await api.patch(`/profile/admin/approve-ad/${adId}`);
        fetchUsers();
        setShowActionMenu(null);
        setShowDetailsModal(false);
      } catch (error) {
        console.error('Error approving ad:', error);
      } finally {
        setActionLoading(false);
      }
    };

    const handleReject = async (adId: string) => {
      try {
        setActionLoading(true);
        await api.patch(`/profile/admin/reject-ad/${adId}`);
        fetchUsers();
        setShowActionMenu(null);
        setShowDetailsModal(false);
      } catch (error) {
        console.error('Error rejecting ad:', error);
      } finally {
        setActionLoading(false);
      }
    };

    const exportToCSV = async () => {
     try {
    // Build query params based on current filters
    const params = new URLSearchParams();
    
    if (statusFilter !== 'all') params.append('status', statusFilter);
    if (categoryFilter !== 'all') params.append('category', categoryFilter);
    if (dateFilter !== 'all') {
      const today = new Date();
      let startDate;
      
      if (dateFilter === 'today') {
        startDate = new Date(today.setHours(0, 0, 0, 0));
      } else if (dateFilter === 'week') {
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 7);
      } else if (dateFilter === 'month') {
        startDate = new Date(today);
        startDate.setMonth(startDate.getMonth() - 1);
      }
      
      if (startDate) {
        params.append('startDate', startDate.toISOString());
        params.append('endDate', new Date().toISOString());
      }
    }

    // Option 1: Server-side CSV generation (recommended)
    const response = await api.get(`/profile/admin/ads/export-csv?${params.toString()}`, {
      responseType: 'blob'
    });
    
    const blob = new Blob([response.data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ads-export-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
  } catch (error) {
    console.error('Error exporting CSV:', error);
    clientSideExport();
  }
};

// Fallback client-side export
const clientSideExport = () => {
  const headers = ['Business', 'Category', 'Date Created', 'Date Approved', 'Status'];
  const rows = filteredAds.map(ad => [
    ad.businessName,
    ad.adType,
    format(new Date(ad.createdAt), 'MM/dd/yyyy hh:mma'),
    ad.approvedAt ? format(new Date(ad.approvedAt), 'MM/dd/yyyy hh:mma') : '--',
    ad.status.charAt(0).toUpperCase() + ad.status.slice(1),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ads-export-${format(new Date(), 'yyyy-MM-dd')}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
};

    if (isLoading || loading) {
        return (
         <div className="min-h-screen flex items-center justify-center">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
         </div>
        );
    }

    return (
     <div className="flex min-h-screen bg-[#F9FAFB]">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

       <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'} overflow-x-hidden`}>
          <Header isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
          <main className="p-6">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-[20xp] font-medium text-[#525252]">Ads</h1>
            </div>

            {/* Ads Overview Section */}
            <div className="bg-white rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[14px] font-medium 
                 text-[#000087] flex 
                 items-center justify-between bg-[#F7F7FF] rounded-[8px] h-[44px] w-[281px] pt-[10px] pr-[16px] pb-[10px] pl-[16px]">
                  Ads Overview
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </h2>
                  <button
                  onClick={exportToCSV}
                  className="flex items-center gap-2 px-4 py-2 cursor-pointer 
                  bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white rounded-lg hover:bg-indigo-700"
                >
                  <FiDownload />
                  Export csv
                </button>
              </div>

       

              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4">
              {/* Search Input */ }
              <div>
                <input 
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
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

              {/* Filter Centered */ }
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto lg:mx-auto">
               <span className="text-[#2C2C2C] font-[400] text-[14px]">Filter By:</span>

               {/* Category Dropdown */}
               <select
                 value={categoryFilter}
                 onChange={(e) => setCategoryFilter(e.target.value)}
                 className="
                    px-4 py-2 
                    border border-[#CDCDD7]
                    rounded-[4px]
                    w-full sm:w-[96px]
                    h-[44px]
                    focus:outline-none
                  "
                >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                   {cat === 'all' ? 'Category' : cat}
                  </option>
                ))}
               </select>

               {/* Date Dropdown */}
               <select
                 value={dateFilter}
                 onChange={(e) => setDateFilter(e.target.value)}
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

               {/* clear filter */ }
               <button
                 onClick={() => {
                  setStatusFilter('all');
                  setCategoryFilter('all');
                  setDateFilter('all');
                  setSearchTerm('');
                  fetchUsers();
                 }}
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
                  className={`h-[32px] w-[111px] pt-[8px] pr-[16px] pb-[10px] pl-[16px] rounded-[4px] text-[14px] font-medium ${
                    statusFilter === 'all'
                      ? 'bg-[#8989E9] text-[#FFFFFF]'
                      : 'border-[1px] border-[#CDCDD7] rounded-[4px] text-[#525252]'
                  }`}
                >
                  All ({flattenedAds.length})
                </button>
                <button
                  onClick={() => setStatusFilter('approved')}
                  className={`h-[32px] w-[149px] pt-[8px] pr-[16px] pb-[10px] pl-[16px] rounded-[4px] text-sm font-medium  ${
                    statusFilter === 'approved'
                      ? 'bg-[#8989E9] text-[#FFFFFF]'
                      : 'border-[1px] border-[#CDCDD7] rounded-[4px] text-[#525252]'
                  }`}
                >
                  Approved ({approvedCount})
                </button>
                <button
                  onClick={() => setStatusFilter('pending')}
                  className={`h-[32px] w-[149px] pt-[8px] pr-[16px] pb-[10px] pl-[16px] rounded-[4px] text-sm font-medium ${
                    statusFilter === 'pending'
                      ? 'bg-[#8989E9] text-[#FFFFFF]'
                      : 'border-[1px] border-[#CDCDD7] rounded-[4px] text-[#525252]'
                  }`}
                >
                  Pending ({pendingCount})
                </button>
                <button
                  onClick={() => setStatusFilter('rejected')}
                  className={`h-[32px] w-[149px] pt-[8px] pr-[16px] pb-[10px] pl-[16px] rounded-[4px] text-sm font-medium ${
                    statusFilter === 'rejected'
                       ? 'bg-[#8989E9] text-[#FFFFFF]'
                      : 'border-[1px] border-[#CDCDD7] rounded-[4px] text-[#525252]'
                  }`}
                >
                  Rejected ({rejectedCount})
                </button>
                <button
                  onClick={() => setStatusFilter('sold')}
                  className={`h-[32px] w-[149px] pt-[8px] pr-[16px] pb-[10px] pl-[16px] rounded-[4px] text-sm font-medium ${
                  statusFilter === 'sold'
                    ? 'bg-[#8989E9] text-[#FFFFFF]'
                   : 'border-[1px] border-[#CDCDD7] rounded-[4px] text-[#525252]'
                   }`}
                  >
                Sold ({soldCount})
               </button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-[#E7E7E7] border-y border-[#E1E1E1]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <input type="checkbox" className="rounded border-gray-300" />
                      </th>
                      <th className="px-6 py-3 text-left text-[14px] font-[600] text-[#525252] tracking-wider">
                        Business
                      </th>
                      <th className="px-6 py-3 text-left text-[14px] font-[600] text-[#525252] tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-[14px] font-[600] text-[#525252] tracking-wider">
                        Date Created
                      </th>
                      <th className="px-6 py-3  text-left text-[14px] font-[600] text-[#525252] tracking-wider">
                        Date Approved
                      </th>
                      <th className="px-6 py-3 text-left text-[14px] font-[600] text-[#525252] tracking-wider">
                        Ads Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAds.map((ad) => (
                      <tr key={ad._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input type="checkbox" className="rounded border-gray-300" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-[400] text-[14px] text-[#525252]">
                          {ad.userName}
                        </td>
                          <td className="px-6 py-4 whitespace-nowrap font-[400] text-[14px] text-[#525252]">
                          {ad.adType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-[400] text-[14px] text-[#525252]">
                          {format(new Date(ad.createdAt), 'MM/dd/yyyy hh:mma')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {ad.approvedAt ? format(new Date(ad.approvedAt), 'MM/dd/yyyy hh:mma') : '--'}
                        </td>
                       <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center justify-center rounded-[28px] px-3 py-[7px] w-[79px] h-[31px] text-white text-sm font-medium ${
                         !ad.status || ad.status === 'pending'
                          ? 'bg-[#CAA416]'
                          : ad.status === 'approved'
                          ? 'bg-[#238E15]'
                          : ad.status === 'rejected'
                          ? 'bg-[#CB0D0D]'
                          : ad.status === 'sold'
                          ? 'bg-[#6B7280]'
                          : 'bg-[#CAA416]' 
                       }`}>
                         {getAdCategoryStatus(ad.status)}
                   </span>
                   </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm relative">
                          {ad.status === 'approved' ? (
                             <button
                             onClick={() => router.push(`/admin/ads/${ad._id}`)}
                              className="text-[#5555DD] text-[14px] cursor-pointer font-[500] hover:text-indigo-900"
                            >
                              View Ad Details
                            </button>
                          ) : (
                            <div className="relative">
                              <button
                                onClick={() => setShowActionMenu(showActionMenu === ad._id ? null : ad._id)}
                                className="p-1 hover:bg-gray-100 rounded"
                              >
                                <FiMoreVertical className="w-5 h-5 text-gray-600" />
                              </button>

                              {showActionMenu === ad._id && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                                  <button
                                     onClick={() => router.push(`/admin/ads/${ad._id}`)}
                                    className="block w-full text-left px-4 py-2 cursor-pointer
                                     text-sm text-[#525252] text-[14px] font-[400] hover:bg-gray-100"
                                  >
                                    View Ad Details
                                  </button>
                                  {/* <button
                                    onClick={() => handleApprove(ad._id)}
                                    className="block w-full text-left px-4 py-2 text
                                    -sm text-[#238E15] cursor-pointer font-[400] hover:bg-gray-100"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleReject(ad._id)}
                                    className="block w-full text-left px-4 py-2 text-sm cursor-pointer text-[#CB0D0D] font-[400] hover:bg-gray-100"
                                  >
                                    Reject
                                  </button> */}
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                  </div>
                </div>

                {filteredAds.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    No ads found matching your filters
                  </div>
                )}
              </div>

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
                <p className="text-sm text-gray-700">
                  Showing 1- {Math.min(10, filteredAds.length)} of {filteredAds.length} results
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
          </main>
        </div>
     </div>
    );
}