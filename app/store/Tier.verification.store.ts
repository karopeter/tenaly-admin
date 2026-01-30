import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { 
TierVerification,
} from "../Schema/tier-verification.schema";
import {
  TierVerificationFilters ,
  StatusFilter,
  TierFilter,
  DateFilter
} from "../types/tier-verification.types";

interface TierVerifactionStore {
  // State 
  selectedVerification: TierVerification | null;
  showDetailsModal: boolean;
  actionLoading: boolean;
  filters: TierVerificationFilters;

   // Actions 
   setSelectedVerification: (verification: TierVerification | null) => void;
   setShowDetailsModal: (show: boolean) => void;
   setActionLoading: (loading: boolean) => void;
   setStatusFilter: (status: StatusFilter) => void;
   setTierFilter: (tier: TierFilter) => void;
   setDateFilter: (date: DateFilter) => void;
   setSearchTerm: (search: string) => void;
   clearFilters: () => void;
   openDetailsModal: (verification: TierVerification) => void;
   closeDetailsModal: () => void;
}

const initialFilters: TierVerificationFilters = {
    status: "all",
    tier: "all",
    date: "all",
    search: "",
};

export const useTierVerificationStore = create<TierVerifactionStore>()(
  devtools(
    (set) => ({
     // Initial state 
     selectedVerification: null,
     showDetailsModal: false,
     actionLoading: false,
     filters: initialFilters,

     // Actions 
     setSelectedVerification: (verification) => 
          set({ selectedVerification: verification }, false, "setSelectedVerification"),

     setShowDetailsModal: (show) => 
         set({ showDetailsModal: show }, false, "setShowDetailsModal"),

      setActionLoading: (loading) => 
         set({ actionLoading: loading }, false, "setActionLoading"),

      setStatusFilter: (status) => 
        set(
         (state) => ({
            filters: { ...state.filters, status },
         }),
         false,
         "setStatusFilter"
        ),

        setTierFilter: (tier) => 
            set(
              (state) => ({
                filters: { ...state.filters, tier },
              }),
              false,
              "setTierFilter"
            ),
            
            setDateFilter: (date) => 
                set(
                 (state) => ({
                    filters: { ...state.filters, date },
                 }),
                 false,
                 "setDateFilter"
                ),

          setSearchTerm: (search) => 
            set(
              (state) => ({
               filters: { ...state.filters, search },
              }),
              false,
              "setSearchTerm"
            ),

            clearFilters: () => 
                set({ filters: initialFilters }, false, "clearFilters"),

            openDetailsModal: (verification) => 
                set(
                  {
                   selectedVerification: verification,
                   showDetailsModal: true,
                  },
                  false,
                  "openDetailsModal"
                ),

             closeDetailsModal: () => 
                 set(
                    {
                     selectedVerification: null,
                     showDetailsModal: false,
                    },
                    false,
                    "closeDetailsModal"
                 ),
       }),
       {
        name: "tier-verification-store",
       }
  )  
);