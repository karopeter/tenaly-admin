"use client";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Img from "../reusables/Img";
import { Sidebar } from "../reusables/Sidebar";
import api from "@/services/api";
import { FiDownload, FiX } from "react-icons/fi";
import { VerificationData, UserVerification } from "../types/verification.types";
import { Header } from "../reusables/Header";
import { toast } from 'react-toastify';


export default function Verification() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [verifications, setVerifications] = useState<UserVerification[]>([]);
    const [filteredVerifications, setFilteredVerifications] = useState<UserVerification[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState<"all" | "verified" | "pending" | "rejected">("all");

    // Filter states 
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterDate, setFilterDate] = useState("");

    // Modal States 
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedVerification, setSelectedVerification] = useState<VerificationData | null>(null);
    const [selectedUser, setSelectedUser] = useState<UserVerification | null>(null);


    
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

    useEffect(() => {
      if (user) {
        fetchVerifications();
      }
    }, [user]);

    // Apply Filters 
    useEffect(() => {
      applyFilters();
    }, [verifications, searchTerm, filterType, filterStatus, filterDate, selectedTab]);

    const fetchVerifications = async () => {
      try {
       setLoading(true);
       const response = await api.get("/verification/admin/verifications");
       setVerifications(response.data.data);
      } catch (error) {
        console.error("Error fetching verifications:", error);
      } finally {
        setLoading(false);
      }
    };

    const applyFilters = () => {
      let filtered = [...verifications];

      // Search filter 
      if (searchTerm) {
        filtered = filtered.filter(
          (v) => 
          v.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
          v.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Type filter 
      if (filterType !== "all") {
        filtered = filtered.map((v) => ({
          ...v,
          verifications: v.verifications.filter((ver) => ver.verificationType === filterType)
        })).filter((v) => v.verifications.length > 0);
      }

      // Status filter (tab + dropdowns)
      const activeStatus = selectedTab !== "all" ? selectedTab : filterStatus;
      if (activeStatus !== "all") {
        filtered = filtered.map((v) => ({
          ...v,
          verifications: v.verifications.filter((ver) => ver.status === activeStatus)
        })).filter((v) => v.verifications.length > 0);
      }

      // Date Filter 
      if (filterDate) {
        filtered = filtered.map((v) => ({
          ...v,
          verifications: v.verifications.filter((ver) => {
            const submitDate = new Date(ver.dateSubmitted).toDateString();
            const filterDateObj = new Date(filterDate).toDateString();
            return submitDate === filterDateObj;
          })
        })).filter((v) => v.verifications.length > 0);
      }

      setFilteredVerifications(filtered);
    };

    const clearFilters = () => {
      setSearchTerm("");
      setFilterType("all");
      setFilterStatus("all");
      setFilterDate("");
      setSelectedTab("all");
    };

    const handleExportCSV = async () => {
       try {
        const params = new URLSearchParams();
        if (filterType !== "all") params.append("type", filterType);
        if (filterStatus !== "all") params.append("status", filterStatus);

        const response = await api.get(`/verification/admin/verifications/export/csv?${params}`, {
          responseType: "blob"
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "verifications.csv");
        document.body.appendChild(link);
        link.click();
        link.remove();
       } catch (error) {
        console.error("Error exporting CSV:", error);
       }
    };

    const viewDetails = async (verification: VerificationData, user: UserVerification) => {
       setSelectedVerification(verification);
       setSelectedUser(user);
       setShowDetailsModal(true);
    };

    const handleApprove = async (verificationId: string) => {
      try {
        await api.patch(`/verification/admin/verify/${verificationId}`);
        fetchVerifications();
        setShowDetailsModal(false);
        toast.success("Verification Approved Successfully!");
      } catch (error) {
        console.error("Error approving verification:", error);
      }
    };

    const handleReject = async (verificationId: string) => {
       const reason = prompt("Enter rejection reason:");
       if (!reason) return;

       try {
        await api.patch(`/verification/admin/reject/${verificationId}`, {
          rejectionReason: reason,
        });
        fetchVerifications();
        setShowDetailsModal(false);
        toast.success("Verification Rejected Successfully!")
       } catch (error) {
         console.error("Error rejecting verification:", error);
       }
    };

    const formatDate = (date: string | null) => {
      if (!date) return "--";
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    };

    const getStatusBadge = (status: string) => {
      const statusStyles = {
        pending: "bg-[#CAA416] text-white",
        verified: "bg-[#238E15] text-[#FAFAFA]",
        rejected: "bg-[#CB0D0D] text-[#FAFAFA]",
      };
      return (
        <span 
         className={`rounded-[28px] px-3 py-[7px] w-[79px] h-[31px] text-white text-sm font-medium ${
           statusStyles[status as keyof typeof statusStyles]
         }`}
        >
        {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      );
    };


    const getStatusCount = (status: "verified" | "pending" | "rejected") => {
     return verifications.reduce((count, userVerification) => {
       return count + userVerification.verifications.filter(v => v.status === status).length
    }, 0);
  };

    
    if (isLoading || loading) {
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
           <div className="mb-6">
             <h1 className="text-[20xp] font-medium text-[#525252]">Verification</h1>
           </div>

           {/* Verification Overview Section */}
           <div className="bg-white rounded-lg p-4 mb-6">
             <div className="flex items-center justify-between mb-4">
              <h2 className="text-[14px] font-medium text-[#000087] 
              flex items-center jusity-between bg-[#F7F7FF] rounded-[8px] h-[44px] w-[281px] pt-[10px] pr-[16px] pb-[10px] pl-[16px]">
              Verification Overview 
               <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
              </h2>
              <button
              onClick={handleExportCSV}
               className="flex items-center gap-2 px-4 py-2 cursor-pointer 
                bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white rounded-lg hover:bg-indigo-700"
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

              {/* Filter Centered */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto lg:mx-auto">
                  <span className="text-[#2C2C2C] font-[400] text-[14px]">
                     Filter By:
                  </span>

                  {/* Type Category Dropdown */}
                  <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                    className="px-4 py-2 
                    border border-[#CDCDD7]
                    rounded-[4px]
                    w-full sm:w-[96px]
                    h-[44px]
                    focus:outline-none"
                  >
                    <option value="all">All Types</option>
                    <option value="personal">Personal</option>
                    <option value="business">Business</option>
                  </select>

                  {/* Date Dropdown */}
                   <input
                     type="date"
                     value={filterDate}
                     onChange={(e) => setFilterDate(e.target.value)}
                     className="px-4 py-2 border border-[#CDCDD7] rounded-lg w-full sm:w-[173px] h-[44px] focus:outline-none"
                   />

                  {/* Status Dropdown */}
                  <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                   className="  px-4 py-2
                    border border-[#CDCDD7]
                    rounded-lg
                    w-full sm:w-[173px]
                    h-[44px]
                    focus:outline-none"
                  >
                   <option value="all">All Status</option>
                   <option value="pending">Pending</option>
                   <option value="verified">Verified</option>
                   <option value="rejected">Rejected</option>
                  </select>

                  {/* Clear Cilter */}
                  <button
                  onClick={clearFilters}
                    className="
                     flex items-center gap-1 
                     text-[#525252] font-[400] text-[14px]
                     whitespace-nowrap
                    "
                  >
                   <Img
                    src="/clear-filter.svg"
                    alt="Clear Filter"
                    width={13.33}
                    height={16.67}
                   />
                    Clear filter
                  </button>
              </div>
             </div>

             {/* Status Tabs */}
             <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-2">
               <button
                 onClick={() => setSelectedTab("all")}
                 className={`px-4 py-2 rounded-lg ${
                  selectedTab === "all"
                    ? 'bg-[#8989E9] text-[#FFFFFF]'
                      : 'border-[1px] border-[#CDCDD7] rounded-[4px] text-[#525252]'
                }`}
               >
                All ({filteredVerifications.length})
               </button>
              <button
                onClick={() => setSelectedTab("verified")}
                className={`px-4 py-2 rounded-lg ${
                  selectedTab === "verified"
                     ? 'bg-[#8989E9] text-[#FFFFFF]'
                      : 'border-[1px] border-[#CDCDD7] rounded-[4px] text-[#525252]'
                }`} 
              >
               Verified ({getStatusCount("verified")})
             </button>
             <button
               onClick={() => setSelectedTab("pending")}
               className={`px-4 py-2 rounded-lg ${
                  selectedTab === "pending"
                     ? 'bg-[#8989E9] text-[#FFFFFF]'
                      : 'border-[1px] border-[#CDCDD7] rounded-[4px] text-[#525252]'
                }`}
             >
              Pending ({getStatusCount("pending")})
             </button>
             <button 
              onClick={() => setSelectedTab("rejected")}
               className={`px-4 py-2 rounded-lg ${
                  selectedTab === "rejected"
                     ? 'bg-[#8989E9] text-[#FFFFFF]'
                      : 'border-[1px] border-[#CDCDD7] rounded-[4px] text-[#525252]'
                }`}
             >
              Rejected ({getStatusCount("rejected")})
             </button>
             </div>

             {/* Table */}
             <div className="overflow-x-auto -mx-4 sm:mx-0">
               <div className="inline-block min-w-full align-middle">
                 <div className="overflow-hidden">
                   <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-[#E7E7E7] border-y border-[#E1E1E1]">
                      <tr>
                        <th className="px-6 py-3 text-left text-[14px] font-[600] text-[#525252] tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-[14px] font-[600] text-[#525252] tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-[14px] font-[600] text-[#525252] tracking-wider">Date Submitted</th>
                        <th className="px-6 py-3 text-left text-[14px] font-[600] text-[#525252] tracking-wider">Date Approved/rejected</th>
                        <th className="px-6 py-3 text-left text-[14px] font-[600] text-[#525252] tracking-wider">Status</th>
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
                              className="px-6 py-4 text-center text-gray-500"
                             >
                              No verification requests found
                             </td>
                          </tr>
                        ): (
                          filteredVerifications.map((userVerification) => 
                            userVerification.verifications.map((verification, idx) => (
                              <tr key={verification.verificationId} className="hover:bg-gray-50">
                               <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {userVerification.fullName}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {userVerification.email}
                                  </div>
                                </div>
                               </td>
                               <td className="px-6 py-4 whitespace-nowrap">
                                 <span className="text-sm text-gray-900 capitalize">
                                   {verification.verificationType}
                                 </span>
                                 {verification.businessName && (
                                  <div className="text-xs text-gray-500">
                                    {verification.businessName}
                                  </div>
                                 )}
                               </td>
                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                 {formatDate(verification.dateSubmitted)}
                               </td>
                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(
                                  verification.dateApproved || 
                                    verification.dateRejected 
                                )}
                               </td>
                               <td className="px-6 py-4 whitespace-nowrap">
                                  {getStatusBadge(verification.status)}
                               </td>
                               <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                  onClick={() => 
                                    viewDetails(verification, userVerification)
                                  }
                                  className="text-indigo-600 hover:text-indigo-900"
                                 >
                                  View Details
                                </button>
                               </td>
                              </tr>
                            ))
                          )
                        )}
                      </tbody>
                   </table>
                 </div>
               </div>
             </div>
           </div>
         </main>
       </div>

       {/* Details Modal */}
       {showDetailsModal && selectedVerification && selectedUser && 
        <div className="fixed inset-0 bg-black/40 backgrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[20px] font-[500] text-[#525252]">
                  Verification  Details 
                </h2>
                <button 
                  onClick={() => setShowDetailsModal(false)}
                  className="text-[#141B34] cursor-pointer"
                >
                  <FiX size={24} />
                </button>
              </div>

              {/* User Info */}
              <div className="mb-6 pb-6 border-b">
                <h3 className="text-[14px] font-semibold text-[#525252] mb-3">User Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                     <p className="text-[#525252] text-[14px] font-[600]">User Name:</p>
                     <p className="text-[#5555DD] font-[400] text-[14px]">{selectedUser.fullName}</p>
                  </div>
                  <div>
                    <p className="text-[#525252] text-[14px] font-[600]">Email</p>
                    <p className="text-[#525252] font-[400] text-[14px]">{selectedUser.email}</p>
                  </div>
                </div>
              </div>
              
              {/* Verification Details */}
              {selectedVerification.verificationType === "personal" ? (
                <div className="mb-6 pb-6 border-b">
                  <h3 className="text-[#525252] font-[600] text-[14px] mb-3">Personal Verification</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[14px] font-[600] text-[#525252]">ID Type</p>
                      <p className="text-[14px] font-[400] capitalize text-[#4C4C4C]">
                        {selectedVerification.validIdType}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-2">Valid ID Document</p>
                      <a
                        href={selectedVerification.validIdFile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 text-sm underline"
                      >
                        View Document
                      </a>
                    </div>
                  </div>
                </div>
              ): (
               <div className="mb-6 pb-6 border-b">
                  <h3 className="text-[#525252] font-[600] text-[14px] mb-3">Business Verification</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[14px] font-[600] text-[#525252]">Business Name</p>
                      <p className="text-[#5555DD] font-[400] text-[14px]">{selectedVerification.businessName}</p>
                    </div>
                    <div>
                      <p className="text-[14px] font-[600] text-[#525252]">Business Address</p>
                      <p className="text-[#4C4C4C] font-[400] text-[14px]">{selectedVerification.businessAddress}</p>
                    </div>
                    <div>
                      <p className="text-[14px] font-[600] text-[#525252]">Business Email</p>
                      <p className="text-[#4C4C4C] font-[400] text-[14px]">{selectedVerification.businessEmail}</p>
                    </div>
                    <div>
                      <p className="text-[#525252] text-[14px] font-[600]">Business Phone</p>
                      <p className="text-[#4C4C4C] font-[400] text-[14px]">{selectedVerification.businessPhoneNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-2">Business Certificate</p>
                      <a
                        href={selectedVerification.businessCertificate}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 text-sm underline"
                      >
                        View Certificate
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Status Info */}
              <div className="mb-6 pb-6 border-b">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Status Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                     <p className="text-[#525252] text-[14px] font-semibold">Date Submitted</p>
                     <p className="text-[#4C4C4C] text-[14px] font-[400]">
                      {formatDate(selectedVerification.dateSubmitted)}
                     </p>
                  </div>
                  <div>
                    <p className="text-[#525252] font-semibold text-[14px]">Status</p>
                    <div className="mt-1">{getStatusBadge(selectedVerification.status)}</div>
                  </div>
                  {selectedVerification.dateApproved && (
                    <div>
                      <p className="text-[#525252] font-[600] text-[14px]">Verified Date</p>
                      <p className="text-[#4C4C4C] text-[14px] font-[400]">
                        {formatDate(selectedVerification.dateApproved)}
                      </p>
                    </div>
                  )}
                  {selectedVerification.dateRejected && (
                    <div>
                      <p className="text-xs text-gray-500">Rejected Date</p>
                      <p className="text-sm font-medium">
                        {formatDate(selectedVerification.dateRejected)}
                      </p>
                    </div>
                  )}
                </div>
                {selectedVerification.rejectionReason && (
                  <div className="mt-4">
                    <p className="text-xs text-gray-500">Rejection Reason</p>
                    <p className="text-sm text-red-600 font-medium">
                      {selectedVerification.rejectionReason}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {selectedVerification.status === "pending" && (
                <div className="flex gap-4">
                   <button
                    onClick={() => handleReject(selectedVerification.verificationId)}
                    className="flex-1 px-4 py-3 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-50 font-medium"
                  >
                    Reject
                  </button>
                   <button
                    onClick={() => handleApprove(selectedVerification.verificationId)}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white rounded-lg hover:opacity-90 font-medium"
                  >
                    Approve
                  </button>
                </div>
              )} 
            </div>
          </div>
        </div>
       }
     </div>
    )
}