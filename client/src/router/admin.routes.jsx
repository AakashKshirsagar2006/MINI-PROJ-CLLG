import AdminLayout from "../modules/admin/layout/AdminLayout.jsx";
import AdminActionPage from "../modules/admin/pages/AdminActionPage.jsx";
import AdminDashboard from "../modules/admin/pages/AdminDashBoard.jsx";
import PlainMessage from "../shared/components/PlainMessage.jsx";
import AdminAnalytics from "../modules/admin/pages/AdminAnalytics.jsx";



const adminRoutes = {
  path: "/admin",
  element:
  <AdminLayout />,
  children: [
    { index: true, element: <AdminDashboard /> },
    { path: '/admin/analytics', element: <AdminAnalytics /> },
    {path:'/admin/settings', element: <AdminActionPage/>},
    { path: "*", 
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
