import React from 'react';
import { IoReceiptOutline, IoCheckmarkCircle, IoFastFoodOutline, IoTimeOutline } from "react-icons/io5";

const CurrentOrderCard = ({ activeOrder }) => {
  
 
  const status = activeOrder?.fullfillment_status || "PENDING";

  // Check stages
  const isPreparing = status === "PREPARING" || status === "READY" || status === "SERVED";
  const isReady = status === "READY" || status === "SERVED";

  // Dynamic Progress Bar Width
  let progressWidth = "w-0"; 
  if (isReady) progressWidth = "w-full";
  else if (isPreparing) progressWidth = "w-1/2";

  // Dynamic Colors
  const progressColor = isReady ? "bg-green-500" : "bg-orange-500";

  // ------------------ 
  //  CALCULATE TOTAL 
  // ------------------
  const grandTotal = activeOrder?.items?.reduce((acc, item) => acc + (item.qty * item.price), 0) || 0;

  return (
    <>
      {/* Main Card */}
      <div className="bg-white rounded-4xl border border-slate-300 shadow-xl shadow-slate-200/60 overflow-hidden relative">
        

        <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                    <IoReceiptOutline className="text-xl" />
                </div>
            </div>
            {/* ORDER UID */}
            <div className="text-left">
                <p className="text-xs text-slate-400 font-bold uppercase">Order-UID</p>
                <p className="text-xl font-bold text-slate-900 tracking-widest">{activeOrder?.orderUID || "---"}</p>
            </div>
            {/* OTP Badge */}
            <div className="text-right">
                <p className="text-xs text-slate-400 font-bold uppercase">Order-OTP</p>
                <p className="text-xl font-bold text-slate-900 tracking-widest">{activeOrder?.orderOTP || "---"}</p>
            </div>
        </div>

        {/*================ 
        BILL TABLE SECTION 
        ===================*/}
        <div className="p-6 md:p-8">
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr] text-xs font-bold text-slate-400 uppercase tracking-wide mb-4 pb-2 border-b border-slate-100">
                <div className="text-left">Item</div>
                <div className="text-center">Qty</div>
                <div className="text-right">Price</div>
                <div className="text-right">Total</div>
            </div>

            {/* Table Rows */}
            <div className="space-y-4 mb-6">
                {activeOrder?.items?.map((item, index) => (
                    <div key={index} className="grid grid-cols-[2fr_1fr_1fr_1fr] text-sm items-center">
                        <div className="font-bold text-slate-800 truncate pr-2">{item.name}</div>
                        <div className="text-center font-medium text-slate-500">x{item.qty}</div>
                        <div className="text-right text-slate-500">₹{item.price}</div>
                        <div className="text-right font-bold text-slate-900">₹{item.price * item.qty}</div>
                    </div>
                ))}
            </div>

            {/* Grand Total */}
            <div className="border-t-2 border-dashed border-slate-200 pt-4 flex justify-end">
                <div className="text-right">
                    <p className="text-xs text-slate-400 font-bold uppercase">Grand Total</p>
                    <p className="text-2xl font-bold text-slate-900">₹{grandTotal}</p>
                </div>
            </div>
        </div>

        {/* --------------------------------
        3-STEP STATUS SECTION (Bottom) 
        --------------------------------- */}
        <div className="bg-slate-900 p-6 md:px-8 text-white">
            
            {/* Status Header */}
            <div className="flex items-center justify-between mb-8">
                <p className="text-sm font-medium text-slate-300">Order Status</p>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    isReady ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'
                }`}>
                    {status}
                </span>
            </div>

            {/* Visualization Container */}
            <div className="relative mb-2">
                
                {/* 1. Background Track (Gray) */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-700 -translate-y-1/2 rounded z-0"></div>

                {/* 2. Progress Fill (Colored) */}
                <div className={`absolute top-1/2 left-0 h-1 -translate-y-1/2 rounded z-0 transition-all duration-700 ease-out ${progressColor} ${progressWidth}`}></div>

                {/* 3. Steps Icons */}
                <div className="relative z-10 flex justify-between w-full">
                    
                    {/* PENDING */}
                    <div className="flex flex-col items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors border-[3px] border-slate-900 bg-orange-500 text-white`}>
                            <IoTimeOutline />
                        </div>
                        <span className="text-[10px] md:text-xs font-bold uppercase tracking-wide text-white">
                            Pending
                        </span>
                    </div>

                    {/* PREPARING */}
                    <div className="flex flex-col items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors border-[3px] border-slate-900 
                            ${isPreparing ? 'bg-orange-500 text-white' : 'bg-slate-700 text-slate-500'}`}>
                            <IoFastFoodOutline />
                        </div>
                        <span className={`text-[10px] md:text-xs font-bold uppercase tracking-wide transition-colors ${isPreparing ? 'text-white' : 'text-slate-500'}`}>
                            Preparing
                        </span>
                    </div>

                    {/* STEP 3: READY */}
                    <div className="flex flex-col items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors border-[3px] border-slate-900 
                            ${isReady ? 'bg-green-500 text-white' : 'bg-slate-700 text-slate-500'}`}>
                            <IoCheckmarkCircle />
                        </div>
                        <span className={`text-[10px] md:text-xs font-bold uppercase tracking-wide transition-colors ${isReady ? 'text-green-400' : 'text-slate-500'}`}>
                            Ready
                        </span>
                    </div>

                </div>
            </div>

        </div>
      </div>
    </>
  );
};

export default CurrentOrderCard;