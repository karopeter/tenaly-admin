import { Settings, LogOut, X } from "lucide-react";
import { SidebarProps } from "@/app/types";
import Img from "./Img";
import { useAuth } from "../context/AuthContext";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/app/lib/constants";

export const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const { logout } = useAuth();
  const pathname = usePathname();

    return (
     <>
      {/* Mobile Overlay - Only on mobile when sidebar is open */}
      {isOpen && (
        <div
         className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
         onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside  className={`
         fixed top-0 left-0 z-50 h-screen w-64 
         overflow-y-auto bg-[#000087] text-[#FFFFFF] 
        transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-indigo-800">
         <div className="flex items-center gap-2">
           <Img 
             src="/tenaly-logo.svg"
             width={94.5}
             height={48}
             alt="Tenaly Logo Image"
           />
         </div>
         {/* X button - Only visible on mobile */}
         <button 
           onClick={() => setIsOpen(false)} 
           className="p-1 hover:bg-indigo-800/50 rounded transition-colors lg:hidden"
         >
          <X className="w-6 h-6" />
         </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {NAV_ITEMS.map((item) => (
            <a
             key={item.name}
             href={item.path}
             className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                pathname === item.path
                ? "bg-indigo-600 text-white"
                : "text-gray-300 hover:bg-indigo-800/50"
             }`}
            >
             <item.icon className="w-5 h-5" />
             <span className="text-sm">{item.name}</span>
             {item.badge && (
               <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {item.badge}
               </span>
             )}
            </a>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 space-y-2 border-t border-indigo-800 mt-10">
          <a href="/settings" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-indigo-800/50 rounded-lg transition-colors">
           <Settings className="w-5 h-5" />
           <span className="text-sm">Settings</span>
          </a>
          <button
           onClick={logout}
            className="flex items-center gap-3 px-4 py-3 
            text-gray-300 hover:bg-indigo-800/50 
            rounded-lg transition-colors w-full">
             <LogOut className="w-5 h-5" />
             <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>
     </>
    );
}