"use client";

import { useState } from "react";
import { useTierVerificationStore } from "../store/Tier.verification.store";
import { 
 useApproveTierVerification,
 useRejectTierVerification
} from "../hooks/tier-verification";
import {
 formatDate,
 getStatusColor,
 getTierDisplayName,
 dowloadDocument
 } from "../Utils/Tier.verification.utils";
 import { 
  Tier1Verification,
  Tier2Verification,
  Tier3Verification
} from "../Schema/tier-verification.schema";

export const TierVerificationDetailsModal = () => {
    const { selectedVerification, showDetailsModal, closeDetailsModal, 
     actionLoading } = useTierVerificationStore();

     const approveMutation = useApproveTierVerification();
     const rejectMutation = useRejectTierVerification();

     const [rejectionReason, setRejectionReason] = useState("");
     const [showRejectInput, setShowRejectInput] = useState(false);

     if (!showDetailsModal || !selectedVerification) return null;

     const handleApprove = () => {
        if (selectedVerification._id) {
          approveMutation.mutate(selectedVerification._id);
        }
     };

    const handleReject = () => {
        if (selectedVerification._id && rejectionReason.trim()) {
          rejectMutation.mutate({
             verificationId: selectedVerification._id,
             data: { rejectionReason },
          });
          setRejectionReason("");
          setShowRejectInput(false);
        }
    };

  const handleDownload = async (url: string, filename: string) => {
     try {
     await dowloadDocument(url, filename);
     } catch (error) {
       console.error("Download failed:", error);
     }
  };

  const renderTierSpecificDetails = () => {
    switch (selectedVerification.tier) {
        case 1: {
         const tier1 = selectedVerification as Tier1Verification;
         return (
           <>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm text-gray-600">Email:</label>
                <p className="font-medium text-gray-900">{tier1.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Phone number:</label>
                <p>
                  {tier1.phone}
                </p>
              </div>
              <div>
               <label className="text-sm text-gray-600">Valid means of ID:</label>
               <p className="font-medium text-gray-900 capitalize">{tier1.idType}</p>
              </div>
            </div>

            <div className="mb-6">
              <label className="text-sm text-gray-600">Valid means of ID</label>
              <div className="flex items-center justify-between bg-gray-30 rounded-lg mt-2">
                <span className="text-sm text-gray-700">
                  {tier1.idType}.{tier1.idDocument.split(".").pop()}
                </span>
                  <button
                  onClick={() =>
                    handleDownload(tier1.idDocument, `${tier1.idType}-document`)
                  }
                  className="cursor-pointer text-blue-600 hover:text-blue-800 text-sm"
                >
                  View
                </button>
              </div>
            </div>
           </>
         );
        }

        case 2: {
          const tier2 = selectedVerification as Tier2Verification;
          return (
            <>
             <div className="grid grid-cols-2 gap-4 mb-4">
               <div>
                 <label className="text-sm text-gray-600">State:</label>
                 <p className="font-medium text-gray-900">{tier2.state}</p>
               </div>
               <div>
                 <label className="text-sm text-gray-600">LGA:</label>
                 <p className="font-medium text-gray-900">{tier2.lga}</p>
               </div>
               <div>
                 <label className="text-sm text-gray-600">Town:</label>
                 <p className="font-medium text-gray-900">{tier2.town}</p>
               </div>
               <div className="col-span-2">
                <label className="text-sm text-gray-600">Address:</label>
                <p className="font-medium text-gray-900">{tier2.address}</p>
               </div>
             </div>
             <div className="mb-6">
                <label className="text-sm text-gray-600">Utility Bill</label>
                <div className="flex items-center justify-between bg-gray-50 p-3  rounded-lg mt-2">
                  <span className="text-sm text-gray-700">utility-bill.pdf</span>
                  <button
                  onClick={() => handleDownload(tier2.utilityBill, "utility-bill")}
                  className="cursor-pointer text-blue-600 hover:text-blue-800 text-sm"
                >
                  View
                </button>
                </div>
             </div>
            </>
          );
        }

     case 3: {
      const tier3 = selectedVerification as Tier3Verification;
      return (
       <>
        <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-sm text-gray-600">CAC Number:</label>
         <p className="font-medium text-gray-900">{tier3.cacNumber}</p>
        </div>
        <div>
         <label className="text-sm text-gray-600">TIN Number:</label>
         <p className="font-medium text-gray-900">{tier3.tinNumber}</p>
        </div>
        <div className="col-span-2">
         <label className="text-sm text-gray-600">
          Business License Number:
          </label>
         <p className="font-medium text-gray-900">
           {tier3.businessLicenseNumber}
          </p>
        </div>
        </div>

        <div className="space-y-3 mb-6">
          <div>
            <label className="text-sm text-gray-600">CAC Document</label>
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg mt-2">
             <span className="text-sm text-gray-700">cac-document.pdf</span>
             <button
               onClick={() => handleDownload(tier3.cacDocument, "cac-document")}
               className="cursor-pointer text-blue-600 hover:text-blue-800 text-sm"
               >
               View
             </button>
            </div>
          </div>

          {tier3.otherDocument && (
            <div>
              <label className="text-sm text-gray-600">Other Document</label>
              <div className="flex item-center justify-between bg-gray-50 p-3 rounded-lg mt-2">
                <span>other-document.pdf</span>
                 <button
                  onClick={() =>
                        handleDownload(tier3.otherDocument!, "other-document")
                  }
                 className="cursor-pointer text-blue-600 hover:text-blue-800 text-sm"
                 >
                View
              </button>
              </div>
            </div>
          )}
        </div>
       </>
      );
     }

     default: 
      return null;
    }
  };

  const isDisabled = 
    actionLoading || 
    approveMutation.isPending || 
    rejectMutation.isPending || 
    selectedVerification.status !== "pending";

    return (
      <div className="fixed inset-0 bg-black/40 backgrop-blur-sm flex items-center justify-center z-50 p-4">
       <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
         <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Tier Verification Details
          </h2>
          <button
              onClick={closeDetailsModal}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
         </div>
        </div>

        {/* Content */}
        <div className="p-6">
         {/* User Info */}
         <div className="mb-6">
           <label className="text-sm text-gray-600">User:</label>
           <p className="font-medium text-blue-600">
              {selectedVerification.userId?.fullName || <span className="text-gray-400 italic">Deleted user</span>}
            </p>
         </div>

         {/* Tier Level */}
         <div className="mb-6">
           <label className="text-sm text-gray-600">Tier Level:</label>
           <p className="font-medium text-gray-900">
              {getTierDisplayName(selectedVerification.tier)}
            </p>
         </div>

         {/* Tier-specific fields */}
         {renderTierSpecificDetails()}

         {/* Dates and Status */}
         <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-sm text-gray-600">Date submitted:</label>
             <p className="font-medium text-gray-900">
                {formatDate(selectedVerification.createdAt)}
              </p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Approved date:</label>
             <p className="font-medium text-gray-900">
                {selectedVerification.approvedAt
                  ? formatDate(selectedVerification.approvedAt)
                  : "--"}
              </p>
          </div>
         </div>

         {/* Status */}
         <div className="mb-6">
           <label className="text-sm text-gray-600">Status:</label>
           <div className="mt-2">
             <span
                className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                  selectedVerification.status
                )}`}
              >
                {selectedVerification.status.charAt(0).toUpperCase() +
                  selectedVerification.status.slice(1)}
              </span>
           </div>
         </div>

         {/* Rejection Reason (if rejected) */}
         {selectedVerification.status === "rejected" && 
          selectedVerification.rejectionReason && (
           <div className="mb-6 p-4 bg-red-50 rounded-lg">
            <label className="text-sm text-red-600 font-medium">
                  Rejection Reason:
                </label>
            <p className="text-red-800 mt-1">
             {selectedVerification.rejectionReason}
            </p>
            </div>
          )}

          {/* Reject Input */}
          {showRejectInput && selectedVerification.status === "pending" && (
            <div className="mb-6">
              <label className="text-sm text-gray-600 block mb-2">
                Rejection Reason:
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                rows={3}
                placeholder="Enter reason for rejection..."
              />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {selectedVerification.status === "pending" && (
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
             <div className="flex gap-4">
             {!showRejectInput ? (
               <>
                 <button
                    onClick={() => setShowRejectInput(true)}
                    disabled={isDisabled}
                    className="flex-1 px-6 py-3 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {rejectMutation.isPending ? "Rejecting..." : "Reject"}
                  </button>
                   <button
                    onClick={handleApprove}
                    disabled={isDisabled}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {approveMutation.isPending ? "Approving..." : "Approve"}
                  </button>
               </>
             ): (
              <>
                 <button
                    onClick={() => {
                      setShowRejectInput(false);
                      setRejectionReason("");
                    }}
                    disabled={isDisabled}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    Cancel
                  </button>
                   <button
                    onClick={handleReject}
                    disabled={isDisabled || !rejectionReason.trim()}
                    className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {rejectMutation.isPending
                      ? "Rejecting..."
                      : "Confirm Rejection"}
                  </button>
              </>
             )}
            </div>
            </div>
        )}
       </div>
     </div>
    );
};