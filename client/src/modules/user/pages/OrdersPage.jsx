import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../shared/store/auth-context";
import { useOrder } from "../../../shared/store/order-context";
import { IoWarningOutline, IoTimeOutline, IoRefresh } from "react-icons/io5";
import { useContext, useEffect, useState, useCallback } from "react";
import CurrentOrderCard from "../components/CurrentOrderCard";
import OrderHistoryCard from "../components/OrderHistoryCard";
import PlainMessage from "../../../shared/components/PlainMessage";
import Footer from "../components/Footer";
const baseURL = import.meta.env.VITE_SERVER_BASE_URL;
const OrdersPage = () => {
  const { userState } = useContext(AuthContext);
  const navigate = useNavigate();

  // Get Context Data
  // We use the Context as the 'Source of Truth'
  const {
    orderDetails, // This is the 'Pending' order (if any)
    retryPayment,
    cancelOrder,
    fetchOrders, // The global fetcher
  } = useOrder();

  // Local state for the lists (Active vs Past)
  const [currentOrders, setCurrentOrders] = useState([]);
  const [pastOrders, setPastOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 1. DATA FETCHING FUNCTION ---
  // We wrap this in useCallback so it doesn't get recreated on every render
  const loadData = useCallback(() => {
    if (!userState) return;
    // A. Fetch Active Orders
    fetch(baseURL + "/orders/active-orders", { method: "GET", credentials: "include" })
      .then((res) => res.json())
      .then(({ activeOrders }) => setCurrentOrders(activeOrders || []))
      .catch((err) => console.log(err));

    // B. Fetch Past Orders
    fetch(baseURL + "/orders/past-orders", { method: "GET", credentials: "include" })
      .then((res) => res.json())
      .then(({ pastOrders }) => {
        setPastOrders(pastOrders || []);
        setLoading(false);
      })
      .catch((err) => console.log(err));

    // C. Also update the Context global state (for the pending card)
    // fetchOrders(); // <--- CAREFUL: Only call this if truly needed to sync global state

  }, [userState]); // Removed 'fetchOrders' dependency to prevent loop


  // --- 2. BURST POLLING (The Fix for Stale UI) ---
  useEffect(() => {
    // 1. Load immediately on mount
    loadData();

    // 2. Set up a 8-second interval (NOT 3s, to reduce load)
    const intervalId = setInterval(() => {
      // Optimization: Only poll if the tab is visible
      if (!document.hidden) {
        loadData();
      }
    }, 8000); // 8000ms = 8 seconds

    // 3. Cleanup when component unmounts
    return () => clearInterval(intervalId);

  }, [loadData]); // Runs when loadData changes (which is stable due to useCallback)


  if (!userState) {
    navigate("/login");
    return null;
  }

  return (
    <>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-24">
        <main className="max-w-8xl mx-auto px-4 md:px-10 pt-24 pb-6 space-y-12">

          {/* ================================================================
            PENDING PAYMENT CARD (Shows only if status is CREATED) Now we moved this section to the cart as checkout page so no need to mess up the things
            ================================================================ */}
          {/* {orderDetails && orderDetails.status === "CREATED" && (
          <section className="w-full md:px-12 lg:px-60">
             <div className="bg-white border border-orange-200 rounded-2xl shadow-lg overflow-hidden relative animate-pulse-slow">
                <div className="h-1 w-full bg-gradient-to-r from-orange-400 to-red-500"></div>
                
                <div className="bg-orange-50 p-4 border-b border-orange-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                  <div className="flex items-center gap-2 text-orange-800 font-bold">
                    <IoWarningOutline className="text-xl" />
                    <span className="text-lg">Payment Pending</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-orange-700 bg-orange-100 px-3 py-1 rounded-full">
                    <IoTimeOutline /> Expires in 10 mins
                  </div>
                </div>

                <div className="p-6 md:flex md:gap-8">
                  <div className="flex-grow">
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Items in this order</h4>
                    <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                      {orderDetails.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm text-slate-800 border-b border-slate-200 last:border-none pb-2 last:pb-0">
                          <span className="font-medium">{item.name} <span className="text-slate-500 text-xs">x{item.qty}</span></span>
                          <span className="font-bold">₹{item.price * item.qty}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 md:mt-0 md:w-64 flex flex-col justify-between shrink-0">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-slate-500">Total Bill</span>
                          <span className="text-2xl font-black text-slate-900">₹{orderDetails.amount}</span>
                        </div>
                        <p className="text-xs text-slate-400 mb-4">Complete payment to confirm order.</p>
                      </div>

                      <div className="flex flex-col gap-3">
                        <button onClick={() => retryPayment(orderDetails)} className="w-full py-3 text-sm font-bold text-white bg-orange-500 rounded-xl shadow-lg shadow-orange-500/30 hover:bg-orange-600 transition hover:scale-[1.02] active:scale-95">Pay Now</button>
                        <button onClick={() => cancelOrder(orderDetails._id)} className="w-full py-3 text-sm font-bold text-red-500 bg-white border border-red-100 rounded-xl hover:bg-red-50 transition active:scale-95">Cancel Order</button>
                      </div>
                  </div>
                </div>
             </div>
          </section>
        )} */}

          {/* ACTIVE ORDERS */}
          <section className="w-full md:px-12 lg:px-60">
            {/* <div className="flex justify-between items-center mb-4 px-1">
            <h2 className="text-2xl font-serif font-bold text-slate-900 flex items-center gap-3">
              Current Orders
              <button 
                onClick={loadData} 
                title="Refresh Orders"
                className="p-2 bg-white rounded-full border border-slate-200 text-slate-500 hover:text-orange-500 hover:rotate-180 transition duration-500 shadow-sm">
                <IoRefresh className="w-5 h-5"/>
              </button>
            </h2>
          </div> */}

            <div className="flex flex-col gap-6">
              {currentOrders.length === 0 ? (
                <section className="w-full flex flex-col items-center justify-center text-center py-20 px-4">
                  {/* Text Section */}
                  <div className="mb-8 max-w-md">
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 mb-2">
                     No Active Orders
                    </h2>
                    <p className="text-slate-500">
                      There are no active orders at the moment. Please refresh 
                    </p>
                  </div>

                  {/* Login Button */}
                  <button
                  onClick={loadData}
                    className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-slate-900/20 hover:bg-orange-600 hover:shadow-orange-500/30 hover:-translate-y-1 transition-all duration-300"
                  >
                    Refresh
                  </button>

                </section>
              ) : (
                currentOrders.map((currentOrder) => (
                  <CurrentOrderCard
                    key={currentOrder._id.toString()}
                    activeOrder={currentOrder}
                  />
                ))
              )}
            </div>
          </section>

          {/* PAST ORDERS */}
          <section className="w-full">
            <div className="flex justify-between items-center mb-4 px-1">
              <h2 className="text-xl font-serif font-bold text-slate-900">
                Past Orders
              </h2>
            </div>

            {pastOrders.length === 0 && !loading ? (
              <div className="text-gray-400 text-sm italic px-4">
                No past orders found.
              </div>
            ) : (
              <div className="flex gap-3 overflow-x-auto pb-6 -mx-4 w-[calc(100%+2rem)] px-4 md:w-full md:mx-0 md:px-0 snap-x snap-mandatory no-scrollbar scroll-smooth">
                {pastOrders.map((order, index) => (
                  <OrderHistoryCard key={index} order={order} />
                ))}
              </div>
            )}
          </section>
        </main>
      </div>

    </>
  );
};

export default OrdersPage;