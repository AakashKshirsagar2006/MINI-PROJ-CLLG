import React, { useState } from 'react';
import { IoInformationCircleOutline, IoCalendarOutline } from "react-icons/io5";

const RevenueChart = ({ graphData = [] }) => {
  // 1. Calculate the total for the chart header directly from the backend data
  const chartTotal = graphData.reduce((sum, item) => sum + (item.revenue || 0), 0);

  // 2. Dynamic Y-Axis Scaling (Automatically adjusts based on your highest earning month)
  // Default to 1000 if there's no data to prevent visual glitches
  const maxDataValue = Math.max(...graphData.map(d => d.revenue || 0), 1000);
  
  // Calculate a clean "step" for the grid lines (rounds up to the nearest thousand)
  const step = Math.ceil(maxDataValue / 4 / 1000) * 1000; 
  const yAxisLabels = [step * 4, step * 3, step * 2, step * 1, 0];
  const maxValue = step * 4; // Use the top grid line as the 100% height limit

  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Get today's date for the footer
  const formattedDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  // Fallback if the database is completely empty
  if (!graphData || graphData.length === 0) {
      return (
          <div className="w-full h-80 bg-slate-50 rounded-[2.5rem] flex items-center justify-center border border-slate-100">
              <span className="text-slate-400 font-bold">No revenue data available yet.</span>
          </div>
      )
  }

  return (
    <div className="w-full bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-lg shadow-slate-200/50">
      
      {/* ---------------- HEADER ---------------- */}
      <div className="flex flex-col md:flex-row justify-between md:items-end mb-10 gap-4">
        <div>
          <h3 className="text-2xl font-serif font-bold text-slate-900 flex items-center gap-2">
            Revenue Analytics
            <IoInformationCircleOutline className="text-slate-300 text-lg cursor-help hover:text-slate-500 transition" title="Total gross revenue recorded" />
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-medium text-slate-500">Recorded Income</span>
            {/* Formatted perfectly to Indian Rupees */}
            <span className="text-3xl font-bold text-slate-900 tracking-tight">
              ₹{chartTotal.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Removed the Week/Month/Year filters as requested to keep it simple */}
        <div className="flex bg-slate-50 p-1 rounded-xl self-start md:self-auto">
          <button className="px-4 py-2 text-xs font-bold rounded-lg transition-all bg-white text-slate-900 shadow-sm">
            Monthly Overview
          </button>
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
          {graphData.map((item, index) => {
            const heightPercentage = (item.revenue / maxValue) * 100;
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
                    
                    <span className="font-bold text-slate-300 mb-1">{item.monthLabel}</span>
                    <div className="flex justify-between w-full gap-3 border-t border-white/10 pt-1 mt-1">
                      <span>Revenue</span>
                      <span className="font-bold">₹{(item.revenue || 0).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                {/* THE BAR */}
                <div 
                  className={`w-2 md:w-6 lg:w-8 rounded-t-xl transition-all duration-500 ease-out relative overflow-hidden
                    ${isHovered ? 'bg-orange-500 shadow-lg shadow-orange-500/30 -translate-y-1' : 'bg-slate-200'}`}
                  style={{ height: `${heightPercentage * 0.85}%` }} // Scaling down slightly to fit grid
                >
                  {/* Gradient Overlay for 3D effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>

                {/* X-AXIS LABEL (e.g., "Jan", "Feb") */}
                <span className={`absolute -bottom-6 text-[10px] md:text-xs font-bold transition-colors duration-300
                  ${isHovered ? 'text-orange-600 scale-110' : 'text-slate-400'}`}>
                  {item.monthLabel}
                </span>

                {/* Vertical Hover Guide Line */}
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
                <span>Active Revenue</span>
            </div>
        </div>
        <div className="flex items-center gap-1 font-medium">
            <IoCalendarOutline />
            Live Database Sync • {formattedDate}
        </div>
      </div>

    </div>
  );
};

export default RevenueChart;