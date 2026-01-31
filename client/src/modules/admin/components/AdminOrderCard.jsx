import { IoPersonOutline, IoMailOutline, IoTimeOutline, IoCheckmarkCircle, IoCloseCircle } from 'react-icons/io5';

const AdminOrderCard = ({ order }) => {
  return (
    <div className="bg-white rounded-[1.5rem] border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
      
      {/* 1. Header: User Info & Order ID */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 rounded-t-[1.5rem]">
        <div className="flex justify-between items-start mb-3">
            <span className="font-bold text-slate-900 bg-white px-2 py-1 rounded-md border border-slate-200 text-xs shadow-sm">
                {order.orderUID}
            </span>
            <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                <IoTimeOutline /> {order.createdAt}
            </span>
        </div>
        
        <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <IoPersonOutline />
            </div>
            <div className="overflow-hidden">
                <h4 className="font-bold text-slate-900 text-sm truncate">{order.userName}</h4>
                <div className="flex items-center gap-1 text-xs text-slate-500 truncate">
                    <IoMailOutline /> {order.userEmail}
                </div>
            </div>
        </div>
      </div>

      {/* 2. Body: Receipt Table (Compact) */}
      <div className="p-4 flex-grow">
         {/* Table Header */}
         <div className="grid grid-cols-[2fr_1fr_1fr] text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2 pb-1 border-b border-slate-100">
            <div className="text-left">Item</div>
            <div className="text-center">Qty</div>
            <div className="text-right">Price</div>
         </div>
         
         {/* Items List */}
         <div className="space-y-2 mb-4 overflow-y-auto max-h-[120px] scrollbar-thin scrollbar-thumb-slate-200">
            {order.items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-[2fr_1fr_1fr] text-xs items-center">
                    <div className="font-bold text-slate-700 truncate pr-1">{item.name}</div>
                    <div className="text-center text-slate-500">x{item.qty}</div>
                    <div className="text-right font-bold text-slate-900">₹{item.price * item.qty}</div>
                </div>
            ))}
         </div>

         {/* Total */}
         <div className="flex justify-between items-center pt-3 border-t border-dashed border-slate-200">
            <span className="text-xs font-bold text-slate-400 uppercase">Total Bill</span>
            <span className="text-xl font-bold text-slate-900">₹{order.amount}</span>
         </div>
      </div>

      {/* 3. Footer: Actions */}
      {/* <div className="p-3 border-t border-slate-100 grid grid-cols-2 gap-3 bg-slate-50 rounded-b-[1.5rem]">
        <button className="flex items-center justify-center gap-2 bg-white border border-red-200 text-red-500 py-2.5 rounded-xl text-xs font-bold hover:bg-red-50 transition">
            <IoCloseCircle className="text-lg"/> Refund/Reject
        </button>
        <button className="flex items-center justify-center gap-2 bg-slate-900 text-white py-2.5 rounded-xl text-xs font-bold hover:bg-green-600 transition shadow-lg shadow-slate-900/20">
            <IoCheckmarkCircle className="text-lg"/> Accept Order
        </button>
      </div> */}

    </div>
  );
};

export default AdminOrderCard;