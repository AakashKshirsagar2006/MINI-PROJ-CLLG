import { useEffect, useReducer, createContext, useMemo, useCallback } from "react";
import useAuth from "../hooks/useAuth";

// 1. URL FIX
const baseURL = import.meta.env.VITE_SERVER_BASE_URL;

const initialActiveOrderState = {
  pending: [],
  preparing: [],
  ready: [],
  message: null,
  loading: false,
  error: null
}

export const OrderManagementContext = createContext(
  {
   ...initialActiveOrderState,
  processOrder: () => {},
  fullfillOrder: () => {},
  fetchActiveOrders: () => {}
  }
);

const activeOrderReducer = (state, action) => {
   switch(action.type){
    case "LOADING":
      return {...state, loading:true}

    case "REHYDRATE":
      const activeOrders = action.payload.activeOrders || [];
      const pending = activeOrders.filter(order => order.fullfillment_status === "PENDING");
      const preparing = activeOrders.filter(order => order.fullfillment_status === "PREPARING");
      const ready = activeOrders.filter(order => order.fullfillment_status === "READY");
      
      return {...state, pending, preparing, ready, loading:false}

    case "ERROR":
      return {...state, loading:false, error:action.payload.message}
    default:
      return state;
   }   
}

const OrderManagementProvider = ({children}) => {
  const {userState} = useAuth();

  const [activeOrdersState, dispatchState] = useReducer(activeOrderReducer, initialActiveOrderState);

  // Memoize the fetch function to keep its memory reference stable
  const fetchActiveOrders = useCallback(async () => {
    // Only fetch if we have a valid user ID string
    if(!userState?._id) return; 
    
    try {
      const res = await fetch(baseURL + "/protected/active-orders", { 
        method: "GET",
        credentials: "include"
      });

      if(!res.ok) throw new Error("Some error occured.");
      const {activeOrders} = await res.json();
      console.log("Active orders from backend:", activeOrders);
      dispatchState({type: "REHYDRATE", payload: {activeOrders}});
    }
    catch(err){
      dispatchState({type: "ERROR", payload: {message: err.message}});
      console.error(err.message);
    }
  }, [userState?._id]); // Only recreate this function if the user ID string changes

  // PROCESS ORDER
  const processOrder = useCallback(async (orderId, fullfillment_status) => {
     dispatchState({type:"LOADING"});
     try {
        const res = await fetch(baseURL + "/protected/process-order", {
           method: "POST",
           headers: {"Content-Type": "application/json"},
           body: JSON.stringify({orderId, fullfillment_status}),
           credentials: "include"
        });
        if(!res.ok) throw new Error("Something went wrong");
        await fetchActiveOrders();
     }
     catch(err){
        dispatchState({type:"ERROR", payload:{message:err.message}});
        console.error(err.message);
     }  
  }, [fetchActiveOrders]);

  // FULFILL ORDER
  const fullfillOrder = useCallback(async (orderId, orderOTP) => {
    dispatchState({type:"LOADING"});
    try {
      const res = await fetch(baseURL + "/protected/fullfill-order", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({orderId, orderOTP}),
        credentials: "include"
      });

      if(!res.ok) throw new Error("Something wrong happened");
      await fetchActiveOrders();
    }
    catch(err){
      dispatchState({type:"ERROR", payload: {message: err.message}});
      console.error(err);
    }
  }, [fetchActiveOrders]);

  // Initial Fetch - Dependency is now the primitive string ID, not the object
  useEffect(() => {
    if(!userState?._id) return;
     fetchActiveOrders();
  }, [userState?._id, fetchActiveOrders]);

  // Polling Interval - Dependency is primitive string ID
  useEffect(() => {
    if(!userState?._id) return;
    const intervalId = setInterval(() => {
       fetchActiveOrders();
    }, 15000);
    
    return () => clearInterval(intervalId);
  }, [userState?._id, fetchActiveOrders]);
  
  // Memoize the context value
  const value = useMemo(() => ({
    ...activeOrdersState,
    processOrder,
    fullfillOrder,
    fetchActiveOrders
  }), [activeOrdersState, processOrder, fullfillOrder, fetchActiveOrders]);

  return (
    <OrderManagementContext.Provider value={value}>
      {children}
    </OrderManagementContext.Provider>
  )
}

export default OrderManagementProvider;