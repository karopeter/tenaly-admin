import { TierVerification } from "../Schema/tier-verification.schema";

export type StatusFilter = "all" | "approved" | "pending" | "rejected";
export type TierFilter = "all" | 1 | 2 | 3;
export type DateFilter = "all" | "today" | "week" | "month";

export interface TierVerificationFilters {
  status: StatusFilter
  tier: TierFilter;
  date: DateFilter;
  search: string;
}


export interface TierVerificationState {
  selectedVerification: TierVerification | null;
  showDetailsModal: boolean;
  actionLoading: boolean;
  filters: TierVerificationFilters;
}