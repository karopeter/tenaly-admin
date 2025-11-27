export type SubscriptionStatus = "Active" | "Paused";

export interface Subscription {
    user: string;
    subscription: string;
    status: SubscriptionStatus;
    startDate: string;
    endDate: string;
    duration: string;
    payment: string;
}

export interface SubscriptionsTableProps {
    subscriptions?: Subscription[];
}