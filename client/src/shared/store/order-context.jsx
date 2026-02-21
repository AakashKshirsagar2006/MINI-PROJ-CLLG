
import { useReducer, useMemo, createContext, useContext, useEffect, useState } from "react";
import { useCart } from "./cart-context";
import useAuth from "../hooks/useAuth";
const baseURL = import.meta.env.VITE_SERVER_BASE_URL;

const OrderContext = createContext(null);

const orderReducer = (state, action) => {
  switch (action.type) {
    case "LOADING":
      return { ...state, loading: true, error: null };
    case "IDLE":
      return { ...state, loading: false, error: null };
    case "FETCH_ORDERS":
      return {
        ...state,
        orderDetails: action.payload.orderDetails,
        loading: false,
        message: action.payload.message || "Orders fetched",
        error: null
      };
    case "CREATE_ORDER":
      return {
        ...state,
        orderDetails: action.payload.orderDetails,
        loading: false,
        message: "Order created successfully",
        error: null
      };
    case "RESET_ORDER_STATE":
      return {
        ...state,
        orderDetails: null,
        loading: false,
        message: null,
        error: null
      };
    case "ERROR":
      return { ...state, loading: false, error: action.payload.message };
    default:
      return state;
  }
};

export const OrderProvider = ({ children }) => {
  const { setCartLoading, clearCart } = useCart();
  const {userState} = useAuth();
  // 🔄 SIMPLE TRIGGER
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const initialOrderState = {
    orderDetails: null,
    loading: false,
    message: null,
    error: null,
  };

  const [orderState, dispatchOrderState] = useReducer(orderReducer, initialOrderState);

  const triggerRefresh = () => setRefreshTrigger(prev => prev + 1);

  // ==========================================
  // --- VERIFY PAYMENT ---
  // ==========================================
  const verifyPayment = async (response, orderId) => {
    
    try {
      dispatchOrderState({type:"LOADING"});
      const verifyRes = await fetch(baseURL+"/payments/verify", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: orderId,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature
        })
      });

      if (!verifyRes.ok) {
        throw new Error("Payment verification failed");
      }
      console.log(" Verified. Refreshing...");
      dispatchOrderState({ type: "RESET_ORDER_STATE" });
      triggerRefresh(); // Force update

    } catch (err) {
      
      console.error(err);
      dispatchOrderState({ type: "ERROR", payload: { message: "Payment Verification Failed" } });
    }
  };

  // ==========================================
  // --- FETCH ORDERS ---
  // ==========================================
  const fetchOrders = async () => {
    if(!userState) return;
    // Silent fetch (don't set global loading to avoid UI flicker during polling)
    try {
      const res = await fetch(baseURL+"/orders/my-orders", {
        method: "GET",
        credentials: "include"
      });
      if (res.ok) {
        const { orderDetails } = await res.json();
        dispatchOrderState({ type: "FETCH_ORDERS", payload: { orderDetails } });
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ==========================================
  // --- CREATE ORDER (THE CLEAN SLATE LOGIC) ---
  // ==========================================
  const createOrder = async (cartItems) => {
    if(!userState) return;
    let requestedOrderDetails = [];
    Object.keys(cartItems).forEach(key => {
      requestedOrderDetails.push({ foodItemId: key, qty: cartItems[key].qty });
    });

    setCartLoading(true);
    dispatchOrderState({ type: "LOADING" });
    
    try {
      const res = await fetch(baseURL+"/orders/create", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestedOrderDetails })
      });

      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message);
      }

      const data = await res.json();
      const { orderDetails, razorpay } = data;

      // 1. Store Pending State
      dispatchOrderState({
        type: "CREATE_ORDER",
        payload: { orderDetails }
      });

      // 2. 🗑️ NUKE THE CART IMMEDIATELY
      await clearCart(); 
      setCartLoading(false); // Stop loading so they see the empty cart/order page
      
      //NO need for this shit. Now do payment will handle all cases
      // 3. Open Razorpay
      // const options = {
      //   key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      //   amount: razorpay.amount,
      //   currency: razorpay.currency,
      //   name: "College Canteen",
      //   description: "Food Order",
      //   order_id: razorpay.orderId,
      //   handler: async function (response) {
      //       setCartLoading(true);
      //       await verifyPayment(response, orderDetails._id);
      //       setCartLoading(false);
      //   },
      //   prefill: {
      //     name: orderDetails.userName,
      //     email: orderDetails.userEmail
      //   },
      //   theme: { color: "#f97316" },
      //   modal: {
      //       ondismiss: function() {
      //       }
      //   }
      // };

      // const rzp = new window.Razorpay(options);
      // rzp.open();

    } catch (err) {
      console.log(err.message);
      dispatchOrderState({ type: "ERROR", payload: { message: err.message } });
      setCartLoading(false);
    }
  };

 const doPayment = (orderObj) => {
      if(!orderObj || !orderObj.razorpayOrderId) return;
      
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

      if (!razorpayKey) {
          console.error("Razorpay key is undefined. Check your .env file and restart Vite.");
          dispatchOrderState({ 
              type: "ERROR", 
              payload: { message: "Server configuration error. Payment gateway unavailable." } 
          });
          return;
      }

      dispatchOrderState({ type: "IDLE" });

      try {
          const options = {
              key: razorpayKey,
              amount: orderObj.amount * 100,
              currency: "INR",
              name: "College Canteen",
              description: "Order Payment",
              order_id: orderObj.razorpayOrderId,
              
              handler: async function (response) {
                  try {
                      setCartLoading(true); 
                      await verifyPayment(response, orderObj._id);
                  } catch (verificationError) {
                      dispatchOrderState({ 
                          type: "ERROR", 
                          payload: { message: "Verification failed. Please contact support." } 
                      });
                  } finally {
                      setCartLoading(false);
                      document.body.style.overflow = 'auto'; 
                  }
              },
              
              prefill: { name: "User", email: "" },
              theme: { color: "#f97316" },
              
              modal: {
                  ondismiss: function() {
                      console.log("Razorpay popup closed");
                      setCartLoading(false);
                      document.body.style.overflow = 'auto'; 
                      
                      dispatchOrderState((prevState) => {
                          if (prevState.error) return prevState;
                          return { ...prevState, loading: false, error: null };
                      });
                  }
              }
          };

          const rzp = new window.Razorpay(options);

          rzp.on('payment.failed', function (response) {
              setCartLoading(false);
              document.body.style.overflow = 'auto'; 
              
              dispatchOrderState({ 
                  type: "ERROR", 
                  payload: { message: response.error.description || "Payment failed." } 
              });
          });

          rzp.open();

      } catch (fatalError) {
          setCartLoading(false);
          document.body.style.overflow = 'auto';
          dispatchOrderState({ type: "ERROR", payload: { message: fatalError.message } });
      }
  };

  const cancelOrder = async (orderID) => {
    dispatchOrderState({ type: "LOADING" });
    try {
      const res = await fetch(`${baseURL}/orders/cancel`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: orderID }),
        credentials: "include"
      });

      if (!res.ok) throw new Error("Failed to cancel");
      
      dispatchOrderState({ type: "RESET_ORDER_STATE" });

    } catch (err) {
      dispatchOrderState({ type: "ERROR", payload: { message: err.message } });
    }
  };

  // Initial Fetch
  useEffect(() => { fetchOrders(); }, []);

  const value = useMemo(() => ({
    ...orderState,
    refreshTrigger, 
    fetchOrders,
    createOrder,
    cancelOrder,
    doPayment,
    triggerRefresh 
  }), [orderState, refreshTrigger]);

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrder must be used inside OrderProvider");
  return ctx;
};