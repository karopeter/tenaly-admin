import React from 'react';
import { 
 LineChart, 
 Line, 
 XAxis, 
 YAxis, 
 CartesianGrid,
 Tooltip,
 ResponsiveContainer, 
 Area,
 AreaChart
} from 'recharts';
import { TrendingUp } from 'lucide-react';

const revenueData = [
 { month: 'Jan', revenue: 450000 },
  { month: 'Feb', revenue: 520000 },
  { month: 'Mar', revenue: 480000 },
  { month: 'Apr', revenue: 350000 },
  { month: 'May', revenue: 580000 },
  { month: 'Jun', revenue: 700000 },
  { month: 'Jul', revenue: 620000 },
  { month: 'Aug', revenue: 242050 },
  { month: 'Sep', revenue: 580000 },
  { month: 'Oct', revenue: 520000 },
  { month: 'Nov', revenue: 650000 },
  { month: 'Dec', revenue: 680000 },
];

// Custom Tooltip Component 
const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
       <div className='bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-200'>
        <p className='text-sm font-semibold text-gray-800'>
          ₦{payload[0].value.toLocaleString()}
        </p>
       </div>
      );
    }
    return null;
};

const RevenueGraph = () => {
    const totalRevenue = 700000;
    const percentageChange = 12;

    return (
     <div className='bg-white p-6 rounded-lg shadow-md border border-[#EDEDED]'>
      {/* Header Section */}
      <div className='mb-6'>
       <div className='flex items-start justify-between'>
         <div className='flex flex-row gap-4 items-center'>
            <h3 className='text-[#525252] font-[600] text-[16px]'>Total Revenue:</h3>
            <p className='text-[#000087] font-[500] text-[24px]'>
             ₦{totalRevenue.toLocaleString()}   
            </p>
         </div>
         <div className='flex items-center gap-1 text-sm text-green-600'>
          <TrendingUp className="w-4 h-4 text-[#5555DD]" />
          <span className='text-[14px] font-[400] text-[#394CD9]'>+{percentageChange}%</span>
          <span className='text-[#525252] font-[400] text-[14px]'>from last 28 days</span>
         </div>
       </div>
      </div>

       {/* Graph Section */}
       <div className='w-full h-[300px] border border-[#EDEDED] rounded-lg p-4'>
         <ResponsiveContainer width="100%" height="100%">
           <AreaChart
            data={revenueData}
            margin={{ 
             top: 10, 
             right: 10,
             left: 0,
             bottom: 0
            }}
           >
            <defs>
             <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
               <stop offset="5%" stopColor="#899DFF" stopOpacity={0.3}/>
               <stop offset="95%" stopColor="#BFFFCC" stopOpacity={8}/>
             </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#red" vertical={false} />
            <XAxis 
             dataKey="month"
             axisLine={false}
             tickLine={false}
             tick={{ fill: '#9ca3af', fontSize: 12 }}
             dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              tickFormatter={(value) => `₦${(value / 1000)}k`}
              dx={10}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
             type="monotone"
             dataKey="revenue"
             stroke="#6366f1"
             strokeWidth={2}
             fill="url(#colorRevenue)"
             dot={{ fill: '#899DFF', r: 4, strokeWidth: 0 }}
             activeDot={{ r: 6, fill: '#6366f1' }}
            />
           </AreaChart>
         </ResponsiveContainer>
       </div>
     </div>
    );
}

export default RevenueGraph;