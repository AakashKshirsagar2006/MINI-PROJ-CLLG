//Here the active order means the order which is eligible for fullfillment but not fullfilled yet

import { useEffect, useReducer, createContext, useMemo} from "react";

export const OrderManagementContext = createContext(null);



const initialActiveOrderState = {
  pending:[],
  preparing:[],
  ready:[],
  message:null,
  loading: false,
  error: null
}

const activeOrderReducer = (state, action)=>{
   switch(action.type){
    case "LOADING":
      return {...state, loading:true}

    case"REHYDRATE":
    const activeOrders = action.payload.activeOrders;
    const pending = activeOrders.filter(order=>order.fullfillment_status === "PENDING"
    );

     const preparing = activeOrders.filter(order=>order.fullfillment_status === "PREPARING"
    );


     const ready = activeOrders.filter(order=>order.fullfillment_status === "READY"
    );


    return {...state,pending, preparing, ready, loading:false}

    case "ERROR":
      return {...state, loading:false,error:action.payload.message}
   }   
}

const OrderManagementProvider = ({children})=>{

  const [activeOrdersState, dispathcState] =  useReducer(activeOrderReducer,initialActiveOrderState);

  const fetchActiveOrders = async ()=>{
    dispathcState({type:"LOADING"});
    try{
    const res = await fetch("http://localhost:3000/protected/active-orders",
      {
        method:"GET",
        credentials:"include"
      }
    );

    if(!res.ok) throw new Error("Some error occured.");
    const {activeOrders} = await res.json();
    console.log("Active orders from backend:", activeOrders);
    dispathcState({type:"REHYDRATE",payload:{activeOrders}});
  }
  catch(err){
    dispathcState({type:"ERROR",payload:{message:err.message}});
    console.error(err.message);
  }
  }

//-------------------------------------------------------------------------------------
  const processOrder = async (orderId, fullfillment_status)=>{
         dispathcState({type:"LOADING"});
         try{
            const res = await fetch("http://localhost:3000/protected/process-order",{
              method:"POST",
              headers:{"Content-Type":"application/json"},
              body: JSON.stringify({orderId:orderId, fullfillment_status:fullfillment_status}),
              credentials:"include"
            });
        if(!res.ok) throw new Error("Something went wrong");
          fetchActiveOrders();
         }
         catch(err){
          dispathcState({type:"ERROR",payload:{message:err.message}});
          console.error(err.message);
         }  
  }

  //-----------------------------------------------------------------------------------
const fullfillOrder = async (orderId, orderOTP)=>{
    dispathcState({type:"LOADING"});
    console.log(orderId, orderOTP);
    try{
      const res = await fetch("http://localhost:3000/protected/fullfill-order",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({orderId, orderOTP}),
        credentials:"include"
      });

      if(!res.ok) throw new Error("Somenthing worng happened");
      await fetchActiveOrders();
      return;
    }
    catch(err){
      dispathcState({type:"ERROR", payload:{message:err.message}});
      console.error(err);
    }
}

useEffect(()=>{
     fetchActiveOrders();
},[]);

useEffect(()=>{
  const intervalId = setInterval(()=>{
     fetchActiveOrders();
  }, 15000);

  return ()=>clearInterval(intervalId);
  
},[]);
  
  const value = useMemo(()=>({
    ...activeOrdersState,
    processOrder,
    fullfillOrder,
    fetchActiveOrders
  }));

  return (
    <OrderManagementContext value={value}>
      {children}
    </OrderManagementContext>
  )
}

export default OrderManagementProvider;