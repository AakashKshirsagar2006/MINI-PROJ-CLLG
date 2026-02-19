import { createContext, useContext, useEffect, useReducer, useMemo, useState } from "react";
import { AuthContext } from "./auth-context";
const baseURL = import.meta.env.VITE_SERVER_BASE_URL;
const CartContext = createContext(null);

const initialState = {
  items: {},
  totalPrice: 0,
  totalQty: 0,
  loading: false
};

function cartReducer(state, action) {

  switch (action.type) {

    case "IDLE":
      return { ...state, loading: false };

    case "LOADING":
      return { ...state, loading: true };

    case "REHYDRATE": {
      const items = { ...action.payload.items };

      for (let key in items) {
        const storedQty = parseInt(
          localStorage.getItem(`cart_item_${key}`),
          10
        );

        items[key].qty = Number.isInteger(storedQty) && storedQty > 0 
          ? storedQty
          : 1;
      }

      const totalQty = Object.values(items).reduce(
        (sum, item) => sum + item.qty,
        0
      );

      const totalPrice = Object.values(items).reduce(
        (sum, item) => sum + item.qty * item.price,
        0
      );

      return {
        ...state,
        items,
        totalQty,
        totalPrice,
        loading: false
      };
    }



    case "ADD": {
      const item = action.payload.item;
      const items = { ...state.items, [item._id]: { ...item, qty: 1 } };
      localStorage.setItem(`cart_item_${item._id}`, 1);
      return {
        items,
        totalQty: Object.keys(items).reduce((sum, key) => sum + items[key].qty, 0),
        totalPrice: state.totalPrice + action.payload.item.price,
        loading: false
      };
    }


    case "UPDATE_QTY": {

     const { itemID, delta } = action.payload;
     const item = state.items[itemID];

      if (!item) return state;
      console.log("Item Qty datatype:", typeof item.qty);
      const newQty = (item.qty) + delta;

      // Hard constraints
      if (newQty < 1) return state;
      if (state.totalQty + delta > 15) return state;

      const updatedItem = { ...item, qty: newQty };

      const items = {
        ...state.items,
        [itemID]: updatedItem
      };

      localStorage.setItem(`cart_item_${itemID}`, newQty);

      return {
        ...state,
        items,
        totalQty: state.totalQty + delta,
        totalPrice: state.totalPrice + delta * item.price,
        loading: false
      };
    }




    case "DELETE": {
      const itemID = action.payload.itemID;
      const items = { ...state.items };
      const item = items[itemID];
      if (!item) return state; // Item not found, no deletion
      const { qty, price } = item;
      delete items[itemID];
      localStorage.removeItem(`cart_item_${itemID}`);
      return {
        items,
        totalQty: state.totalQty - qty,
        totalPrice: state.totalPrice - qty * price,
        loading: false
      };
    }
    

    case "CLEAR":
      localStorage.clear();
      return initialState;
    case "ERROR":
      console.error(action.payload.message);
      return { ...state, loading: false };

    default:
      return state;
  }
}


export const CartProvider = ({ children }) => {
  const {userState} = useContext(AuthContext);
  const [cartState, dispatchCart] = useReducer(cartReducer, initialState);

  // ---------------------------
  // Fetch cart (hydrate)
  // ---------------------------
  const fetchCart = async () => {
      if(!userState){
        dispatchCart({ type: "CLEAR" });
        return;
      }
    try {
      dispatchCart({ type: "LOADING" });
      const res = await fetch(baseURL+"/cart/get", {
        method: "GET",
        credentials: "include"
      });
      const data = await res.json()
      if (!res.ok) throw new Error(data.errors[0]);

      let cartItems = {};
      console.log("Cart items from server:", data.items);
      data.items.forEach(item => {
        cartItems[item._id.toString()] = item;
      });
      dispatchCart({ type: "REHYDRATE", payload: { items: cartItems } });
    } catch (err) {
      dispatchCart({ type: "ERROR", payload: { message: err.message } })
    }
  };

  // ---------------------------
  // Cart mutations
  // ---------------------------

  const updateQuantity = (itemID, delta) => {
    dispatchCart({
      type: "UPDATE_QTY",
      payload: { itemID, delta }
    });
  };



  const addToCart = async (itemID) => {
    if(!userState) return;
    console.log("Adding to cart:", itemID);
    try {
      dispatchCart({ type: "LOADING" });
      const res = await fetch(baseURL+"/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ itemID })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.errors?.[0]);
      dispatchCart({ type: "ADD", payload: { item: data.item } });
    } catch (err) {
      dispatchCart({ type: "ERROR", payload: { message: err.message } })
    }
  };


  const removeItem = async (foodItemID) => {
    try {
      dispatchCart({ type: "LOADING" });
      const res = await fetch(
        `${baseURL}/cart/remove/${foodItemID}`,
        { method: "DELETE", credentials: "include" }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.errors?.[0]);
      const itemID = data.itemID;
      dispatchCart({ type: "DELETE", payload: { itemID } });
    } catch (err) {
      dispatchCart({ type: "ERROR", payload: { message: err.message } })
    }
  };

  const clearCart = async () => {
    dispatchCart({ type: "LOADING" });
    try {
      const res = await fetch(baseURL+"/cart/clear", {
        method: "DELETE",
        credentials: "include"
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.errors[0]);
      dispatchCart({ type: "CLEAR" })
    } catch (err) {
      dispatchCart({ type: "ERROR", payload: { message: err.message } })
    }
  };

  const setCartLoading = (isLoading) => {
    dispatchCart({ type: isLoading ? "LOADING" : "IDLE" });
  };


  useEffect(() => {
    fetchCart();
  }, [userState]);


  const value = useMemo(() => ({
    ...cartState,
    fetchCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    setCartLoading
  }), [cartState]);


  return (
    <CartContext.Provider
      value={value}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};
