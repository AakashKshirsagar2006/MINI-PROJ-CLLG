
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../../shared/store/auth-context';
import { IoChevronForward } from "react-icons/io5";
import { useContext, useState } from 'react';
import CurrentOrderCard from '../components/CurrentOrderCard';
import OrderHistoryCard from '../components/OrderHistoryCard';
import PlainMessage from '../../../shared/components/PlainMessage';
import { useEffect } from 'react';
import { useOrder } from '../../../shared/store/order-context';
const OrdersPage = () => {
  const { userState} = useContext(AuthContext);
  const navigate = useNavigate();
  const [currentOrders, setCurrentOrders] = useState([]);
  useEffect(()=>{
    fetch('http://localhost:3000/orders/active-orders', { 
    method: 'GET',
    credentials: 'include' 
}).then(res=>{
      if(!res.ok) throw new Error("Some error occured while fetching");
      return res.json()
    }).then(({activeOrders})=>{
         setCurrentOrders(activeOrders);
    }).catch(err=>{
      console.log(err);
    })
  },[]);


  if (!userState) {
    navigate('/login');
    return;
  }

  // Mock Active Order Data
  

  const pastOrders = [
    { id: "#OD-1902", date: "Yesterday", items: "Pesto Pasta, Garlic Bread", total: 210, status: "Completed" },
    { id: "#OD-1850", date: "24 Aug", items: "Veg Thali", total: 120, status: "Completed" },
    { id: "#OD-1740", date: "20 Aug", items: "Cold Coffee, Fries", total: 140, status: "Cancelled" },
    { id: "#OD-1741", date: "18 Aug", items: "Chicken Wrap, Coke", total: 180, status: "Completed" },
    { id: "#OD-1742", date: "15 Aug", items: "Sandwich", total: 80, status: "Completed" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-24">


      <main className="max-w-8xl mx-auto px-4 md:px-10 pt-24 pb-6 space-y-12">

        {/* ACTIVE ORDER SECTION */}

        <section className="w-full md:px-12 lg:px-60">
          <div className="flex justify-between items-center mb-4 px-1">
            <h2 className="text-2xl font-serif font-bold text-slate-900">Current Orders</h2>
          </div>

          <div className="flex flex-col gap-6">

            {currentOrders.length==0?<PlainMessage head={"No Active Orders !"} linkTo='Menu' link='/menu'>
              There is no active orders right now. Visit menu page
            </PlainMessage>:
            currentOrders.map(currentOrder=>(
               <CurrentOrderCard key={currentOrder._id.toString()} activeOrder={currentOrder}/>
            ))
            }
          </div>


        </section>

        {/* ================================================================
           COMPONENT: PAST ORDERS CAROUSEL
           ================================================================ 
        */}
        <section className="w-full">
          <div className="flex justify-between items-center mb-4 px-1">
            <h2 className="text-xl font-serif font-bold text-slate-900">Past Orders</h2>
            <button className="text-xs font-bold text-orange-600 flex items-center gap-1 hover:underline">
              View All <IoChevronForward />
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-6 -mx-4 w-[calc(100%+2rem)] px-4 md:w-full md:mx-0 md:px-0 snap-x snap-mandatory no-scrollbar scroll-smooth">

            {pastOrders.map((order, index) => (
              <OrderHistoryCard key={index} order={order} />
            ))}

          </div>
        </section>

      </main>

    </div>
  );
};

export default OrdersPage;