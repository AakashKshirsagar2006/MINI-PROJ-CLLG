import { useEffect, useReducer, createContext, useMemo } from "react";
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

  const fetchActiveOrders = async () => {
    // dispatchState({type:"LOADING"}); // Commented out to prevent flickering on auto-refresh
    if(!userState) return; // <-- HIS FIX KEPT HERE
    
    try {
      // ✅ CHANGED: /admin to /protected (OUR FIX KEPT HERE)
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
  }

  // PROCESS ORDER (Move from Pending -> Preparing -> Ready)
  const processOrder = async (orderId, fullfillment_status) => {
     dispatchState({type:"LOADING"});
     try {
        // ✅ CHANGED: /admin to /protected
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
  }

  // FULFILL ORDER (Verify OTP and Serve)
  const fullfillOrder = async (orderId, orderOTP) => {
    dispatchState({type:"LOADING"});
    try {
      // ✅ CHANGED: /admin to /protected
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
  }

  // Initial Fetch
  useEffect(() => {
    if(!userState) return;
     fetchActiveOrders();
  }, [userState]);

  // FIX 3: Add userState to the dependency array so interval clears on logout
  useEffect(() => {
    if(!userState) return;
    const intervalId = setInterval(() => {
       fetchActiveOrders();
    }, 15000);
    
    // This cleanup function will now properly run when userState becomes null!
    return () => clearInterval(intervalId);
  }, [userState]);
  
  const value = useMemo(() => ({
    ...activeOrdersState,
    processOrder,
    fullfillOrder,
    fetchActiveOrders
  }), [activeOrdersState]);

  // 3. PROVIDER FIX
  return (
    <OrderManagementContext.Provider value={value}>
      {children}
    </OrderManagementContext.Provider>
  )
}

export default OrderManagementProvider;