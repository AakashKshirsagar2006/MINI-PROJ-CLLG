import { useOrder } from "../../../shared/store/order-context";
import { 
  IoWarningOutline, 
  IoTimeOutline, 
  IoReceiptOutline, 
  IoCardOutline 
} from "react-icons/io5";
import ExpirationTimer from "./ExpirationTimer";
const CheckOutCard = ({orderDetails}) =>{
  const { doPayment, cancelOrder } = useOrder();
  return (
    <>
    {/* ================================================================
        PENDING PAYMENT CARD (Shows only if status is CREATED)
        now chekcout page is added gives a chance to the user to give a final
        review of their ordered item like in race condition some quatities may 
        be not available as desired so in that case insted of landing the user 
        to the payment page we give them a chance to have a final lookup
        ================================================================ */}
        {orderDetails.status === "CREATED" && (
             <section className="w-full md:px-12 lg:px-60 py-8">
          <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100">
            
            {/* --- Header Section: Clean & Status Focused --- */}
            <div className="bg-white p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-2 h-6 bg-orange-500 rounded-full"></span>
                  Pending Checkout
                </h2>
               
              </div>


              <ExpirationTimer createdAt={orderDetails.createdAt}/>
            </div>

            {/* --- Warning Strip (Subtle) --- */}
            <div className="bg-slate-50 border-b border-slate-100 px-6 py-2 flex items-center gap-2 text-xs font-medium text-slate-500">
              <IoWarningOutline className="text-orange-500 text-base shrink-0" />
              <span>Note: Stock availability is real-time. Please check quantities before placing order.</span>
            </div>

            {/* --- Main Content Grid --- */}
            <div className="grid grid-cols-1 md:grid-cols-3">
              
              {/* Left Column: Item Details (2/3 width) */}
              <div className="p-6 md:p-8 md:col-span-2 space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <IoReceiptOutline className="text-slate-400" />
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Order Summary</h4>
                </div>

                <div className="space-y-4">
                  {orderDetails.items.map((item, idx) => (
                    <div key={idx} className="group flex justify-between items-center py-3 border-b border-slate-50 hover:bg-slate-50 px-2 rounded-lg transition-colors">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-700 text-sm md:text-base">{item.name}</span>
                        <span className="text-xs text-slate-400 font-medium">Qty: {item.qty}</span>
                      </div>
                      <span className="font-bold text-slate-800 tabular-nums">₹{item.price * item.qty}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Payment Action (1/3 width) - Darker/Contrast Background */}
              <div className="bg-slate-50 p-6 md:p-8 border-l border-slate-100 flex flex-col justify-between h-full">
                
                {/* Total Section */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Payment Details</h4>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-slate-500 font-medium">Total Amount</span>
                    <span className="text-3xl font-black text-slate-900 tracking-tight">₹{orderDetails.amount}</span>
                  </div>
                  <div className="w-full h-px bg-slate-200 my-4"></div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    By proceeding, you agree to our terms of service. Order will be processed immediately.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex flex-col gap-3">
                  <button 
                    onClick={() => doPayment(orderDetails)} 
                    className="group w-full py-4 bg-slate-900 text-white rounded-xl shadow-xl shadow-slate-900/10 hover:shadow-orange-500/20 hover:bg-orange-500 transition-all duration-300 flex items-center justify-center gap-2 transform active:scale-[0.98]"
                  >
                    <span>Secure Checkout</span>
                    <IoCardOutline className="text-lg group-hover:rotate-12 transition-transform" />
                  </button>
                  
                  <button 
                    onClick={() => cancelOrder(orderDetails._id)} 
                    className="w-full py-4 bg-red-600 text-xs font-bold text-slate-200 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    Cancel this order
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>
            )}
    </>
  );
}

export default CheckOutCard;