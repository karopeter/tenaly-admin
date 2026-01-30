import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { tierVerificationService } from "@/services/verification.service";
import {
 TierVerificationsResponse,
 ApproveRejectRequest
 } from "../Schema/tier-verification.schema";
 import { useTierVerificationStore } from "../store/Tier.verification.store";

 // Query Keys 
 export const tierVerificationKeys = {
  all: ["tier-verifications"] as const,
  lists: () => [...tierVerificationKeys.all, "list"] as const,
  list: (filters: { tier?: number; status?: string }) => 
     [...tierVerificationKeys.lists(), filters] as const,
  details: () => [...tierVerificationKeys.all, "details"] as const,
  detail: (id: string) => [...tierVerificationKeys.details(), id] as const,
 };

 /**
  * Hooks to fetch all tier verifications 
  */
 export const useGetAllVerifications = (params?: {
    tier?: number;
    status?: string;
 }) => {
   return useQuery<TierVerificationsResponse, Error>({
     queryKey: tierVerificationKeys.list(params || {}),
     queryFn: () => tierVerificationService.getAllVerifications(params),
     staleTime: 1000 * 60 * 5,
     refetchOnWindowFocus: true,
   });
 };

 /**
  * Hooks to approve tier verification 
*/
export const useApproveTierVerification = () => {
  const queryClient = useQueryClient();
  const { setActionLoading, closeDetailsModal }  = useTierVerificationStore();

  return useMutation({
     mutationFn: (verificationId: string) => 
        tierVerificationService.approveVerification(verificationId),
     onMutate: () => {
       setActionLoading(true);
     },
     onSuccess: (data) => {
      // Invalidate all tier verification queries to refetch 
      queryClient.invalidateQueries({
        queryKey: tierVerificationKeys.lists(),
      });
      
      toast.success(data.message || "Verification approved successfully!");
      closeDetailsModal();
     },
     onError: (error: any) => {
        const errorMessage  = 
          error?.response?.data?.message || 
          error.message || 
          "Failed to approve verification";
        toast.error(errorMessage);
     },
  });
};


/** 
 * Hook to reject thier verification 
 */
export const useRejectTierVerification = () => {
  const queryClient = useQueryClient();
  const { setActionLoading, closeDetailsModal } = useTierVerificationStore();

  return useMutation({
    mutationFn: ({
     verificationId,
     data,
    }: {
     verificationId: string;
     data: ApproveRejectRequest;
    }) => tierVerificationService.rejectVerification(verificationId, data),
    onMutate: () => {
      setActionLoading(false);
    },
    onSuccess: (data) => {
        // Invalidate all tier verfification queries to refetch 
        queryClient.invalidateQueries({
          queryKey: tierVerificationKeys.lists(),
        });

        toast.success(data.message || "Verification rejected successfully!");
        closeDetailsModal();
    },
    onError: (error: any) => {
      const errorMessage = 
        error?.response?.data?.message || 
        error.message || 
        "Failed to reject verification";
        toast.error(errorMessage);
    },
    onSettled: () => {
      setActionLoading(false);
    },
  });
};
