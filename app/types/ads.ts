export interface Business  {
  _id: string;
  userId: string;
  businessName: string;
  category: string;
  createdAt: string;   
}

export interface Ad { 
  _id: string;
  userId: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected' | 'sold';
  createdAt: string;
  approvedAt: string | null;
  title?: string;
  description?: string;
  price?: number;
  images: string[];
  vehicleImage: string[];
  gadgetImage: string[];
  propertyImage: string[];
  businessCategory: string;
  agricultureImage: string[];
  kidsImage: string[];
  petsImage: string[];
  equipmentImage: string[];
  fashionImage: string[];
  laptopImage: string[];
  householdImage: string[];
  constructionImage: string[];
  beautyImage: string[];
  jobImage: string[];
  serviceImage: string[];
  hireImage: string[];
}

export interface User {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  images: string | null;
  role: string;
  businesses: Business[];
  ads: Ad[];
  hireAds: Ad[];
  jobAds: Ad[];
  petAds: Ad[];
  gadgetAds: Ad[];
  equipmentAds: Ad[];
  laptopAds: Ad[];
  kidAds: Ad[];
  agricultureAds: Ad[];
  vehicleAds: Ad[];
  propertyAds: Ad[];
  serviceAds: Ad[];
  constructionAds: Ad[];
  beautyAds: Ad[];
  fashionAds: Ad[];
  householdAds: Ad[];
  totalAds: number;
  isVerified: boolean;
  createdAt: string;
}

export interface UsersResponse {
    users: User[];
}