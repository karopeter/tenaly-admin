export interface VerificationData {
    verificationId: string;
    verificationType: "personal" | "business";
    status: "pending" | "verified" | "rejected";
    dateSubmitted: string;
    dateApproved: string | null;
    dateRejected: string | null;
    rejectionReason: string | null;
    validIdType?: string;
    validIdFile?: string;
    businessName?: string;
    businessAddress?: string;
    businessEmail?: string;
    businessPhoneNumber?: string;
    businessCertificate?: string;
}

export interface UserVerification {
    userId: string;
    fullName: string;
    email: string;
    verificationTypesSummary: string;
    totalVerifications: number;
    verifications: VerificationData[];
}