import { IoPersonOutline, IoTimeOutline, IoCheckmarkCircle } from 'react-icons/io5';
import useOrderManagement from '../../../shared/hooks/useOrderManagement';

const ReadyOrderCard = ({ order, orderState }) => {
  const { fullfillOrder, loading } = useOrderManagement();
  
  return (
    <div className="bg-white rounded-[1.5rem] border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full border-l-4 border-l-green-500">
      
      {/* 1. Header: User Info & Order ID */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 rounded-t-[1.5rem]">
        <div className="flex justify-between items-start mb-3">
            <span className="font-extrabold text-white bg-green-500 px-3 py-1 rounded-md border border-green-600 text-sm shadow-sm tracking-wider">
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

      {/* 3. Footer: Actions (NO OTP REQUIRED) */}
      <div className="p-3 border-t border-slate-100 grid grid-cols-1 gap-3 bg-slate-50 rounded-b-[1.5rem]">
        <button
          disabled={loading}
          onClick={() => {
             if(order.fullfillment_status === 'READY') {
                 // Passing a dummy string so the frontend hook doesn't break, 
                 // but backend will just serve it without checking.
                 fullfillOrder(order._id.toString(), "NO_OTP");
             }
          }}
          className="flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-xl text-sm font-extrabold hover:bg-green-600 transition shadow-lg shadow-slate-900/20 uppercase tracking-widest">
            <IoCheckmarkCircle className="text-xl"/> Serve Order
        </button>
      </div>
    
    </div>
  );
};

export default ReadyOrderCard;