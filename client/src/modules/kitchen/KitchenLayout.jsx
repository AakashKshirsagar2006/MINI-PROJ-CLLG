import OrderManagementProvider from "../../shared/store/order-management-context"
import { KitchenBatchDashboard } from "./KitchenDashBoard"

const KitchenLayout = ()=>{
  return (
    <OrderManagementProvider>
      <KitchenBatchDashboard/>
    </OrderManagementProvider>
  )
}

export default KitchenLayout;