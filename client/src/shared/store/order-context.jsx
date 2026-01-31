import { useReducer } from "react";
import { useMemo } from "react";
import { createContext } from "react";
import { useContext } from "react";
import { useCart } from "./cart-context";
import { useEffect } from "react";



const OrderContext = createContext(null);


const orderReducer = (state , action)=>{
  switch(action.type){

    case "LOADING":
      return {...state, loading:true, error:null};
    
    case "IDLE":
      return {...state, loading:false, error:null};
  
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

  }
}

export const OrderProvider = ({children})=>{

  const {setCartLoading, clearCart} = useCart();


  const initialOrderState = {
    orderDetails:null,
    loading: false,
    message: null,
    error: null,
  }

  const [orderState, dispatchOrderState ]= useReducer(orderReducer, initialOrderState);

  const fetchOrders = async()=>{
    setCartLoading(true);
    dispatchOrderState({type:"LOADING"});
    try{
      setCartLoading(true);
      const res = await fetch("http://localhost:3000/orders/my-orders",{
        method:"GET",
        credentials:"include"
      });
      if(!res.ok){
        const {message} = await res.json();
        throw new Error (message);
      }
      const {orderDetails} = await res.json();
      dispatchOrderState({type:"FETCH_ORDERS", payload:{ orderDetails}});
      setCartLoading(false);
    }
    catch(err){
      setCartLoading(false);
      console.log(err.message);
      dispatchOrderState({type:"ERROR", payload:{message:err.message}});
    }
  
  }
  
  const createOrder = async (cartItems)=>{
    let requestedOrderDetails = [];
     Object.keys(cartItems).forEach(key=>{
      const foodItemId = key;
      const qty = cartItems[key].qty;
      requestedOrderDetails.push({foodItemId, qty});
     });


    setCartLoading(true);
    dispatchOrderState({type:"LOADING"});
    try{
      const res = await fetch("http://localhost:3000/orders/create",{
        method:"POST",
        credentials:"include",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({requestedOrderDetails})
      });


      if(!res.ok){
        const {message} = await res.json();
        throw new Error (message);
      }

      const data = await res.json();
      const { orderDetails, razorpay } = data;

      // order store krre hai state mei
      dispatchOrderState({
        type: "CREATE_ORDER",
        payload: { orderDetails }
      });

      //  OPEN RAZORPAY POPUP
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // frontend public key
        amount: razorpay.amount,
        currency: razorpay.currency,
        name: "College Canteen",
        description: "Food Order Payment",
        order_id: razorpay.orderId,

        handler: async function (response) {
          try {
            const verifyRes = await fetch(
              "http://localhost:3000/payments/verify",
              {
                method: "POST",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  orderId: orderDetails._id,                 // Mongo order ID
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature
                })
              }
            );

            if (!verifyRes.ok) {
              const err = await verifyRes.json();
              throw new Error(err.message);
            }

            const data = await verifyRes.json();
            console.log("Payment verified:", data);

            // ✅ ORDER COMPLETE
            dispatchOrderState({ type: "RESET_ORDER_STATE" });

          } catch (err) {
            console.error("Payment verification failed:", err.message);
          }
        },

        prefill: {
          name: orderDetails.userName,
          email: orderDetails.userEmail
        },

        theme: {
          color: "#f97316"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      // cart already converted to order
      clearCart();
      setCartLoading(false);

    }
    catch(err){
    console.log(err.message);
    dispatchOrderState({type:"ERROR", payload:{message:err.message}});
    setCartLoading(false);
  }

  }  


  const cancelOrder = async(orderID)=>{
    console.log("Inside cancel order");
    console.log("CANCEL_ORDER:",orderID);
    dispatchOrderState({type:"LOADING"});
    try{
      const res = await fetch(`http://localhost:3000/orders/cancel`,{
        method:"DELETE",
         headers:{"Content-Type":"application/json"},
        body:JSON.stringify({orderId: orderID}),
        credentials:"include"
      });

      if(!res.ok){
          const {message} = await res.json();
          throw new Error (message);
        }
      dispatchOrderState({type:"RESET_ORDER_STATE"});

    }
    catch(err){
      console.log(err.message);
      dispatchOrderState({type:"ERROR", payload:{message:err.message}});
    }
  }

  //Set Loading 

  const setLoading = (isLoading)=>{
    if(isLoading) dispatchOrderState({type:"LOADING"});
    else if(!isLoading) dispatchOrderState({type:"IDLE"});
    else{
      return;
    }
  }

  const resetOrderState = ()=>{
    dispatchOrderState({type:"RESET_ORDER_STATE"});
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  const value = useMemo(() => ({
    ...orderState,
    fetchOrders,
    createOrder,
    cancelOrder,
    setLoading,
    resetOrderState
  }),[orderState]);
  

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );

}


export const useOrder = () => {
    const ctx = useContext(OrderContext);
    if (!ctx) throw new Error("useOrder must be used inside OrderProvider");
    return ctx;
}