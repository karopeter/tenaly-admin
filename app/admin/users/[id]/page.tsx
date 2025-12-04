"use client";
import { useAuth } from "@/app/context/AuthContext";
import { useState, useEffect } from "react";
import { Sidebar } from "@/app/reusables/Sidebar";
import { Header } from "@/app/reusables/Header";
import api from "@/services/api";
import { useParams, useRouter } from "next/navigation";
import Img from "@/app/reusables/Img";
import { toast } from "react-toastify";
import { UserProfileData } from "@/app/types/users-types";

interface Ad {
 _id: string;
 category: string;
 createdAt: string;
 approvedAt: string | null;
 status: 'approved' | 'pending' | 'rejected';
 adCategory: string;
}

type TabType = 'business' | 'ads' | 'verification' | 'subscription';



export default function ViewUserProfile() {
    const router = useRouter();
    const params = useParams();
    const userId = params.id as string;
    const { user, isLoading: authLoading } = useAuth();

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [loading, setLoading] = useState(true);
    const [selectedBusinessIndex, setSelectedBusinessIndex] = useState(0);
    const [activeTab, setActiveTab] = useState<TabType>('business');
    const [profileData, setProfileData] = useState<UserProfileData | null>(null);
    const [userAds, setUserAds] = useState<Ad[]>([]);
    const [adsLoading, setAdsLoading] = useState(false);


    // fetch user profile 
    const fetchUserProfile = async () => {
      try {
       setLoading(true);
       const response = await api.get(`/profile/admin/users/${userId}`);

       if (response.data.success) {
        setProfileData(response.data.data);
         console.log('Profile Data:', response.data.data);
       }
      } catch (error: any) {
       console.error("Error fetching user profile:", error);
       toast.error(error.response?.data?.message || 'Failed to fetch user profile');
      } finally {
        setLoading(false);
      }
    };

    // Fetch user ads 
    const fetchUserAds = async () => {
      try {
        setAdsLoading(true);
        const response = await api.get(`/profile/admin/listed-ads?userId=${userId}`);

        if (response.data.success) {
            setUserAds(response.data.data);
        }
      } catch (error: any) {
       console.error('Error fetching user ads:', error);
      } finally {
        setAdsLoading(false);
      }
    };

    useEffect(() => {
        if (user && userId) {
            fetchUserProfile();
        }
    }, [user, userId]);

    useEffect(() => {
      if (activeTab === 'ads' && profileData) {
         fetchUserAds();
      }
    }, [activeTab, profileData]);

    const formatDate = (date: string) => {
      return new Date(date).toLocaleDateString('en-US', {
         year: 'numeric',
         month: '2-digit',
         day: '2-digit',
         hour: '2-digit',
         minute: '2-digit'
      });
    };

    const getStatusBadge = (status: string) => {
        const styles = {
         approved: 'bg-green-100 text-green-800',
         pending: 'bg-yellow-100 text-yellow-800',
         rejected: 'bg-red-100 text-red-800'
        };
        return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
    };

    if (authLoading || loading) {
        return (
          <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!profileData) {
      return (
          <div className="min-h-screen flex items-center justify-center">
                <p>User not found</p>
            </div>
      );
    }
    return (
     <div className="flex min-h-screen bg-[#F9FAFB]">
     <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen}  />

     <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'} overflow-x-hidden`}>
        <Header isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

        <main className="p-6">
         {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm">
          <button 
          onClick={() => router.push('/users')}
            className="text-[#525252] hover:text-[#000087]">
            User
         </button>
          <span className="text-[#525252]">›</span>
          <span className="text-[#000087] font-medium">User details</span>
        </div>

          {/* Personal Profile Section */}
        <div className="bg-[#F7F7FF] rounded-[8px] border-[1px] border-[#DFDFF9] p-6 mb-6">
           <h2 className="text-[14px] font-[600] text-[#525252] mb-4 uppercase tracking-wider">
            PERSONAL PROFILE
           </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                 <p className="text-[14px] text-[#525252] mb-1 font-[600]">Name:</p>
                 <p className="text-[14px] text-[#4C4C4C] font-[400]">{profileData.fullName}</p>
              </div>
              <div>
                <p className="text-[14px] text-[#525252] mb-1 font-[600]">Email:</p>
                <p className="text-[14px] text-[#4C4C4C] font-[400]">{profileData.email}</p>
              </div>
              <div>
                <p className="text-[14px] text-[#525252] mb-1 font-[600]">User type:</p>
                <p className="text-[14px] text-[#4C4C4C] font-[400]">{profileData.role}</p>
              </div>
              <div>
                <p className="text-[14px] text-[#525252] mb-1 font-[600]">Date joined:</p>
                <p className="text-[14px] text-[#4C4C4C] font-[400]">{formatDate(profileData.dateJoined)}</p>
              </div>
            </div>

            {profileData.isVerified && (
              <div className="flex items-center justify-between gap-2 pt-4 border-t border-[#DFDFF9]">
                <div className="flex items-center gap-2">
                  <Img 
                    src="/verified-icon.svg"
                    alt="Verfied Icon"
                    width={19}
                    height={20}
                  />
                  <span className="text-[#000087] text-[14px] font-[500]">This user is verified</span>
                </div>
                <button
                  className="text-[14px] border-[1px] border-[#CDCDD7] 
                  cursor-pointer
                  rounded-[4px] h-[24px] w-full md:w-[209px] text-[#525252] font-[500]"
                 >
                    View verification submission
                </button>
              </div>
            )}
        </div>
 
      <div className="flex gap-4 items-start">
        {/* Business name on Left */}
         {activeTab === 'business' && profileData.businesses.length > 0 && (
            <div className="flex flex-col gap-2 flex-shrink-0 min-w-[200px]">
              {profileData.businesses.map((business, idx) => (
                <button
                  key={business._id}
                  onClick={() => setSelectedBusinessIndex(idx)}
                  className={`rounded-[8px] h-[44px] px-4 py-2 pt-3 transition-colors ${
                    selectedBusinessIndex === idx 
                   ? 'bg-[#8989E9]' 
                   : 'bg-[#D4D4E8]'
                  }`}
                 >
                 <p className="truncate text-[#FFFFFF] font-medium text-[14px]">
                  {business.businessName}
                 </p>
                </button>
              ))}
            </div>
         )}

        <div className="flex-1">
          {/* Tabs Button */}
          <div className="flex bg-[#EDEDED] rounded-[8px] h-[44px] gap-2 mb-4">
            <button
             onClick={() => setActiveTab('business')}
             className={`px-6 py-3 text-[14px] font-medium rounded-[8px] transition-colors ${
              activeTab === 'business'
                ? 'text-white bg-gradient-to-r from-[#00A8DF] to-[#1031AA]'
               : 'text-gray-500'
            }`}
            >
            Business Info
            </button>

            <button
             onClick={() => setActiveTab('ads')}
             className={`px-6 py-3 text-[14px] font-medium rounded-[8px] transition-colors ${
               activeTab === 'ads'
                ? 'text-white bg-gradient-to-r from-[#00A8DF] to-[#1031AA]'
                : 'text-gray-500'
             }`}>
              Ads Posted
            </button>

            <button
             onClick={() => setActiveTab('verification')}
             className={`px-6 py-3 text-[14px] font-medium rounded-[8px] transition-colors ${
               activeTab === 'verification'
                ? 'text-white bg-gradient-to-r from-[#00A8DF] to-[#1031AA]'
                : 'text-gray-500'
               }`}>
              Verification
            </button>

            <button
              onClick={() => setActiveTab('subscription')}
              className={`px-6 py-3 text-[14px] font-medium rounded-[8px] transition-colors ${
               activeTab === 'subscription'
                 ? 'text-white bg-gradient-to-r from-[#00A8DF] to-[#1031AA]'
                 : 'text-gray-500'
               }`}>
              Subscription
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'business' && profileData.businesses.length > 0 && (()  => {
            const business = profileData.businesses[selectedBusinessIndex];

            return (
             <div key={business._id} className="border-[1px] border-[#EDEDED] rounded-[8px] p-6">
               <p className="text-[14px] font-[400] text-[#868686] mb-4 leading-relaxed">
                {business.businessDescription}
               </p>

               {/* Business Location */}
               {business.businessAddress.map((address, addrIndex) => {
                const hoursForAddress = business.businessHours.find(
                    h => h.address.includes(address.address)
                );

                return (
                  <div key={addrIndex} className="mb-6">
                    <div className="flex items-start gap-2 mb-2">
                      <Img 
                        src="/admin-location.svg"
                        alt="Location icon"
                        width={11.67}
                        height={16.67}
                      />
                      <div>
                        <p className="text-[14px] font-medium text-[#525252]">
                         {address.address}
                        </p>
                     </div>
                    </div>

                    {/* Working Hours */}
                    {hoursForAddress && hoursForAddress.days.length > 0 && (
                      <div className="mt-3 ml-6">
                        <p className="text-[#525252] text-[14px] font-[500] mb-2">Working Hours</p>
                        <div className="flex items-center gap-4">
                          <div className="flex gap-2 flex-wrap">
                            {hoursForAddress.days.map((day, dayIndex) => (
                              <span key={dayIndex} className="text-[12px] text-[#000087] font-[500]">
                                {day}
                              </span>
                            ))}
                         </div>
                         <div className="flex items-center gap-2">
                          <Img 
                           src="/clock-icon.svg"
                           alt="Clock"
                           width={16}
                           height={16}
                          /> 
                          <span className="text-[10px] text-[#238E15] font-[500]">
                            {hoursForAddress.openingTime} - {hoursForAddress.closingTime}
                          </span>
                        </div>
                        </div>
                      </div>
                    )}

                    {/* Delivery Information */}
                    <div className="mt-4 ml-6">
                      {address.deliveryAvailable ? (
                        <div>
                          <div 
                           className="flex items-center gap-2 mb-2 
                           bg-[#F7F7FF] w-[108px] h-[36px] rounded-[4px]">
                            <Img
                             src="/delivery-truck.svg"
                             alt="Delivery"
                             width={20}
                             height={20} 
                            />
                            <span className="text-[14px] whitespace-nowrap text-[#000087] font-medium">
                               Delivery Available
                            </span>
                          </div>

                          {address.deliverySettings && (
                            <div className="ml-7 text-[13px] text-[#525252] space-y-1">
                             {address.deliverySettings.explanation && (
                              <p className="text-[#868686]">{address.deliverySettings.explanation}</p>
                             )}
                             {address.deliverySettings.dayFrom && address.deliverySettings.daysTo && (
                              <p>
                                <span className="font-[500]">Delivery time:</span> {address.deliverySettings.dayFrom}--{address.deliverySettings.daysTo} days
                              </p>
                             )}
                             {address.deliverySettings.chargeDelivery === 'yes' && 
                              address.deliverySettings.feeFrom && 
                              address.deliverySettings.feeTo && (
                               <p>
                                <span className="font-[500]">Delivery fee:</span> ₦{address.deliverySettings.feeFrom.toLocaleString()} - ₦{address.deliverySettings.feeTo.toLocaleString()}
                               </p>
                              )
                             }
                            </div>
                          )}
                        </div>
                      ): (
                       <div className="flex items-center gap-2 mb-2 
                           bg-[#F7F7FF] w-[108px] h-[36px] rounded-[4px]">
                        <Img 
                          src="/delivery-truck.svg"
                          alt="No Delivery"
                          width={20}
                          height={20}
                        />
                        <span className="text-[14px] text-[#000087] whitespace-nowrap font-medium">
                           No delivery
                         </span>
                       </div>
                      )}
                    </div>
                 </div>
                )
               })}
             </div>
            );
          })()}

          {activeTab === 'ads' && (
            <div>
              {adsLoading ? (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                 </div>
              ): profileData.recentAds.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No ads posted</p>
              ): (
               <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-[#E7E7E7]">
                    <tr>
                      <th className="px-6 py-3 text-left text-[12px] font-[600] text-[#525252] uppercase tracking-wider">
                       Category
                      </th>
                      <th className="px-6 py-3 text-left text-[12px] font-[600] text-[#525252] uppercase tracking-wider">
                        Date Created
                      </th>
                      <th className="px-6 py-3 text-left text-[12px] font-[600] text-[#525252] uppercase tracking-wider">
                        Date Approved
                      </th>
                      <th className="px-6 py-3 text-left text-[12px] font-[600] text-[#525252] uppercase tracking-wider">
                        Ads Status
                      </th>
                      <th className="px-6 py-3 text-left text-[12px] font-[600] text-[#525252] uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {profileData.recentAds.map((ad) => (
                      <tr key={ad._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-[14px] text-[#525252]">
                            {ad.adCategory || ad.category || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-[14px] text-[#525252]">
                          {formatDate(ad.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-[14px] text-[#525252]">
                         {ad.approvedAt ? formatDate(ad.approvedAt) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-[12px] leading-5 font-semibold rounded-full capitalize ${getStatusBadge(ad.status || 'pending')}`}>
                             {ad.status || 'pending'}
                         </span>
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap text-[14px]">
                            <button 
                              onClick={() => router.push(`/admin/ads/${ad._id}`)}
                              className="text-[#00A8DF] hover:text-[#1031AA] font-medium"
                             >
                            View Ad
                        </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
               </div>
              )}
            </div>
          )}

          {/* Verification Tab */}
          {activeTab === 'verification' && (
            <div className="text-center py-8">
                <p className="text-gray-500">Verification details coming soon...</p>
            </div>
          )}

          {/* Subscription Tab */}
          {activeTab === 'subscription' && (
            <div className="text-center py-8">
              <div className="bg-blue-50 p-4 rounded-lg inline-block">
                <p>Current Plan</p>
                <p className="text-[18px] font-bold text-[#0000087] capitalize">
                    {profileData.subscription}
                </p>
              </div>
             </div>
          )}
        </div>
      </div>
        </main>
     </div>
     </div>
    );
}