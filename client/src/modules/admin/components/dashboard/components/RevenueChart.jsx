import React, { useState } from 'react';
import { IoInformationCircleOutline, IoTrendingUp, IoCalendarOutline } from "react-icons/io5";

const RevenueChart = () => {
  // Mock Data: 12 data points for a "Yearly" view or "Hourly" view
  const data = [
    { label: "Jan", value: 45000, orders: 120 },
    { label: "Feb", value: 32000, orders: 98 },
    { label: "Mar", value: 55000, orders: 145 },
    { label: "Apr", value: 48000, orders: 110 },
    { label: "May", value: 62000, orders: 160 },
    { label: "Jun", value: 58000, orders: 155 },
    { label: "Jul", value: 72000, orders: 185 },
    { label: "Aug", value: 68000, orders: 170 },
    { label: "Sep", value: 52000, orders: 130 },
    { label: "Oct", value: 49000, orders: 125 },
    { label: "Nov", value: 75000, orders: 195 },
    { label: "Dec", value: 85000, orders: 210 },
  ];

  // Calculate scaling
  const maxValue = Math.max(...data.map(d => d.value));
  const yAxisLabels = [80000, 60000, 40000, 20000, 0]; // Manual steps for cleaner grid

  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="w-full bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-lg shadow-slate-200/50">
      
      {/* ---------------- HEADER ---------------- */}
      <div className="flex flex-col md:flex-row justify-between md:items-end mb-10 gap-4">
        <div>
          <h3 className="text-2xl font-serif font-bold text-slate-900 flex items-center gap-2">
            Revenue Analytics
            <IoInformationCircleOutline className="text-slate-300 text-lg cursor-help hover:text-slate-500 transition" title="Net revenue after taxes" />
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-medium text-slate-500">Total Income</span>
            <span className="text-3xl font-bold text-slate-900 tracking-tight">₹7,01,000</span>
            <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
              <IoTrendingUp /> +14.2%
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex bg-slate-50 p-1 rounded-xl self-start md:self-auto">
          {['Week', 'Month', 'Year'].map((filter, idx) => (
             <button key={filter} className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${idx === 2 ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
               {filter}
             </button>
          ))}
        </div>
      </div>


      {/* ---------------- CHART AREA ---------------- */}
      <div className="relative h-80 w-full">
        
        {/* Y-AXIS LABELS & GRID LINES */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-xs font-medium text-slate-400">
          {yAxisLabels.map((label, i) => (
            <div key={i} className="flex items-center w-full relative h-0">
              {/* Label */}
              <span className="w-12 text-right pr-3 tabular-nums opacity-60">
                {label >= 1000 ? `${label/1000}k` : label}
              </span>
              {/* Grid Line */}
              <div className="flex-1 h-px bg-slate-100 border-t border-dashed border-slate-200"></div>
            </div>
          ))}
        </div>

        {/* BARS CONTAINER */}
        <div className="absolute inset-0 flex items-end justify-between pl-14 pr-2 pb-6">
          {data.map((item, index) => {
            const heightPercentage = (item.value / maxValue) * 100;
            const isHovered = hoveredIndex === index;

            return (
              <div 
                key={index} 
                className="relative flex flex-col items-center justify-end h-full w-full group"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                
                {/* TOOLTIP (Appears on Hover) */}
                <div className={`absolute bottom-full mb-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none transition-all duration-300 ease-out origin-bottom
                    ${isHovered ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2'}`}>
                    
                    <div className="bg-slate-900 text-white text-[10px] md:text-xs p-3 rounded-xl shadow-xl flex flex-col items-center min-w-[100px] relative">
                        {/* Triangle Arrow */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></div>
                        
                        <span className="font-bold text-slate-300 mb-1">{item.label} Stats</span>
                        <div className="flex justify-between w-full gap-3 border-t border-white/10 pt-1 mt-1">
                            <span>Revenue</span>
                            <span className="font-bold">₹{item.value.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between w-full gap-3">
                            <span>Orders</span>
                            <span className="font-bold text-orange-400">{item.orders}</span>
                        </div>
                    </div>
                </div>

                {/* THE BAR */}
                {/* - We use 'h-[X%]' to set height based on data.
                   - 'max-h-[85%]' ensures it doesn't hit the very top label.
                */}
                <div 
                  className={`w-2 md:w-6 lg:w-8 rounded-t-xl transition-all duration-500 ease-out relative overflow-hidden
                    ${isHovered ? 'bg-orange-500 shadow-lg shadow-orange-500/30 -translate-y-1' : 'bg-slate-200'}`}
                  style={{ height: `${heightPercentage * 0.85}%` }} // Scaling down slightly to fit grid
                >
                    {/* Gradient Overlay for 3D effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>

                {/* X-AXIS LABEL */}
                <span className={`absolute -bottom-6 text-[10px] md:text-xs font-bold transition-colors duration-300
                    ${isHovered ? 'text-orange-600 scale-110' : 'text-slate-400'}`}>
                  {item.label}
                </span>

                {/* Vertical Hover Guide Line (Optional, adds "Graph" feel) */}
                <div className={`absolute top-0 bottom-0 w-px bg-orange-500/10 -z-10 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>

              </div>
            );
          })}
        </div>
      </div>

      {/* ---------------- FOOTER / LEGEND ---------------- */}
      <div className="mt-4 pt-6 border-t border-slate-50 flex justify-between items-center text-xs text-slate-400">
        <div className="flex gap-6">
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span>Current Period</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-slate-200 rounded-full"></div>
                <span>Projected</span>
            </div>
        </div>
        <div className="flex items-center gap-1 font-medium">
            <IoCalendarOutline />
            Last updated: Today, 2:30 PM
        </div>
      </div>

    </div>
  );
};

export default RevenueChart;