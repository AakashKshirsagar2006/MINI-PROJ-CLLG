
import { useCart } from "../../../shared/store/cart-context";
import { useOrder } from "../../../shared/store/order-context";
import { HiArrowNarrowRight } from "react-icons/hi";
import CartFoodItemCard from "./CartFooItemCard";
const CartFoodItemQtyMng = () => {

  const { items, totalQty, totalPrice, loading, updateQuantity, removeItem } = useCart();
  const { createOrder } = useOrder();

  return (

    <main className="max-w-3xl mx-auto px-4 md:px-6 py-8 space-y-8">
      <div className="md:hidden w-full mb-6">
        <button
          onClick={() => { createOrder(items) }}
          disabled={loading}
          className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-slate-900/20 hover:bg-orange-500 hover:shadow-orange-500/30 transition flex justify-between px-6 items-center group">
          <span>Proceed To Checkout ₹{totalPrice}</span>

          {/* Proceed to Pay button */}
          <span className="flex items-center gap-2 text-sm font-medium bg-white/10 px-3 py-1 rounded-full group-hover:bg-white/20">
            Proceed
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </span>
        </button>
      </div>

      {/* ================================================================
          COMPONENT: CART ITEMS LIST
          ================================================================ 
        */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 px-2">Order Summary</h3>

        {
          Object.keys(items).map((key) => (
            <CartFoodItemCard
              cartFoodItem={items[key]}
              key={key}
              item={items[key]}
              loadingState={loading}
              deleteFunction={() => removeItem(key)}
              updateQuantity={updateQuantity}
              totalQty={totalQty}
            />
          ))
        }
      </section>





      {/* ================================================================
          COMPONENT: BILL SUMMARY
          ================================================================ 
        */}
      <section className="bg-white p-6 rounded-[2rem] border border-slate-100">
        <div className="space-y-3">

          <div className="flex justify-between text-slate-500 text-sm">
          </div>
          <div className="my-2 border-t border-dashed border-slate-200"></div>
          <div className="flex justify-between items-center">
            <span className="font-bold text-slate-900 text-lg">Proceed To Checkout</span>
            <span className="font-bold text-slate-900 text-xl">₹{totalPrice}</span>
          </div>
        </div>

        <button
          onClick={() => { createOrder(items) }}
          disabled={loading}
          className="hidden md:flex w-full mt-6 bg-slate-900 text-white py-4 rounded-xl font-bold text-lg justify-center items-center gap-2 
             hover:bg-orange-500 transition shadow-xl shadow-slate-900/20 group
             disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-slate-900"
        >
          <span>{loading ? "Processing..." : "Proceed to Chekout"}</span>
          {!loading && (
            <HiArrowNarrowRight className="h-5 w-5" />
          )}
        </button>
      </section>
    </main>
  )
}

export default CartFoodItemQtyMng;