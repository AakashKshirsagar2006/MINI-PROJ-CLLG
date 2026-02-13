import { useReducer, useMemo, createContext, useContext, useEffect } from "react";
import { useCart } from "./cart-context";

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
        orderDetails: action.payload.orderDetails, // Pending order ko state mein save karenge
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

  const initialOrderState = {
    orderDetails: null,
    loading: false,
    message: null,
    error: null,
  };

  const [orderState, dispatchOrderState] = useReducer(orderReducer, initialOrderState);

  // ==========================================
  // --- VERIFY FUNCTION (Payment Success ke baad) ---
  // ==========================================
  const verifyPayment = async (response, orderId) => {
    try {
      const verifyRes = await fetch("http://localhost:3000/payments/verify", {
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
        const err = await verifyRes.json();
        throw new Error(err.message);
      }

      console.log("Payment verified!");
      
      // SUCCESS! Ab payment ho chuka hai, toh cart ko clear karenge
      clearCart();
      dispatchOrderState({ type: "RESET_ORDER_STATE" });
      fetchOrders();

    } catch (err) {
      console.error("Payment verification failed:", err.message);
      dispatchOrderState({ type: "ERROR", payload: { message: "Payment verification failed" } });
    }
  };

  // ==========================================
  // --- ORDERS FETCH KARNA ---
  // ==========================================
  const fetchOrders = async () => {
    setCartLoading(true);
    dispatchOrderState({ type: "LOADING" });
    try {
      const res = await fetch("http://localhost:3000/orders/my-orders", {
        method: "GET",
        credentials: "include"
      });
      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message);
      }
      const { orderDetails } = await res.json();
      dispatchOrderState({ type: "FETCH_ORDERS", payload: { orderDetails } });
      setCartLoading(false);
    } catch (err) {
      setCartLoading(false);
      console.log(err.message);
      dispatchOrderState({ type: "ERROR", payload: { message: err.message } });
    }
  };

  // ==========================================
  // --- 1. NAYA ORDER BANANA ---
  // ==========================================
  const createOrder = async (cartItems) => {
    let requestedOrderDetails = [];
    Object.keys(cartItems).forEach(key => {
      const foodItemId = key;
      const qty = cartItems[key].qty;
      requestedOrderDetails.push({ foodItemId, qty });
    });

    setCartLoading(true);
    dispatchOrderState({ type: "LOADING" });
    
    try {
      const res = await fetch("http://localhost:3000/orders/create", {
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

      dispatchOrderState({
        type: "CREATE_ORDER",
        payload: { orderDetails }
      });

      // RAZORPAY POPUP OPTIONS
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpay.amount,
        currency: razorpay.currency,
        name: "College Canteen",
        description: "Food Order Payment",
        order_id: razorpay.orderId,
        handler: async function (response) {
            // Agar payment success hua, tabhi verify func call hoga
            await verifyPayment(response, orderDetails._id);
        },
        prefill: {
          name: orderDetails.userName,
          email: orderDetails.userEmail
        },
        theme: {
          color: "#f97316"
        },
        modal: {
            ondismiss: function() {
                // Agar user popup close karta hai, loading band karo.
                //  DHYAAN DE: Yahan cart clear NAHI kar rahe hain. Cart safe rahega!
                setCartLoading(false); 
            }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.log(err.message);
      dispatchOrderState({ type: "ERROR", payload: { message: err.message } });
      setCartLoading(false);
    }
  };

  // ==========================================
  // --- 2. PAYMENT RETRY KARNA (Naya Feature) ---
  // ==========================================
  const retryPayment = (orderObj) => {
      // Agar purana order id nahi hai, toh return kar do
      if(!orderObj || !orderObj.razorpayOrderId) return;
      
      setCartLoading(true);
      
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderObj.amount * 100, // Amount paise mein
        currency: orderObj.currency || "INR",
        name: "College Canteen",
        description: "Retry Payment",
        order_id: orderObj.razorpayOrderId, // Naya order nahi banayenge, purana id use karenge
        handler: async function (response) {
            // Payment verify karo
            await verifyPayment(response, orderObj._id);
        },
        prefill: {
          name: orderObj.userName || "User",
          email: orderObj.userEmail || ""
        },
        theme: { color: "#f97316" },
        modal: {
            ondismiss: function() {
                // Agar user wapas close kar de, toh bas loading hatao
                setCartLoading(false); 
            }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
  };

  // ==========================================
  // --- ORDER CANCEL KARNA ---
  // ==========================================
  const cancelOrder = async (orderID) => {
    console.log("Inside cancel order");
    dispatchOrderState({ type: "LOADING" });
    try {
      const res = await fetch(`http://localhost:3000/orders/cancel`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: orderID }),
        credentials: "include"
      });

      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message);
      }
      dispatchOrderState({ type: "RESET_ORDER_STATE" });
      fetchOrders(); // Cancel karne ke baad list refresh karo

    } catch (err) {
      console.log(err.message);
      dispatchOrderState({ type: "ERROR", payload: { message: err.message } });
    }
  };

  const setLoading = (isLoading) => {
    if (isLoading) dispatchOrderState({ type: "LOADING" });
    else if (!isLoading) dispatchOrderState({ type: "IDLE" });
  };

  const resetOrderState = () => {
    dispatchOrderState({ type: "RESET_ORDER_STATE" });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const value = useMemo(() => ({
    ...orderState,
    fetchOrders,
    createOrder,
    cancelOrder,
    retryPayment, // 👈 Is naye function ko export kar rahe hain
    setLoading,
    resetOrderState
  }), [orderState]);

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