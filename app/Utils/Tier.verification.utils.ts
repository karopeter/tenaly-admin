import { 
 format,
 isToday,
 isThisWeek,
 isThisMonth
 } from 'date-fns';
 import {  TierStatus, TierVerification } from '../Schema/tier-verification.schema';
 import { TierVerificationFilters } from '../types/tier-verification.types';

 /**
  * Get Status Badge colors class 
  */
 export const getStatusColor = (status: TierStatus): string => {
    const colorMap: Record<TierStatus, string> = {
       approved: "bg-[#238E15] text-white",
       pending: "bg-[#CAA416] text-white",
       rejected: "bg-[#CB0D0D] text-white",
    };

    return colorMap[status] || "bg-gray-500 text-white";
 };

 /**
  * Get tier level badge color
*/
export const getTierColor = (tier: number): string => {
  const colorMap: Record<number, string> = {
      1: "bg-blue-500 text-white",
      2: "bg-purple-500 text-white",
      3: "bg-indigo-600 text-white",
  };

  return colorMap[tier] || "bg-gray-500 text-white";
};

/**
 * Format date string
 */
export const formatDate = (dateString: string): string => {
    try {
     const date = new Date(dateString);
     return format(date, "dd/MM/yyyy hh:mm a");
    } catch (error) {
      return "Invalid date";
    }
};

/**
 * Check if date matches filter
 */
export const matchesDateFilter = (
  dateString: string,
  filter: "all" | "today" | "week" | "month"
): boolean => {
  if (filter === "all") return true;

  try {
   const date = new Date(dateString);

   switch (filter) {
     case "today":
        return isToday(date);
     case "week":
        return isThisWeek(date);
    case "month": 
       return isThisMonth(date);
    default: 
       return true;
   }
  } catch (error) {
     return false;
  }
};

/**
 * Filter tier verifications based on filters 
 */
export const filterVerifications = (
  verifications: TierVerification[],
  filters: TierVerificationFilters
): TierVerification[] => {
  return verifications.filter((verification) => {
    // Status filter 
    if (filters.status !== "all" && verification.status !== filters.status) {
      return false;
    }

    // Tier filter 
    if (filters.tier !== "all" && verification.tier !== filters.tier) {
        return false;
    }

    // Date filter 
    if (!matchesDateFilter(verification.createdAt, filters.date)) {
      return false;
    }

    // Search filter 
    if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const userName = verification.userId?.fullName?.toLowerCase() || "";
        const userEmail = verification.userId?.email?.toLowerCase() || "";
        const tierLevel = verification.tier.toString();

        return (
          userName.includes(searchLower) || 
          userEmail.includes(searchLower) || 
          tierLevel.includes(searchLower)
        );
    }

    return true;
  });
};

/**
 * Get counts by status 
 */
export const getStatusCounts = (verifications: TierVerification[]) => {
    return verifications.reduce(
        (acc, verification) => {
            acc.total++;
            acc[verification.status]++;
            return acc;
        },
        { total: 0, approved: 0, pending: 0, rejected: 0 }
    );
};

/**
 * Get tier-specific document fields name 
 */
export const getTierDocumentField = (verification: TierVerification): string => {
   switch (verification.tier) {
     case 1:
        return "idDocument";
     case 2:
        return "utilityBill";
     case 3:
        return "cacDocument";
    default:
        return "";
   }
};

/**
 * Get tier display name 
 */
export const getTierDisplayName = (tier: number): string => {
   const names: Record<number, string> = {
     1: "Tier 1 - Basic Verification",
     2: "Tier 2 - Address Verification",
     3: "Tier 3 - Business Verification",
   };

   return names[tier] || `Tier ${tier}`;
};

/**
 * Download document 
 */
export const dowloadDocument = async (url: string, filename: string) => {
     try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);
     } catch (error) {
      console.error("Download error:", error);
      throw new Error("Failed to download document");
     }
};