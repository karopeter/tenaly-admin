
import { StatCardProps } from "../types";
import Img from "./Img";


export const StatsCard = ({ title, value, change, icon: Icon, iconBg, iconColor }: StatCardProps) => {
   return (
    <div className="bg-[#FAFAFA] rounded-[8px] border border-[#EEEEEE] md:h-[115px] 
             pt-[12px] pr-[16px] pb-[12px] pl-[16px]">
      <div className="flex items-start justify-between">
       <div>
         <p className="text-[#525252] font-[600] text-[16px]">{title}</p>
         <h3 className="text-[24px] font-[500] text-[#000087]">{value}</h3>
         <div className="flex items-center mt-4 gap-2">
            <Img 
              src="/longie.svg"
              alt="Longie Image"
              width={16.67}
              height={10}
            />
            <p className="text-[14px] font-[400] text-[#262626] whitespace-nowrap">{change}</p>
         </div>
       </div>
       <div className={`${iconBg} ${iconColor} rounded-xl`}>
        <Icon className="w-6 h-6" />
       </div>
      </div>
    </div>
   );
};