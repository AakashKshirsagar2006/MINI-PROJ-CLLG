import { createBrowserRouter } from "react-router-dom";
import App from "../App.jsx";

import userRoutes from "./user.routes.jsx";
import adminRoutes from "./admin.routes.jsx";
import authRoutes from "./auth.routes.jsx";
import staffRoutes from "./staff.routes.jsx";
import NotFoundPage from "../modules/user/pages/404NotFound.jsx";



const router = createBrowserRouter([
  {
    element: <App />, 
    children: [
      userRoutes,
      adminRoutes,
      staffRoutes,
      authRoutes,
      
      { path: "*", element: <NotFoundPage/> },
    ],
  },
]);

export default router;
