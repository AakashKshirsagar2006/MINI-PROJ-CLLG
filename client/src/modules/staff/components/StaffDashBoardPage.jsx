import React, { useEffect, useState } from 'react';
import useAuth from '../../../shared/hooks/useAuth';
import PlainMessage from '../../../shared/components/PlainMessage';
import useOrderManagement from '../../../shared/hooks/useOrderManagement';
import OrderCard from './OrderCard';
import ReadyOrderCard from './ReadyOrderCard';
import { IoSearchOutline } from "react-icons/io5";
import OpenionPopup from '../../../shared/components/OpenionPopup';

const StaffDashBoardPage = ({ orderState }) => {

  const [openionPopupOpen, setOpenionPopupOpen] = useState(false);
  const [openionResult, setOpenionResult] = useState(null); // "proceed" or "abort"
  const [selectedOrder, setSelectedOrder] = useState(null); // Store the UID of the order being acted upon
  const { pending, ready } = useOrderManagement();
  const { userState } = useAuth();
  
  // Real-time Search State
  const [searchTerm, setSearchTerm] = useState("");

  const { fullfillOrder, loading } = useOrderManagement();

  let ordersToDisplay = [];
  let pageTitle = "";

  switch (orderState) {
    case "PENDING":
      ordersToDisplay = pending || []; 
      pageTitle = "Pending Orders";
      break;
    case "READY":
      ordersToDisplay = ready || [];
      pageTitle = "Ready to Serve";
      break;
    default:
      ordersToDisplay = [];
      pageTitle = "Orders";
  }

  useEffect(()=>{
    if(openionResult === "proceed" && selectedOrder) {
      fullfillOrder(selectedOrder._id.toString(), "NO_OTP").then(()=>{
        setSelectedOrder(null);
        setOpenionPopupOpen(false);
        setOpenionResult(null);
      }).catch((err)=>{
        setSelectedOrder(null);
        setOpenionPopupOpen(false);
        setOpenionResult(null);
      });
    }
  },[openionResult, selectedOrder]);

  const handleFullfillment = (order, otp) => {
    setSelectedOrder(order);
    setOpenionPopupOpen(true);
  }
  // Security Gate
  if (userState?.user_type == 'common') {
    return <PlainMessage head="Unauthorized" linkTo="Home" link="/">Access Restricted</PlainMessage>;
  }

  // Show "Good Job" if absolutely zero orders exist in this tab
  if (ordersToDisplay.length === 0) {
    return (
      <PlainMessage 
        head={`No ${pageTitle}`} 
        linkTo={"Refresh"} 
        link={`/staff`}
      >
        Good job! There are currently no orders in the {orderState} queue.
      </PlainMessage>
    );
  }

  // Apply Search Filter (Filters by orderUID / Token Number)
  const filteredOrders = ordersToDisplay.filter(order => {
    if (!searchTerm) return true;
    return order.orderUID?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <main className="max-w-400 mx-auto px-4 md:px-6 pt-8 pb-32 md:pb-12">
      
      {/* Control Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          {/* Dynamic Title */}
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">{pageTitle}</h2>
          
          {/* Dynamic Count */}
          <p className="text-slate-500 text-sm mt-1">
            You have <span className="font-bold text-orange-600">{ordersToDisplay.length} active orders</span>.
          </p>
        </div>

        {/* SEARCH BAR INJECTED HERE */}
        <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-xl border border-slate-200 w-full md:w-80 shadow-sm transition-all focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-100">
          <IoSearchOutline className="text-slate-400 text-xl" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Token (e.g. 00015)..."
            className="bg-transparent text-sm font-bold focus:outline-none w-full text-slate-700 placeholder:text-slate-400 placeholder:font-normal"
          />
        </div>
      </div>

      {/* NO RESULTS FALLBACK */}
      {filteredOrders.length === 0 && (
          <div className="text-center py-20">
              <p className="text-slate-500 font-bold text-lg">No token matches "{searchTerm}"</p>
          </div>
      )}

      {/* ORDER GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {filteredOrders.map((order) => (
          <div key={order._id || order.id} className="h-full">
            {orderState === "READY" 
              ? <ReadyOrderCard handleFullfillment={handleFullfillment} order={order} orderState={orderState}/> 
              : <OrderCard order={order} orderState={orderState}/>
            }
          </div>
        ))}
      </div>

      
    <OpenionPopup isOpen={openionPopupOpen} 
    handleOnClosePopup={
      ()=>{
        setOpenionPopupOpen(false);
        setSelectedOrder(null);
      }} head="Confirm Action" body={
  <>
    Are you sure you want to serve this order?<br />
    Order UID: {selectedOrder?.orderUID}<br />
    User Name: {selectedOrder?.userName}
  </>
} setOpenion={setOpenionResult}/>
    </main>
  );
};

export default StaffDashBoardPage;