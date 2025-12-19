export interface UserStats {
  totalUsers: number;
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