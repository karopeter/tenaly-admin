import api from "./api";
import { 
  TierVerificationsResponse,
  TierVerificationsResponseSchema,
  ApproveRejectRequest,
 } from "@/app/Schema/tier-verification.schema";
/**
 * Tier Verification API Service 
 * Handles all tier verification related API calls with Zod validation 
 */
class TierVerificationService {
 private readonly basePath = "/tier-verification";

 /**
  * Get all tier verifications with optional filters 
  */
 async getAllVerifications(params?: {
    tier?: number;
    status?: string;
 }): Promise<TierVerificationsResponse> {
   try {
    const response = await api.get(`${this.basePath}/admin/all-tier-verification`, {
      params,
    });

    // Validate response with Zod 
    const validatedData = TierVerificationsResponseSchema.parse(response.data);
    return validatedData;
   } catch (error) {
     console.error("Get verifications error:", error);
     throw error;
   }
 }

 /** 
  * Approve a tier verification
  */
 async approveVerification(verificationId: string): Promise<{
   message: string;
   data: any;
 }> {
  try {
   const response = await api.patch(
    `${this.basePath}/admin/approve/${verificationId}`
   );


   return {
    message: response.data.message,
    data: response.data.data,
   };
  } catch (error) {
     console.error("Approve verification error:", error);
     throw error;
  }
 }

 /**
  * Reject a tier verification 
  */

 async rejectVerification(
   verificationId: string,
   data: ApproveRejectRequest
 ): Promise<{
   message: string;
   data: any
 }> {
   try {
    const response = await api.patch(
        `${this.basePath}/admin/reject/${verificationId}`,
        data
    );

    return {
      message: response.data.message,
      data: response.data.data,
    }
   } catch (error) {
     console.error("Reject verification error:", error);
     throw error;
   }
 }
}

export const tierVerificationService = new TierVerificationService();