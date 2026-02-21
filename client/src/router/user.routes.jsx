import LoginPage from "../modules/auth/pages/LoginPage";
import ResetPasswordPage from "../modules/auth/pages/ResetPasswordPage";
import SignupPage from "../modules/auth/pages/SignUpPage";
import UserLayout from "../modules/user/layout/UserLayout";
import CanteenHome from "../modules/user/pages/CanteenHome";
import CartPage from "../modules/user/pages/CartPage";
import MenuPage from "../modules/user/pages/MenuPage";
import OrdersPage from "../modules/user/pages/OrdersPage";
import ProfilePage from "../modules/user/pages/ProfilePage";



const userRoutes = {
 path:'/',
 element:<UserLayout/>,
 children:[
  { 
    index: true,
    element:<CanteenHome/> },
  { 
    path:'menu', 
    element:<MenuPage/>},
  {
    path:'cart',
    element:<CartPage/>
  },
  {
    path:'orders',
    element:<OrdersPage/>
  },
  {
    path:'profile',
    element:<ProfilePage/>
  },
  {
    path:'login',
    element:<LoginPage/>
  },
  {
    path:'signup',
    element:<SignupPage/>
  },
  {
    path:'reset-password',
    element:<ResetPasswordPage/>
  }
 ]


}

export default userRoutes;
