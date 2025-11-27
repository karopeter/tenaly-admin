export interface UserProfile {
    name: string;
    role: string;
    avatar?: string;
}

export interface BusinessVerificationItem {
    name: string;
    date: string;
    avatar?: string;
}

export interface BusinessVerificationProps {
    items?: BusinessVerificationItem[];
}