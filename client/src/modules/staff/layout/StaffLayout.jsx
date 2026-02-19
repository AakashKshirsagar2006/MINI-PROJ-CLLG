import AuthContextProvider from "../../../shared/store/auth-context"
import OrderManagementProvider from "../../../shared/store/order-management-context"
import HeaderAndNav from "../components/HeaderAndNav"
import StaffDashBoardPage from "../components/StaffDashBoardPage"
import StaffMainPage from "../pages/StaffMainPage"


const StaffLayout = ()=>{
  return (
  <OrderManagementProvider>
   <StaffMainPage/>
   </OrderManagementProvider>
  )
}

export default StaffLayout;