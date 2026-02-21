import React, { useState, useMemo } from "react";
import { 
  IoFlameOutline, 
  IoCheckmarkCircle, 
  IoTimeOutline,
  IoRestaurantOutline
} from "react-icons/io5";

// --- MOCK DATA (Replace with your actual aggregated database query) ---
const initialBatchData = [
  {
    itemId: "item_001",
    name: "Masala Dosa",
    category: "South Indian",
    totalPendingQty: 7,
    orders: [
      { orderId: "ORD-8921", qty: 3, time: "5 mins ago" },
      { orderId: "ORD-8924", qty: 4, time: "2 mins ago" }
    ]
  },
  {
    itemId: "item_002",
    name: "Veg Fried Rice",
    category: "Chinese",
    totalPendingQty: 12,
    orders: [
      { orderId: "ORD-8919", qty: 5, time: "10 mins ago" },
      { orderId: "ORD-8925", qty: 5, time: "Just now" },
      { orderId: "ORD-8927", qty: 2, time: "Just now" }
    ]
  },
  {
    itemId: "item_003",
    name: "Paneer Chilli",
    category: "Chinese",
    totalPendingQty: 2,
    orders: [
      { orderId: "ORD-8920", qty: 2, time: "8 mins ago" }
    ]
  }
];

export const KitchenBatchDashboard = () => {
  const [batches, setBatches] = useState(initialBatchData);

  // Function to mark a specific order's item as prepared
  const handleMarkPrepared = (itemId, orderIdToMark) => {
    setBatches(currentBatches => 
      currentBatches.map(batch => {
        if (batch.itemId === itemId) {
          const updatedOrders = batch.orders.filter(o => o.orderId !== orderIdToMark);
          const newTotalQty = updatedOrders.reduce((sum, o) => sum + o.qty, 0);
          return { ...batch, orders: updatedOrders, totalPendingQty: newTotalQty };
        }
        return batch;
      }).filter(batch => batch.totalPendingQty > 0) // Remove batch entirely if everything is prepared
    );
  };

  const totalItemsToCook = useMemo(() => {
    return batches.reduce((sum, batch) => sum + batch.totalPendingQty, 0);
  }, [batches]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      
      {/* --- HEADER --- */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <span className="w-3 h-8 bg-orange-500 rounded-full"></span>
              Kitchen Prep Station
            </h1>
            <p className="text-slate-500 text-sm mt-1 ml-6 font-medium">Live Batch Preparation Queue</p>
          </div>
          
          <div className="flex items-center gap-3 bg-orange-50 border border-orange-100 px-5 py-2.5 rounded-2xl">
            <IoFlameOutline className="text-orange-500 text-xl animate-pulse" />
            <div className="flex flex-col">
              <span className="text-xs font-bold tracking-wider text-orange-800 uppercase leading-none">Total Portions</span>
              <span className="text-lg font-black text-orange-600 leading-none mt-1 tabular-nums">{totalItemsToCook}</span>
            </div>
          </div>
        </div>
      </header>

      {/* --- MAIN DASHBOARD GRID --- */}
      <main className="max-w-7xl mx-auto px-6 pt-8">
        {batches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-slate-400">
            <IoRestaurantOutline className="text-7xl mb-4 opacity-20" />
            <h3 className="text-xl font-bold text-slate-600">Kitchen is clear!</h3>
            <p className="text-sm">No items currently need preparation.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {batches.map((batch) => (
              <div 
                key={batch.itemId} 
                className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col overflow-hidden transition-all hover:shadow-2xl hover:shadow-slate-200/60"
              >
                
                {/* Batch Header (Shows Total Quantity to Cook) */}
                <div className="bg-slate-900 p-6 flex justify-between items-center text-white relative overflow-hidden">
                  <div className="relative z-10">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-orange-400 mb-1 block">
                      {batch.category}
                    </span>
                    <h2 className="text-xl font-bold truncate pr-4">{batch.name}</h2>
                  </div>
                  
                  <div className="relative z-10 flex flex-col items-center justify-center w-16 h-16 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20 shrink-0">
                    <span className="text-xs font-medium text-slate-300 mb-0.5">QTY</span>
                    <span className="text-2xl font-black text-white leading-none tabular-nums">{batch.totalPendingQty}</span>
                  </div>
                  
                  {/* Decorative background shape */}
                  <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
                </div>

                {/* Batch Details (Shows which orders these belong to) */}
                <div className="p-2 flex-grow bg-slate-50">
                  <div className="bg-white rounded-3xl p-4 border border-slate-100 h-full">
                    <div className="flex items-center gap-2 mb-4 px-2">
                      <IoTimeOutline className="text-slate-400" />
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pending Orders</h4>
                    </div>

                    <div className="space-y-3">
                      {batch.orders.map((order) => (
                        <div 
                          key={order.orderId} 
                          className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-orange-50 hover:border-orange-100 transition-colors group"
                        >
                          <div>
                            <div className="font-bold text-slate-800 text-sm">
                              {order.orderId} <span className="text-orange-500 ml-1">x{order.qty}</span>
                            </div>
                            <div className="text-[10px] font-medium text-slate-400 mt-0.5">
                              Ordered: {order.time}
                            </div>
                          </div>
                          
                          <button 
                            onClick={() => handleMarkPrepared(batch.itemId, order.orderId)}
                            className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-green-500 group-hover:text-white group-hover:border-green-500 transition-all active:scale-90 shadow-sm"
                            title="Mark as Prepared"
                          >
                            <IoCheckmarkCircle className="text-2xl" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};