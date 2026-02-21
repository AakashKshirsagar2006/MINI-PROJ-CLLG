import { KitchenBatchDashboard } from "../modules/kitchen/KitchenDashBoard";
import KitchenLayout from "../modules/kitchen/KitchenLayout";
import PlainMessage from "../shared/components/PlainMessage";
const kitchneRoutes = {
  path:'/kitchen',
  element:
  <KitchenLayout/>,
  children:[
    { 
      path: "*", 
      element: <PlainMessage
       head={"404 Page Not Found !"}
       linkTo="Home"
       link="/"
       >
        The page you are looking for is not available
       </PlainMessage> 
    },
  ]
}

export default kitchneRoutes;