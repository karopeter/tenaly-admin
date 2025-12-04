export interface UserData {
 _id: string;
 fullName: string;
 email: string;
 phoneNumber: string;
 role: 'buyer' | 'seller' | 'customer' | 'admin';
 image: string | null;
 subscription: 'free' | 'basic' | 'premium' | 'diamond' | 'vip' | 'enterprise';
 isVerified: boolean;
 isSuspended: boolean;
 businessCount: number;
 dateJoined: string;
}

export interface UserFilters {
    search: string;
    subscription: string;
    userType: string;
    status: string;
    [key: string]: string;
}

export interface Pagination {
    page: number;
    limit: number;
    total: number;
    pages?: number;
}

export interface UserProfileData {
    _id: string;
    fullName: string;
      email: string;
    phoneNumber: string;
    role: string;
    image: string | null;
    isGoogleUser: boolean;
    isSuspended: boolean;
    subscription: string;
    walletBalance: number;
    isVerified: boolean;
    hasSubmittedVerification: boolean;
    verificationStatus: {
        personal: 'verified' | 'pending';
        business: 'verified' | 'pending';
    };
    businesses: BusinessInfo[];
    totalAds: number;
    adsByCategory: {
        approved: number;
        pending: number;
        rejected: number;
    };
    recentAds: AdData[];
    dateJoined: string;
    lastLogin: string | null;
}

export interface BusinessInfo {
    _id: string;
    businessName: string;
    businessCategory: string;
    businessDescription: string;
    businessAddress: Array<{
     address: string;
     deliveryAvailable: boolean;
     _id: string;
     deliverySettings?: {
        explanation?: string;
        dayFrom?: number;
        daysTo?: number;
        chargeDelivery?: string;
        feeFrom?: number;
        feeTo?: number;
     };
    }>;
    businessHours: Array<{
      address: string;
      openingTime: string;
      closingTime: string;
      days: string[];
    }>;
    createdAt: string;
}

export interface AdData {
    _id: string;
    adCategory: string;
    title?: string;
    description?: string;
    amount?: number;
    location?: string;
    status: 'approved' | 'pending' | 'rejected';
    createdAt: string;
    approvedAt?: string | null;
    [key: string]: any; 
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
    pagination?: Pagination;
}