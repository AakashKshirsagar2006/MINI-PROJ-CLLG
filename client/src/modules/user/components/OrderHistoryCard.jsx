import { IoTimeOutline, IoCheckmarkCircle, IoReaderOutline, IoRefresh, IoChevronForward } from "react-icons/io5";

const OrderHistoryCard = ({ order}) => {
  return (
    <div
      // Changed: Reduced width (w-[280px]), padding (p-4), and border-radius (rounded-[1.5rem])
      className="snap-center md:snap-start shrink-0 w-[75vw] md:w-[280px] bg-white p-4 rounded-[1.5rem] border border-slate-200 shadow-sm flex flex-col gap-3 hover:shadow-lg hover:border-orange-100 transition duration-300 cursor-pointer"
    >

      {/* Top Row */}
      <div className="flex justify-between items-start">
  
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center 
                        ${order.status === 'Completed' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
          {order.status === 'Completed' ? <IoCheckmarkCircle className="text-xl" /> : <IoReaderOutline className="text-xl" />}
        </div>
        <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide 
                        ${order.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {order.status}
        </span>
      </div>

      {/* Content */}
      <div className="mt-1">
        <div className="flex justify-between items-end mb-1">
          <h3 className="font-bold text-slate-900 text-xl">₹{order.total}</h3>
          <span className="text-[10px] font-bold text-slate-400 mb-1">{order.date}</span>
        </div>
        <p className="text-slate-500 text-xs line-clamp-1 font-medium">{order.items}</p>
      </div>

 
      <div className="pt-3 border-t border-slate-50 flex justify-between items-center mt-auto">
        <span className="text-[10px] font-bold text-slate-400">{order.id}</span>
      
        
      </div>
    </div>
  )
}

export default OrderHistoryCard;