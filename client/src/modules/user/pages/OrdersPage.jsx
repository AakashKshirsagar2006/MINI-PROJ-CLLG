

import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../shared/store/auth-context";
import { IoChevronForward } from "react-icons/io5";
import { useContext, useState, useEffect } from "react";
import CurrentOrderCard from "../components/CurrentOrderCard";
import OrderHistoryCard from "../components/OrderHistoryCard";
import PlainMessage from "../../../shared/components/PlainMessage";

const OrdersPage = () => {
  const { userState } = useContext(AuthContext);
  const navigate = useNavigate();

  const [currentOrders, setCurrentOrders] = useState([]);
  const [pastOrders, setPastOrders] = useState([]); // <--- New State for History
  const [loading, setLoading] = useState(true);

  // FETCH BOTH ACTIVE AND PAST ORDERS
  useEffect(() => {
    if (!userState) return;

    // 1. Fetch Active Orders
    fetch("http://localhost:3000/orders/active-orders", {
      method: "GET",
      credentials: "include"
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error fetching active orders");
        return res.json();
      })
      .then(({ activeOrders }) => {
        setCurrentOrders(activeOrders);
      })
      .catch((err) => console.log(err));

    // 2. Fetch Past Orders (The new route we just made)
    fetch("http://localhost:3000/orders/past-orders", {
      method: "GET",
      credentials: "include"
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error fetching past orders");
        return res.json();
      })
      .then(({ pastOrders }) => {
        setPastOrders(pastOrders); // Set the real data
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

        {/* ================================================================
            COMPONENT: PAST ORDERS CAROUSEL (NOW REAL DYNAMIC DATA)
           ================================================================ 
        */}
        <section className="w-full">
          <div className="flex justify-between items-center mb-4 px-1">
            <h2 className="text-xl font-serif font-bold text-slate-900">
              Past Orders
            </h2>
            {pastOrders.length > 0 && (
              <button className="text-xs font-bold text-orange-600 flex items-center gap-1 hover:underline">
                View All <IoChevronForward />
              </button>
            )}
          </div>

          {/* If loading or empty, show a small message, else show slider */}
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