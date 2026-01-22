export interface UserStats {
  totalUsers: number;
  totalAds: number;
  subscribedUsers: number;
  roleBreakdown: {
    buyer: number;
    seller: number;
    admin: number;
    customer?: number;
  };
  providerBreakdown: {
    local: number;
    google: number;
  };
  verifiedUsers: number;
  completeProfiles: number;
  recentActivity: {
    today: number;
    last7Days: number;
    last30Days: number;
  };
}