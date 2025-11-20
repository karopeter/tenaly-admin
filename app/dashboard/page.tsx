"use client";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
    const { user, logout, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
          router.push('/');
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
         <div className="min-h-screen flex items-center justify-center">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
         </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
    <div>Welcome to the dashboard</div>
    )
}