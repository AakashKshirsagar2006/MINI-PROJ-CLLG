import LoginPage from "../modules/auth/pages/LoginPage";
import ResetPasswordPage from "../modules/auth/pages/ResetPasswordPage";
import SignupPage from "../modules/auth/pages/SignupPage";


const authRoutes = {
   path:'/',
   children:[
    {
      path:'login',
      element: <LoginPage/>
    },
    {
      path:'reset-password',
      element:<ResetPasswordPage/>
    },
    {
      path:'signup',
      element:<SignupPage/>
    }
   ]
}

export default authRoutes;