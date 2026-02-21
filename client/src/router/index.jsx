import { createBrowserRouter } from "react-router-dom";
import App from "../App.jsx";
import { ProtectedRoute } from "../shared/store/auth-context.jsx";

import userRoutes from "./user.routes.jsx";
import adminRoutes from "./admin.routes.jsx";
import staffRoutes from "./staff.routes.jsx";
import NotFoundPage from "../modules/user/pages/404NotFound.jsx";
import ScrollToTop from "../shared/components/ScrollOnTop.jsx";
import kitchneRoutes from "./kitchen.routes.jsx";
const router = createBrowserRouter([
  {
    element: (
      <ScrollToTop>
        <App />
      </ScrollToTop>
    ),
    children: [
      
      userRoutes, 

      // 2. ADMIN PROTECTED ROUTES
      {
        element: <ProtectedRoute allowedRoles={['admin']} />,
        // The routes go here in the route object, NOT inside the element prop
        children: Array.isArray(adminRoutes) ? adminRoutes : [adminRoutes], 
      },

      // 3. STAFF PROTECTED ROUTES
      {
        element: <ProtectedRoute allowedRoles={['staff', 'admin']} />,
        children: Array.isArray(staffRoutes) ? staffRoutes : [staffRoutes],
      },
      {
        element: <ProtectedRoute allowedRoles={['staff', 'admin']} />,
        children: Array.isArray(kitchneRoutes) ? kitchneRoutes : [kitchneRoutes],
      },

      // 4. CATCH-ALL (404)
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

export default router;