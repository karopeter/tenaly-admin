import { z } from 'zod';

// User Schema 
export const UserSchema = z.object({
    _id: z.string(),
    fullName: z.string(),
    email: z.string().email(),
    id: z.string(),
});

// Tier Verification Status Enum 
export const TierStatusSchema = z.enum(["pending", "approved", "rejected"]);

// Base Tier Verification Schema 
const BaseTierVerificationSchema = z.object({
  _id: z.string(),
  userId: UserSchema.nullable(),
  tier: z.number().int().min(1).max(3),
  status: TierStatusSchema,
  createdAt: z.string(),
  approvedAt: z.string().optional().nullable(),
  approvedBy: z.string().optional().nullable(),
  rejectionReason: z.string().optional().nullable(),
  __v: z.number().optional(),
});

// Tier 1 Verification Schema 
export const Tier1VerificationSchema = BaseTierVerificationSchema.extend({
     tier: z.literal(1),
     email: z.string().email(),
     phone: z.string(),
     idType: z.string(),
     idDocument: z.string().url(),
});

// Tier 2 Verification Schema 
export const Tier2VerificationSchema = BaseTierVerificationSchema.extend({
    tier: z.literal(2),
    state: z.string(),
    lga: z.string(),
    address: z.string(),
    town: z.string(),
    utilityBill: z.string().url(),
});

// Tier 3 Verification Schema 
export const Tier3VerificationSchema = BaseTierVerificationSchema.extend({
    tier: z.literal(3),
    cacNumber: z.string(),
    tinNumber: z.string(),
    businessLicenseNumber: z.string(),
    cacDocument: z.string().url(),
    otherDocument: z.string().url().optional().nullable(),
});

// Union type for any tier verification 
export const TierVerificationSchema = z.discriminatedUnion("tier", [
  Tier1VerificationSchema,
  Tier2VerificationSchema,
  Tier3VerificationSchema, 
]);


// API Response Schema
export const TierVerificationsResponseSchema = z.object({
  success: z.boolean(),
  count: z.number(),
  data: z.array(TierVerificationSchema),
});

// Approve/Reject Request Schema
export const ApproveRejectRequestSchema = z.object({
  rejectionReason: z.string().optional(),
});


export type User = z.infer<typeof UserSchema>;
export type TierStatus = z.infer<typeof TierStatusSchema>;
export type Tier2Verification = z.infer<typeof Tier2VerificationSchema>;
export type Tier3Verification = z.infer<typeof Tier3VerificationSchema>;
export type Tier1Verification = z.infer<typeof Tier1VerificationSchema>;
export type TierVerification = z.infer<typeof TierVerificationSchema>;
export type TierVerificationsResponse = z.infer<typeof TierVerificationsResponseSchema>;
export type ApproveRejectRequest = z.infer<typeof ApproveRejectRequestSchema>;

