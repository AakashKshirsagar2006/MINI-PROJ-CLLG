import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom'; 
import useAuth from '../../../shared/hooks/useAuth';
import PlainMessage from '../../../shared/components/PlainMessage';


import AdminOrderCard from '../components/AdminOrderCard';
import useOrderManagement from '../../../shared/hooks/useOrderManagement';
import PlainMessageAdminStaff from '../../../shared/components/PlainMessageAdminStaff';

const AdminHomePage = () => {

  const {userState} = useAuth();
  const {pending, preparing, ready} = useOrderManagement();
  const [orderTypeState, setOrderTypeState] = useState("PENDING");
  const navigate = useNavigate();

  if(!(userState?.user_type=='admin'))
   return (
     <PlainMessage head={"You Are Not Authrized !"} linkTo={"Home"} link="/">Only admin can access this page.</PlainMessage>
   );

   else

  return (
    
      <>
    
     

      {/* =======================
          MAIN DASHBOARD CONTENT
         ======================= */}
      <main className="max-w-[1600px] mx-auto px-4 md:px-6 pt-8">
        
        {/* Control Bar */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Incoming Orders</h2>
                <p className="text-slate-500 text-sm">You have <span className="font-bold text-orange-600">4 new orders</span> to process.</p>
            </div>
            


            {/* ---------------------
                   Filter Tabs 
            -----------------------*/}
            <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                
                    <button key={"PENDING"}
                    onClick={()=>{setOrderTypeState("PENDING")}}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${orderTypeState === "PENDING" ? 'bg-slate-900 text-white shadow' : 'text-slate-500 hover:bg-slate-50'}`}>
                        PENDING
                    </button>

                    <button key={"PREPARING"}
                    onClick={()=>{setOrderTypeState("PREPARING")}}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${orderTypeState === "PREPARING" ? 'bg-slate-900 text-white shadow' : 'text-slate-500 hover:bg-slate-50'}`}>
                        PREPARING
                    </button>

                    <button key={"READY"}
                    onClick={()=>{setOrderTypeState("READY")}}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${orderTypeState === "READY" ? 'bg-slate-900 text-white shadow' : 'text-slate-500 hover:bg-slate-50'}`}>
                        READY
                    </button>
            </div>

            
        </div>

        {/* ORDER GRID */}

        { orderTypeState==="PENDING"?
        pending.length===0?(<PlainMessageAdminStaff
              key={"PENDING"}
              head={`No Pending Orders`}
              buttonText={"Refresh"}
              onclickFunc={()=>{navigate('/admin')}}
              >
                Currently there are no orders in this category. Please refresh
              </PlainMessageAdminStaff>):
       ( <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {
              pending.map((order)=>(
                <AdminOrderCard
                key={order.orderUID} 
                order={order}/>
              ))
            }
        </div>):
        orderTypeState==="PREPARING"?
        preparing.length===0?(<PlainMessageAdminStaff
              key={"PREPARING"}
              head={`No Preparing Orders`}
              buttonText={"Refresh"}
              onclickFunc={()=>{navigate('/admin')}}
              >
                Currently there are no orders in this category. Please refresh
              </PlainMessageAdminStaff>):
       ( <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {
              preparing.map((order)=>(
                <AdminOrderCard 
                key={order.orderUID}
                order={order}/>
              ))
            }
        </div>):
         ready.length===0?(<PlainMessageAdminStaff
              key={"READY"}
              head={`No Ready Orders`}
              buttonText={"Refresh"}
              onclickFunc={()=>{navigate('/admin')}}
              >
                Currently there are no orders in this category. Please refresh
              </PlainMessageAdminStaff>):
       ( <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {
              ready.map((order)=>(
                <AdminOrderCard
                  key={order.orderUID}
                 order={order}/>
              ))
            }
        </div>)
        }

      </main>

      
     </>

  );
};

export default AdminHomePage;