import React, { useState, useRef } from 'react';
import NestedNavigation from '../components/dashboard/components/NestedNavigation';
import { 
  IoGridOutline, 
  IoFastFoodOutline, 
  IoPeopleOutline, 
  IoTimeOutline, 
  IoSettingsOutline, 
  IoLogOutOutline,
  IoMenu, 
  IoClose,
  IoSearchOutline,
  IoNotificationsOutline,
  IoTrendingUp,
  IoWalletOutline,
  IoCartOutline,
  IoAdd,
  IoCloudUploadOutline,
  IoPencilOutline,
  IoTrashOutline,
  IoCloseCircle,
  IoCheckmarkCircle
} from "react-icons/io5";
import SideBarNav from '../components/dashboard/components/SideBarNav';
import AnalyticsPage from '../components/dashboard/AnalyticsPage';
import FoodManagementPage from '../components/dashboard/FoodManagementPage';
import AdminPaymentLogs from '../components/dashboard/AdminPaymentLogs';

const AdminDashboard = () => {
  // --- STATE MANAGEMENT ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState('dashboard'); // dashboard, menu, staff, history
   const [nestedNavigationTabs, setNestedNavigationTabs] = useState(["ADD","UPDATE","DELETE"])

 const [foodManagementPageState, setFoodManagementPageState] = useState("ADD");
    
  // Food Form State
  

  // --- MOCK DATA ---
  

  

  const pastOrders = [
    { id: "#ORD-9921", date: "Oct 24, 2023", customer: "Aditi Gupta", total: "₹450", status: "Completed" },
    { id: "#ORD-9920", date: "Oct 24, 2023", customer: "Rahul Singh", total: "₹120", status: "Cancelled" },
    { id: "#ORD-9919", date: "Oct 23, 2023", customer: "John Doe", total: "₹850", status: "Completed" },
  ];

  // --- HANDLERS ---
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  
 

  

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex">

     <SideBarNav 
     isSidebarOpen={isSidebarOpen} 
     setActiveView={setActiveView}
     setIsSidebarOpen={setIsSidebarOpen}
     activeView= {activeView}
     toggleSidebar={toggleSidebar}
     />

      {/* ================================================================
         MAIN CONTENT AREA
         ================================================================ 
      */}
      <main className="flex-1 w-full overflow-x-hidden">
        
       <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 md:px-6 py-3 flex items-center justify-between">
  
  {/* Left Section */}
  <div className="flex items-center gap-3 flex-1">
    <button onClick={toggleSidebar} className="p-2 -ml-2 text-slate-600 md:hidden rounded-lg hover:bg-slate-100 shrink-0">
      <IoMenu className="text-2xl" />
    </button>
    {/* Keep title visible but allow it to shrink if needed */}
    <h2 className="text-lg font-bold text-slate-900 capitalize hidden md:block whitespace-nowrap">
      {activeView === 'dashboard' ? 'Analytics Dashboard' : activeView}
    </h2>
  </div>

  {/* Middle Section: Navigation */}
  <div className="flex-none px-2">
     <NestedNavigation setFoodManagementPageState={setFoodManagementPageState} tabs={nestedNavigationTabs}/>
  </div>

  
</header>

         {activeView === 'dashboard' && (
             <AnalyticsPage/>
          )}

         {activeView === 'menu' && (
            <FoodManagementPage
             pageState = {foodManagementPageState}
         />)}
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          
          {/* ================= VIEW 1: ANALYTICS DASHBOARD ================= */}
         


          {/* ================= VIEW 2: MENU MANAGEMENT ================= */}
        


          {/* ================= VIEW 4: PAST DATA (HISTORY) ================= */}
          {activeView === 'history' && (
             <AdminPaymentLogs/>
          )}

        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;