import { NavLink } from "react-router-dom";
import { 
  IoSearch,
  IoReceiptOutline,     
  IoNutritionOutline,   
  IoCreateOutline,      
  IoSettingsOutline,   
  IoHourglassOutline   
} from "react-icons/io5";
import { IoStatsChartOutline } from "react-icons/io5"; //for analytics
import { IoWalletOutline } from "react-icons/io5"; //for payments

const AdminHeaderAndNav = ()=>{
  return (
    <>
     <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex justify-between items-center">
            
            {/* Logo */}
            <h1 className="text-xl font-serif font-bold text-slate-900">Admin<span className="text-orange-500">Panel</span></h1>
            
            {/* DESKTOP NAVIGATION (Hidden on Mobile) */}
            <nav className="hidden md:flex items-center gap-8">
                <NavLink to="/admin/dashboard" className={({isActive}) => `text-sm font-bold transition ${isActive ? 'text-orange-600' : 'text-slate-500 hover:text-slate-900'}`}>Current Orders</NavLink>
                <NavLink to="/admin/pending" className={({isActive}) => `text-sm font-bold transition ${isActive ? 'text-orange-600' : 'text-slate-500 hover:text-slate-900'}`}>Pending</NavLink>
                <NavLink to="/admin/stock" className={({isActive}) => `text-sm font-bold transition ${isActive ? 'text-orange-600' : 'text-slate-500 hover:text-slate-900'}`}>Stock Actions</NavLink>
                <NavLink to="/admin/booking" className={({isActive}) => `text-sm font-bold transition ${isActive ? 'text-orange-600' : 'text-slate-500 hover:text-slate-900'}`}>Manual Booking</NavLink>
                <NavLink to="/admin/settings" className={({isActive}) => `text-sm font-bold transition ${isActive ? 'text-orange-600' : 'text-slate-500 hover:text-slate-900'}`}>Admin Space</NavLink>
                <NavLink to="/admin/analytics" className={({isActive}) => `text-sm font-bold transition ${isActive ? 'text-orange-600' : 'text-slate-500 hover:text-slate-900'}`}>Analytics</NavLink>
                <NavLink to="/admin/payments" className={({isActive}) => `text-sm font-bold transition ${isActive ? 'text-orange-600' : 'text-slate-500 hover:text-slate-900'}`}>Payment Logs</NavLink>
            </nav>

            {/* Search & Profile */}
            <div className="flex items-center gap-4">
                 <div className="hidden md:flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full">
                    <IoSearch className="text-slate-400"/>
                    <input type="text" placeholder="Search Order ID..." className="bg-transparent text-sm focus:outline-none w-48"/>
                 </div>
                 <div className="w-9 h-9 bg-slate-900 rounded-full text-white flex items-center justify-center font-bold text-sm">A</div>
            </div>
        </div>
      </header>

       <nav className="fixed bottom-4 left-4 right-4 md:hidden z-50">
        <div className="bg-slate-900/90 backdrop-blur-lg rounded-2xl p-4 shadow-2xl shadow-black/20 flex justify-around items-center text-slate-400">

          {/* 1. Current Orders (Home) */}
          <NavLink
            to={"/admin/dashboard"}
            className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? "text-orange-500" : "hover:text-white transition"}`}>
            <div className="relative">
              <IoReceiptOutline className="h-6 w-6" />
            </div>
            <span className="text-[10px] font-medium">Orders</span>
          </NavLink>

          {/* 2. Pending Orders */}
          <NavLink
            to={"/admin/pending"}
            className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? "text-orange-500" : "hover:text-white transition"}`}>
            <IoHourglassOutline className="h-6 w-6" />
            <span className="text-[10px] font-medium">Pending</span>
          </NavLink>

          {/* 3. Manual Booking (FEATURED FLOATING BUTTON) */}
          <NavLink
            to={"/admin/booking"}
            className={({ isActive }) =>
              `${isActive
                ? "bg-orange-500 text-white"
                : "bg-white text-slate-900"
              } 
            relative p-3 rounded-full -mt-8 shadow-lg border-4 border-slate-300 
            hover:scale-110 transition flex items-center justify-center`
            }
          >
            <IoCreateOutline className="h-6 w-6" />
            {/* Optional Badge if needed */}
            {/* <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 border border-white text-[8px] font-bold text-white">!</span> */}
          </NavLink>

          {/* 4. Quick Stock */}
          <NavLink
            to={"/admin/stock"}
            className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? "text-orange-500" : "hover:text-white transition"}`}>
            <div className="relative">
               <IoNutritionOutline className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-medium">Stock</span>
          </NavLink>

          {/* 5. Admin Space */}
          <NavLink
            to={"/admin/settings"}
            className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? "text-orange-500" : "hover:text-white transition"}`}>
            <div className="relative">
               <IoSettingsOutline className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-medium">Admin</span>
          </NavLink>

          {/* 6. Analytics */}
          <NavLink
            to={"/admin/analytics"}
            className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? "text-orange-500" : "hover:text-white transition"}`}>
            <div className="relative">
              <IoStatsChartOutline className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-medium">Stats</span>
          </NavLink>
          {/* 7. Payment Logs */}
          <NavLink
            to={"/admin/payments"}
            className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? "text-orange-500" : "hover:text-white transition"}`}>
            <div className="relative">
              <IoWalletOutline className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-medium">Logs</span>
          </NavLink>

        </div>
      </nav>
    </>
  )
}

export default AdminHeaderAndNav;