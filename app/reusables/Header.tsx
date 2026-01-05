import {
  Bell, 
  Search,  
  Menu 
} from "lucide-react";
import { HeaderProps } from "../types";
import { useAuth } from "../context/AuthContext";

export const Header = ({ isOpen, setIsOpen }: HeaderProps) => {
  const { user } = useAuth();
  

    return (
     <header className="bg-[#FAFAFA] border-b border-[#E8E8FF] sticky top-0 z-30">
      <div className="flex items-center justify-between px-6 py-4 gap-4">
       {/* Left Side - Hamburger */}
       <div className="flex items-center">
         <button 
          onClick={() => setIsOpen(!isOpen)}  
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Toggle sidebar">
          <Menu className="w-6 h-6 text-gray-700" />
         </button>
       </div>

       {/* Center - Search Bar */}
       <div className="flex-1 flex justify-center max-w-2xl mx-auto">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
           type="text"
           placeholder="Search..."
           className="w-full pl-10 pr-4 py-2 border border-gray-300 
           rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
       </div>

       {/* Right Side - Notification & User Profile */}
       <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button className="p-2 hover:bg-gray-100 rounded-lg relative transition-colors">
          <Bell className="w-5 h-5 text-[#767676]" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#000087] rounded-full"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-1 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors">
         <div className="hidden md:block">
             <p className="text-[16px] font-[500] text-[#525252]">
              {user?.fullName || "Loading..."}
             </p>
             <p className="text-[#5B5B5B] font-[400] text-[14px]">
               {user?.email || ""}
             </p>
              <p className="text-xs text-gray-500">
                {user?.role || ""}
              </p>
         </div>
        </div>
       </div>
      </div>
     </header>
    );
};