"use client";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "../reusables/Sidebar";
import { Header } from "../reusables/Header";


export default function Subscription() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(true);


    
  useEffect(() => {
    const handleResize = () => {
        if (window.innerWidth >= 1024) {
            // Desktop: sidebar open by default 
            setSidebarOpen(true);
        } else {
            setSidebarOpen(false);
        }
    };

    handleResize();

    // Listen for window resize 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

 
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
     <div className="flex min-h-screen bg-[#FFFFFF]">
       <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

       <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
         <Header isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

         <main className="p-6">
           <h1 className="text-[#525252]">Subscription</h1>
         </main>
       </div>
     </div>
    )
}