import AdminActionContextProvider from "../../../shared/store/admin-action-context";
import AuthContextProvider from "../../../shared/store/auth-context";
import FoodItemsContextProvider from "../../../shared/store/food-item-context-store"; // Ensure you have this path correct
import OrderManagementProvider from "../../../shared/store/order-management-context";
import AdminHeaderAndNav from "../components/AdminHeaderAndNav"; // We will update this component next
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
   return (
      <FoodItemsContextProvider>
      <AdminActionContextProvider>
      <OrderManagementProvider>
         <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-28 md:pb-12">
            <AdminHeaderAndNav/>
            <Outlet/>
         </div>
      </OrderManagementProvider>
      </AdminActionContextProvider>
      </FoodItemsContextProvider>
   )
}

export default AdminLayout;