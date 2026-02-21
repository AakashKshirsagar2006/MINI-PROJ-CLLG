import React from 'react';
import useAuth from '../../../shared/hooks/useAuth';
import PlainMessage from '../../../shared/components/PlainMessage';
import useOrderManagement from '../../../shared/hooks/useOrderManagement';
import OrderCard from './OrderCard';
import ReadyOrderCard from './ReadyOrderCard';

const StaffDashBoardPage = ({ orderState }) => {
  

 
  const { pending, preparing, ready } = useOrderManagement();
  // console.log(pending, preparing, ready);

  
  let ordersToDisplay = [];
  let pageTitle = "";

  switch (orderState) {
    case "PENDING":
      ordersToDisplay = pending || []; 
      pageTitle = "Pending Orders";
      break;
    case "PREPARING":
      ordersToDisplay = preparing || [];
      pageTitle = "Orders in Kitchen";
      break;
    case "READY":
      ordersToDisplay = ready || [];
      pageTitle = "Ready to Serve";
      break;
    default:
      ordersToDisplay = [];
      pageTitle = "Orders";
  }

  
  const { userState } = useAuth();

  if (userState?.user_type == 'common') {
    return <PlainMessage head="Unauthorized" linkTo="Home" link="/">Access Restricted</PlainMessage>;
  }

  
  if (ordersToDisplay.length === 0) {
    return (
      <PlainMessage 
        head={`No ${pageTitle}`} 
        linkTo={"Refresh"} 
        link={`/staff/${orderState === 'PENDING' ? '' : orderState}`}
      >
        Good job! There are currently no orders in the {orderState} queue.
      </PlainMessage>
    );
  }

  return (
    <main className="max-w-[1600px] mx-auto px-4 md:px-6 pt-8">
      
      {/* Control Bar */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
        <div>
          {/* Dynamic Title */}
          <h2 className="text-2xl font-bold text-slate-900">{pageTitle}</h2>
          
          {/* Dynamic Count */}
          <p className="text-slate-500 text-sm">
            You have <span className="font-bold text-orange-600">{ordersToDisplay.length} active orders</span>.
          </p>
        </div>

       
      </div>

      {/* ORDER GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {ordersToDisplay.map((order) => (
          // Ensure you use _id for MongoDB documents
          <div key={order._id || order.id} className="h-full">
            {orderState === "READY"?<ReadyOrderCard order={order} orderState={orderState}/>:<OrderCard order={order} orderState={orderState}/>}
          </div>
        ))}
      </div>

    </main>
  );
};

export default StaffDashBoardPage;