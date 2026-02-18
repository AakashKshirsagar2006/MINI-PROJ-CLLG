import AdminLayout from "../modules/admin/layout/AdminLayout.jsx";
// We will create these 3 pages in the next step:
import AdminDashboard from "../modules/admin/pages/AdminDashboardPage.jsx"; 
import AdminHomePage from "../modules/admin/pages/AdminHomePage.jsx";
import AdminStockActions from "../modules/admin/pages/AdminStockActions.jsx";
import PlainMessage from "../shared/components/PlainMessage.jsx";

const adminRoutes = {
  path: "/admin",
  element: <AdminLayout />,
  children: [
    { index: true, element: <AdminHomePage /> },
    { path: '/admin/dashboard', element: <AdminDashboard/> },
    { path: '/admin/stock-actions', element: <AdminStockActions/> },
    { 
      path: "*", 
      element: <PlainMessage
       head={"404 Page Not Found !"}
       linkTo="Admin Dashboard"
       link="/admin"
       >
        The page you are looking for is not available
       </PlainMessage> 
    },
  ],
};

export default adminRoutes;