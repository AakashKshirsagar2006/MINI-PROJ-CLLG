import { Outlet } from "react-router-dom";
import HeaderAndNav from "../components/HeaderAndNav";
import Footer from "../components/Footer";
import FoodItemsContextProvider from "../../../shared/store/food-item-context-store";
import FoodCategoryContextProvider from "../../../shared/store/category-context-store";
import { CartProvider } from "../../../shared/store/cart-context";
import { OrderProvider } from "../../../shared/store/order-context";


const UserLayout = () => (
  <>
  <FoodItemsContextProvider>
  <CartProvider>
    <OrderProvider>
  <FoodCategoryContextProvider>
    <HeaderAndNav/>
    <Outlet />
    <Footer/>
  </FoodCategoryContextProvider>
   </OrderProvider>
  </CartProvider>
  </FoodItemsContextProvider>
  </>
);

export default UserLayout;
