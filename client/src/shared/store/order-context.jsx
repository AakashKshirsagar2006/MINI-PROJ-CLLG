import { useReducer, useMemo, createContext, useContext, useEffect, useState } from "react";
import { useCart } from "./cart-context";
import useAuth from "../hooks/useAuth";
import loadRazorpay from "../utilities/loadRazorpay"; 

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
  
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const initialOrderState = {
    orderDetails: null,
    loading: false,
    message: null,
    error: null,
  };

  const [orderState, dispatchOrderState] = useReducer(orderReducer, initialOrderState);

  const triggerRefresh = () => setRefreshTrigger(prev => prev + 1);

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
      console.log("Verified. Refreshing...");
      dispatchOrderState({ type: "RESET_ORDER_STATE" });
      triggerRefresh(); 

    } catch (err) {
      console.error(err);
      dispatchOrderState({ type: "ERROR", payload: { message: "Payment Verification Failed" } });
    }
  };

  const fetchOrders = async () => {
    if(!userState?._id) return;
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

  const createOrder = async (cartItems) => {
    if(!userState?._id) return;
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
      const { orderDetails } = data;

      dispatchOrderState({
        type: "CREATE_ORDER",
        payload: { orderDetails }
      });

      await clearCart(); 
      setCartLoading(false); 
      
    } catch (err) {
      console.log(err.message);
      dispatchOrderState({ type: "ERROR", payload: { message: err.message } });
      setCartLoading(false);
    }
  };

  const doPayment = async (orderObj) => {
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

      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
          dispatchOrderState({ 
              type: "ERROR", 
              payload: { message: "Razorpay SDK failed to load. Please check your internet connection." } 
          });
          return;
      }

      // Cleanup utility: Destroys scripts, iframes, and preload links from the DOM
      const cleanUpRazorpay = () => {
          setTimeout(() => {
              // 1. Remove the main script
              const script = document.getElementById("razorpay-checkout-script");
              if (script) script.remove();
              
              // 2. Remove the ghost iframes created by Razorpay
              document.querySelectorAll('iframe').forEach(iframe => {
                  if(iframe.name === "razorpay_checkout" || iframe.src?.includes("razorpay")) {
                      iframe.remove();
                  }
              });

              // 3. Remove the stacked preload links from the document head
              document.querySelectorAll('link[rel="preload"]').forEach(link => {
                  if(link.href && link.href.includes("razorpay")) {
                      link.remove();
                  }
              });
              
              // 4. Safely release the memory reference without strict-mode errors
              if(window.Razorpay) {
                  window.Razorpay = undefined;
              }
              
              console.log("Razorpay core and preload links successfully cleared from DOM.");
          }, 1500); // 1500ms delay ensures the closing animation completes smoothly
      };

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
                      cleanUpRazorpay();
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
                      cleanUpRazorpay();
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
              cleanUpRazorpay();
          });

          rzp.open();

      } catch (fatalError) {
          setCartLoading(false);
          document.body.style.overflow = 'auto';
          dispatchOrderState({ type: "ERROR", payload: { message: fatalError.message } });
          cleanUpRazorpay();
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

  // Watch the primitive ID and refreshTrigger to instantly reload the queue after verification
  useEffect(() => { 
    if (!userState?._id) return;
    fetchOrders(); 
  }, [userState?._id, refreshTrigger]);

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