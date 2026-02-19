import { NavLink } from "react-router-dom";
import {
  IoCheckmarkCircleOutline,
  IoReceiptOutline,
  IoHourglassOutline,
  IoSearchOutline // Added a specific search icon for clarity
} from "react-icons/io5";
import { useState } from "react";
import useAuth from "../../../shared/hooks/useAuth";
import { FiUserX } from "react-icons/fi";
import { CiLogout } from "react-icons/ci";

const HeaderAndNav = ({ currentOrdersState, setCurrentOrdersState }) => {
  const {userState,logout} = useAuth();
  const [filter, setFilter] = useState("");
  
  // Helper function for button styling to keep JSX clean
  const getDesktopButtonClass = (stateName) => {
    
    const isActive = currentOrdersState === stateName;
    return `px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 border ${
      isActive
        ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20"
        : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-700 hover:border-slate-300"
    }`;
  };

  return (
    <>
      {/* =======================
          TOP HEADER (Sticky)
         ======================= */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
          
          {/* Row 1: Logo & Profile (and Desktop Nav) */}
          <div className="h-16 flex justify-between items-center">
            
            {/* Logo */}
            <h1 className="text-xl font-serif font-bold text-slate-900">
              Staff <span className="text-orange-500">Dashboard</span>
            </h1>

            {/* 1. DESKTOP NAVIGATION (Buttons) */}
            <nav className="hidden md:flex items-center gap-12">
              <button
                onClick={() => setCurrentOrdersState("PENDING")}
                className={getDesktopButtonClass("PENDING")}
              >
                Pending
              </button>
              <button
                onClick={() => setCurrentOrdersState("PREPARING")}
                className={getDesktopButtonClass("PREPARING")}
              >
                Preparing
              </button>
              <button
                onClick={() => setCurrentOrdersState("READY")}
                className={getDesktopButtonClass("READY")}
              >
                Ready
              </button>
            </nav>

            {/* Desktop Search & Profile */}
             {/* Search & Profile */}
                        <div className="flex items-center gap-4">
                            <div
                                      onClick={userState ? ()=>{logout()} : () => { }}
                                      className="flex flex-col items-center gap-1">
                                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 border border-white shadow-sm">
                                        {userState ? <CiLogout className="w-5 h-5" /> : <FiUserX className="w-5 h-5" />}
                                      </div>
                                      <span className="text-[15px] font-bold text-slate-900">
                                        {userState ? "LogOut" : ""}
                                      </span>
                                    </div>
                        </div>
          </div>

          {/* 2. MOBILE SEARCH BAR (Visible only on mobile, inside sticky header) */}
          <div className="md:hidden pb-4">
            <div className="flex items-center gap-2 bg-slate-100 px-4 py-2.5 rounded-xl border border-slate-200 w-full">
              <IoSearchOutline className="text-slate-400 text-lg" />
              <input
                type="text"
                placeholder="Search Order ID..."
                className="bg-transparent text-sm focus:outline-none w-full text-slate-700 placeholder:text-slate-400"
              />
            </div>
          </div>

        </div>
      </header>

      {/* =======================
          MOBILE NAVIGATION (Bottom Sticky)
         ======================= */}
      <nav className="fixed bottom-4 left-4 right-4 md:hidden z-50">
        <div className="bg-slate-900/90 backdrop-blur-lg rounded-2xl p-2 shadow-2xl shadow-black/20 flex justify-around items-center text-slate-400 border border-white/10">
          
          {/* Current Orders (Pending) */}
          <button
            onClick={() => setCurrentOrdersState("PENDING")}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl w-full transition-all ${
              currentOrdersState === "PENDING"
                ? "text-orange-400 bg-white/10"
                : "hover:text-white"
            }`}
          >
            <div className="relative">
              <IoReceiptOutline className="h-6 w-6" />
            </div>
            <span className="text-xs font-medium">Pending</span>
          </button>

          {/* Preparing Orders */}
          <button
            onClick={() => setCurrentOrdersState("PREPARING")}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl w-full transition-all ${
              currentOrdersState === "PREPARING"
                ? "text-orange-400 bg-white/10"
                : "hover:text-white"
            }`}
          >
            <IoHourglassOutline className="h-6 w-6" />
            <span className="text-xs font-medium">Preparing</span>
          </button>

          {/* Ready Orders */}
          <button
            onClick={() => setCurrentOrdersState("READY")}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl w-full transition-all ${
              currentOrdersState === "READY"
                ? "text-orange-400 bg-white/10"
                : "hover:text-white"
            }`}
          >
            <IoCheckmarkCircleOutline className="h-6 w-6" />
            <span className="text-xs font-medium">Ready</span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default HeaderAndNav;