

// import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../../../shared/store/auth-context";
// import { IoChevronForward } from "react-icons/io5";
// import { useContext, useState, useEffect } from "react";
// import CurrentOrderCard from "../components/CurrentOrderCard";
// import OrderHistoryCard from "../components/OrderHistoryCard";
// import PlainMessage from "../../../shared/components/PlainMessage";
// import { useOrder } from "../../../shared/store/order-context";

// const OrdersPage = () => {
//   const { userState } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const { orderDetails, retryPayment, cancelOrder } = useOrder();
//   const [currentOrders, setCurrentOrders] = useState([]);
//   const [pastOrders, setPastOrders] = useState([]); // <--- New State for History
//   const [loading, setLoading] = useState(true);

//   // FETCH BOTH ACTIVE AND PAST ORDERS
//   useEffect(() => {
//     if (!userState) return;

//     // 1. Fetch Active Orders
//     fetch("http://localhost:3000/orders/active-orders", {
//       method: "GET",
//       credentials: "include"
//     })
//       .then((res) => {
//         if (!res.ok) throw new Error("Error fetching active orders");
//         return res.json();
//       })
//       .then(({ activeOrders }) => {
//         setCurrentOrders(activeOrders);
//       })
//       .catch((err) => console.log(err));

//     // 2. Fetch Past Orders (The new route we just made)
//     fetch("http://localhost:3000/orders/past-orders", {
//       method: "GET",
//       credentials: "include"
//     })
//       .then((res) => {
//         if (!res.ok) throw new Error("Error fetching past orders");
//         return res.json();
//       })
//       .then(({ pastOrders }) => {
//         setPastOrders(pastOrders); // Set the real data
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.log(err);
//         setLoading(false);
//       });
//   }, [userState]);

//   if (!userState) {
//     navigate("/login");
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-24">
//       <main className="max-w-8xl mx-auto px-4 md:px-10 pt-24 pb-6 space-y-12">
//         {/* ACTIVE ORDER SECTION */}
//         <section className="w-full md:px-12 lg:px-60">
//           <div className="flex justify-between items-center mb-4 px-1">
//             <h2 className="text-2xl font-serif font-bold text-slate-900">
//               Current Orders
//             </h2>
//           </div>

//           <div className="flex flex-col gap-6">
//             {currentOrders.length === 0 ? (
//               <PlainMessage head={"No Active Orders !"} linkTo="Menu" link="/menu">
//                 There are no active orders right now. Visit menu page.
//               </PlainMessage>
//             ) : (
//               currentOrders.map((currentOrder) => (
//                 <CurrentOrderCard
//                   key={currentOrder._id.toString()}
//                   activeOrder={currentOrder}
//                 />
//               ))
//             )}
//           </div>
//         </section>

//         {/* ================================================================
//             COMPONENT: PAST ORDERS CAROUSEL (NOW REAL DYNAMIC DATA)
//            ================================================================ 
//         */}
//         <section className="w-full">
//           <div className="flex justify-between items-center mb-4 px-1">
//             <h2 className="text-xl font-serif font-bold text-slate-900">
//               Past Orders
//             </h2>
//             {pastOrders.length > 0 && (
//               <button className="text-xs font-bold text-orange-600 flex items-center gap-1 hover:underline">
//                 View All <IoChevronForward />
//               </button>
//             )}
//           </div>

//           {/* If loading or empty, show a small message, else show slider */}
//           {pastOrders.length === 0 && !loading ? (
//             <div className="text-gray-400 text-sm italic px-4">
//               No past orders found.
//             </div>
//           ) : (
//             <div className="flex gap-3 overflow-x-auto pb-6 -mx-4 w-[calc(100%+2rem)] px-4 md:w-full md:mx-0 md:px-0 snap-x snap-mandatory no-scrollbar scroll-smooth">
//               {pastOrders.map((order, index) => (
//                 <OrderHistoryCard key={index} order={order} />
//               ))}
//             </div>
//           )}
//         </section>
//       </main>
//     </div>
//   );
// };

// export default OrdersPage;

import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../shared/store/auth-context";
import { useOrder } from "../../../shared/store/order-context"; // 👈 IMPORT THIS
import { IoChevronForward, IoWarningOutline } from "react-icons/io5";
import { useContext, useState, useEffect } from "react";
import CurrentOrderCard from "../components/CurrentOrderCard";
import OrderHistoryCard from "../components/OrderHistoryCard";
import PlainMessage from "../../../shared/components/PlainMessage";

const OrdersPage = () => {
  const { userState } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // 👈 GET PENDING ORDER & ACTIONS FROM CONTEXT
  const { orderDetails, retryPayment, cancelOrder } = useOrder(); 

  const [currentOrders, setCurrentOrders] = useState([]);
  const [pastOrders, setPastOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userState) return;

    fetch("http://localhost:3000/orders/active-orders", {
      method: "GET",
      credentials: "include"
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error fetching active orders");
        return res.json();
      })
      .then(({ activeOrders }) => setCurrentOrders(activeOrders))
      .catch((err) => console.log(err));

    fetch("http://localhost:3000/orders/past-orders", {
      method: "GET",
      credentials: "include"
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error fetching past orders");
        return res.json();
      })
      .then(({ pastOrders }) => {
        setPastOrders(pastOrders);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [userState]);

  if (!userState) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-24">
      <main className="max-w-8xl mx-auto px-4 md:px-10 pt-24 pb-6 space-y-12">
        
        {/* ================================================================
            NEW SECTION: PENDING PAYMENT (From Order Context)
           ================================================================ */}
        {orderDetails && orderDetails.status === "CREATED" && (
          <section className="w-full md:px-12 lg:px-60">
             <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-xl shadow-sm mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                   <h3 className="text-orange-800 font-bold flex items-center gap-2">
                     <IoWarningOutline className="text-xl"/> Pending Payment
                   </h3>
                   <p className="text-sm text-orange-700 mt-1">You have an unpaid order of ₹{orderDetails.amount}.</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                   <button 
                     onClick={() => cancelOrder(orderDetails._id)}
                     className="px-4 py-2 text-xs font-bold text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition w-full md:w-auto">
                     Cancel Order
                   </button>
                   <button 
                     onClick={() => retryPayment(orderDetails)}
                     className="px-4 py-2 text-xs font-bold text-white bg-orange-500 rounded-lg shadow-md hover:bg-orange-600 transition w-full md:w-auto">
                     Pay Now
                   </button>
                </div>
             </div>
          </section>
        )}

        {/* ACTIVE ORDER SECTION */}
        <section className="w-full md:px-12 lg:px-60">
          <div className="flex justify-between items-center mb-4 px-1">
            <h2 className="text-2xl font-serif font-bold text-slate-900">
              Current Orders
            </h2>
          </div>

          <div className="flex flex-col gap-6">
            {currentOrders.length === 0 ? (
              <PlainMessage head={"No Active Orders !"} linkTo="Menu" link="/menu">
                There are no active orders right now. Visit menu page.
              </PlainMessage>
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

        {/* PAST ORDERS SECTION */}
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
  );
};

export default OrdersPage;