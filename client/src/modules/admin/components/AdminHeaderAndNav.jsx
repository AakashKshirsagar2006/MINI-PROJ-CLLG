import { NavLink } from "react-router-dom";
import { 
  IoSearch,
  IoReceiptOutline,     
  IoNutritionOutline,   
  IoCreateOutline,      
  IoSettingsOutline,   
  IoHourglassOutline   
} from "react-icons/io5";
import { FiUserX } from "react-icons/fi";
import { CiLogout } from "react-icons/ci";
import useAuth from "../../../shared/hooks/useAuth";

const AdminHeaderAndNav = ()=>{
const {userState, logout} = useAuth();
  return (
    <>
     <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex justify-between items-center">
            
            {/* Logo */}
            <h1 className="text-xl font-serif font-bold text-slate-900">Admin<span className="text-orange-500">Panel</span></h1>
            
            {/* DESKTOP NAVIGATION (Hidden on Mobile) */}
            <nav className="hidden md:flex items-center gap-8">
                <NavLink to="/admin/" end className={({isActive}) => `text-sm font-bold transition ${isActive ? 'text-orange-600' : 'text-slate-500 hover:text-slate-900'}`}>Current Orders</NavLink>
                <NavLink to="/admin/pending" className={({isActive}) => `text-sm font-bold transition ${isActive ? 'text-orange-600' : 'text-slate-500 hover:text-slate-900'}`}>Pending</NavLink>
                <NavLink to="/admin/stock-actions" className={({isActive}) => `text-sm font-bold transition ${isActive ? 'text-orange-600' : 'text-slate-500 hover:text-slate-900'}`}>Stock Actions</NavLink>
                <NavLink to="/admin/booking" className={({isActive}) => `text-sm font-bold transition ${isActive ? 'text-orange-600' : 'text-slate-500 hover:text-slate-900'}`}>Manual Booking</NavLink>
                <NavLink to="/admin/dashboard" className={({isActive}) => `text-sm font-bold transition ${isActive ? 'text-orange-600' : 'text-slate-500 hover:text-slate-900'}`}>Admin Space</NavLink>
            </nav>

            {/* Search & Profile */}
            <div className="flex items-center gap-4">
                <div
                          onClick={userState ? ()=>{logout()} : () => { }}
                          className="flex flex-col items-center gap-1 cursor-pointer">
                          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 border border-white shadow-sm">
                            {userState ? <CiLogout className="w-5 h-5" /> : <FiUserX className="w-5 h-5" />}
                          </div>
                          <span className="text-[15px] font-bold text-slate-900">
                            {userState ? "LogOut" : ""}
                          </span>
                        </div>
            </div>
        </div>
      </header>

       <nav className="fixed bottom-4 left-4 right-4 md:hidden z-50">
        <div className="bg-slate-900/90 backdrop-blur-lg rounded-2xl p-4 shadow-2xl shadow-black/20 flex justify-around items-center text-slate-400">

          {/* 1. Current Orders (Home) */}
          <NavLink
            to={"/admin/"}
            end
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
            to={"/admin/dashboard"}
            className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? "text-orange-500" : "hover:text-white transition"}`}>
            <div className="relative">
               <IoSettingsOutline className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-medium">Admin</span>
          </NavLink>

        </div>
      </nav>
    </>
  )
}

export default AdminHeaderAndNav;