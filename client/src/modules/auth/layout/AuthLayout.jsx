import Footer from "../../user/components/Footer"
import HeaderAndNav from "../../user/components/HeaderAndNav"
import { Outlet } from "react-router-dom"
import { CartProvider } from "../../../shared/store/cart-context"
import FoodItemsContextProvider from "../../../shared/store/food-item-context-store"
import { OrderProvider } from "../../../shared/store/order-context"
const AuthLayout = ()=>{
  return (
    <>
    <FoodItemsContextProvider>
    <CartProvider>
      <OrderProvider>
    <HeaderAndNav/>
    <Outlet/>
    <Footer/>
    </OrderProvider>
    </CartProvider>
    </FoodItemsContextProvider>
    </>
  )
}

export default AuthLayout;