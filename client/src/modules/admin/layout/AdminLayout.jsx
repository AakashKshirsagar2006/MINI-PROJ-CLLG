import AdminHomePage from "../pages/AdminDashBoard"

import AuthContextProvider from "../../../shared/store/auth-context";
import OrderManagementProvider from "../../../shared/store/order-management-context";
import AdminHeaderAndNav from "../components/AdminHeaderAndNav";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {

   return (
   <AuthContextProvider>
      <OrderManagementProvider>
   <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-28 md:pb-12">
    <AdminHeaderAndNav/>
    <Outlet/>
    </div>

      </OrderManagementProvider>
    </AuthContextProvider>
   )
  
}

export default AdminLayout;