import { IoPersonOutline, IoTimeOutline, IoCheckmarkCircle, IoCloseCircle } from 'react-icons/io5';
import useOrderManagement from '../../../shared/hooks/useOrderManagement';

const StaffOrderCard = ({ order, orderState }) => {
  const { processOrder, loading } = useOrderManagement();
  
  return (
    <div className="bg-white rounded-[1.5rem] border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
      
      {/* 1. Header: User Info & Order ID */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 rounded-t-[1.5rem]">
        <div className="flex justify-between items-start mb-3">
            <span className="font-extrabold text-slate-900 bg-white px-3 py-1 rounded-md border border-slate-200 text-sm shadow-sm tracking-wider">
                {order.orderUID}
            </span>
            <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                <IoTimeOutline className="text-sm" /> {order.createdAt}
            </span>
        </div>
        
        <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <IoPersonOutline />
            </div>
            <div className="overflow-hidden flex items-center h-10">
                <h4 className="font-bold text-slate-900 text-sm truncate">{order.userName}</h4>
            </div>
        </div>
      </div>

      {/* 2. Body: Receipt Table (KDS Optimized) */}
      <div className="p-4 flex-grow">
         {/* Table Header */}
         <div className="grid grid-cols-[3fr_1fr] text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2 pb-1 border-b border-slate-100">
            <div className="text-left">Item</div>
            <div className="text-center">Qty</div>
         </div>
         
         {/* Items List - BIG FONTS FOR KITCHEN VISIBILITY */}
         <div className="space-y-3 mb-4 overflow-y-auto max-h-[140px] scrollbar-thin scrollbar-thumb-slate-200">
            {order.items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-[3fr_1fr] items-center">
                    <div className="font-extrabold text-slate-900 text-base truncate pr-2">{item.name}</div>
                    <div className="text-center font-bold text-slate-600 text-sm bg-slate-100 rounded-md py-1">x{item.qty}</div>
                </div>
            ))}
         </div>
      </div>

      {/* 3. Footer: Actions */}
      <div className="p-3 border-t border-slate-100 grid grid-cols-2 gap-3 bg-slate-50 rounded-b-[1.5rem]">
        <button 
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-white border border-red-200 text-red-500 py-3 rounded-xl text-xs font-bold hover:bg-red-50 transition">
            <IoCloseCircle className="text-lg"/> mark for review
        </button>
        <button
          disabled={loading}
          // FIX: Direct leapfrog to "READY". Skips "PREPARING".
          onClick={() => {
             if(order.fullfillment_status === 'PENDING') {
                 processOrder(order._id.toString(), "READY");
             }
          }}
          className="flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-xl text-xs font-bold hover:bg-green-600 transition shadow-lg shadow-slate-900/20 uppercase tracking-wide">
            <IoCheckmarkCircle className="text-lg"/> Mark As Ready
        </button>
      </div>
    
    </div>
  );
};

export default StaffOrderCard;