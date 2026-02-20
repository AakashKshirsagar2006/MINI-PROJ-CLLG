import { useState } from "react";
import { useContext } from "react";
import { FiUserPlus, FiShoppingCart } from "react-icons/fi";
import { FaRegCircleUser } from "react-icons/fa6";
import { PiSignInBold } from "react-icons/pi";
import { AiOutlineHome } from "react-icons/ai";
import { BsCart3 } from "react-icons/bs";
import { HiOutlineRectangleStack } from "react-icons/hi2";
import { FiUserX } from "react-icons/fi";
//After Login
import { CgProfile } from "react-icons/cg";
import { BsBoxSeam } from "react-icons/bs";
import { CiLogout } from "react-icons/ci";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../shared/store/auth-context";
import { useCart } from "../../../shared/store/cart-context";

import { useOrder } from "../../../shared/store/order-context";
import useAuth from "../../../shared/hooks/useAuth";


const HeaderAndNav = () => {
  const { totalQty } = useCart();

  const { userState, logout } = useAuth();



  const { orderDetails } = useOrder();

  return (
    <>

      {/* ================================================================
        COMPONENT: HEADER (DESKTOP)
        - Visible only on medium screens and up (hidden md:flex)
        - Sticky at the top with glassmorphism (backdrop-blur)
        ================================================================ 
      */}
      <header className="hidden md:flex justify-between items-center py-5 px-10 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          {/* Circular Image Section */}
          <div className="relative w-14 h-14 overflow-hidden rounded-full border-2 border-slate-200 shadow-sm p-1.5">
            <img
              src="/fcritlogo.png"
              alt="FCRIT Logo"
              className="w-50px h-50px object-cover"
            />
          </div>

          {/* Brand Text */}
          <span className="text-2xl font-serif font-bold tracking-tighter text-slate-900">
            FCRIT Canteen
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="flex gap-8 text-sm font-medium text-slate-500">
          <NavLink to={'/'} className={({ isActive }) => isActive ? "text-slate-900 border-b-2 border-orange-500 pb-1" : "hover:text-orange-500 transition-colors"}>Home</NavLink>

          <NavLink to={'/menu'} className={({ isActive }) => isActive ? "text-slate-900 border-b-2 border-orange-500 pb-1" : "hover:text-orange-500 transition-colors"}>Menu</NavLink>

          {/* Cart */}
          <div className="relative">
            <NavLink
              to={"/cart"}
              className={({ isActive }) =>
                isActive
                  ? "text-slate-900 border-b-2 border-orange-500 pb-1"
                  : "hover:text-orange-500 transition-colors"
              }
            >
              Cart
            </NavLink>

            {totalQty > 0 && (
              <span className="absolute -top-3 -right-4 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 border-2 border-white text-[8px] font-bold text-white">
                {totalQty}
              </span>
            )}

            {orderDetails && (
              <span className="absolute -top-3 -right-4 flex h-3 w-3 items-center justify-center z-10">
                {/* The pulsating ring */}
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                {/* The solid dot */}
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border-2 border-white"></span>
              </span>
            )}
          </div>



          <NavLink to={userState ? "/orders" : "/signup"} className={({ isActive }) => isActive ? "text-slate-900 border-b-2 border-orange-500 pb-1" : "hover:text-orange-500 transition-colors"}>{userState ? "Orders" : "Signup"}</NavLink>


          <NavLink to={userState ? '/profile' : '/login'} className={({ isActive }) => isActive ? "text-slate-900 border-b-2 border-orange-500 pb-1" : "hover:text-orange-500 transition-colors"}>{
            userState ? "Profile" : "LogIn"
          }</NavLink>

        </nav>

        {/* User Actions */}
        <div className="flex items-center gap-6">
          <div
            onClick={userState ? logout : () => { }}
            className="flex flex-col items-center gap-1 cursor-pointer group">
            {/* SIgn Container */}
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-600 transition group-hover:bg-orange-100 group-hover:text-orange-600 group-hover:ring-2 group-hover:ring-orange-200">
              {userState ? <CiLogout className="w-5 h-5" /> : <FiUserX className="w-5 h-5" />}
            </div>

            <span className="text-[15px] font-bold text-slate-600 group-hover:text-orange-600 transition">
              {userState ? "LogOut" : ""}
            </span>
          </div>
        </div>
      </header>


      {/* ================================================================
        COMPONENT: MOBILE TOP BAR
        - Visible only on mobile (md:hidden) to show location/profile
        ================================================================ 
      */}
      <div className="md:hidden flex justify-between items-center px-4 py-2.5 bg-slate-50 sticky top-0 z-40">

        {/* Left Side: Brand */}
        <div>
          <div className="flex items-center gap-1 text-slate-900 font-bold text-base md:text-lg font-serif">
            <span>FCRIT Canteen</span>
          </div>
        </div>

        {/* Right Side: Profile (Icon + Name) */}
        <div
          onClick={userState ? logout : () => { }}
          // Changed flex-col to flex-row so the icon and text sit side-by-side instead of stacking
          className="flex flex-row items-center gap-2 cursor-pointer">

          {/* Reduced width/height from 10 to 8, and icon size from 5 to 4 */}
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 border border-white shadow-sm">
            {userState ? <CiLogout className="w-4 h-4" /> : <FiUserX className="w-4 h-4" />}
          </div>

          {/* Only render this span if logged in, making text slightly smaller */}
          {userState && (
            <span className="text-sm font-bold text-slate-900">
              LogOut
            </span>
          )}
        </div>

      </div>
      {/* ================================================================
        COMPONENT: MOBILE BOTTOM NAVIGATION
        ================================================================ 
      */}
      <nav className="fixed bottom-4 left-4 right-4 md:hidden z-50">
        <div className="bg-slate-900/90 backdrop-blur-lg rounded-2xl p-4 shadow-2xl shadow-black/20 flex justify-around items-center text-slate-400">

          <NavLink
            to={"/"}
            className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? "text-orange-500" : "hover:text-white transition"}`}>
            <div className="relative">
              <AiOutlineHome className="h-6 w-6" />
            </div>
            <span className="text-[15px] font-medium">Home</span>
          </NavLink>

          {/* Nav Item */}
          <NavLink
            to={"/menu"}
            className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? "text-orange-500" : "hover:text-white transition"}`}>
            <HiOutlineRectangleStack className="h-6 w-6" />
            <span className="text-[15px] font-medium">Menu</span>
          </NavLink>



          {/* Cart */}
          <NavLink
            to={"/cart"}
            className={({ isActive }) =>
              `${isActive
                ? "bg-orange-500 text-white"
                : "bg-white text-slate-900"
              } 
    relative p-3 rounded-full -mt-8 shadow-lg border-4 border-slate-300 
    hover:scale-110 transition flex items-center justify-center`
            }
          >
            <BsCart3 className="h-6 w-6" />

            {/* Badge Section */}
            {totalQty > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 border-2 border-white text-[10px] font-bold text-white">
                {totalQty}
              </span>
            )}

            {orderDetails && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center z-10">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border-2 border-white"></span>
              </span>
            )}
          </NavLink>



          {/* Signup*/}
          <NavLink
            to={userState ? "/orders" : "/signup"}
            className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? "text-orange-500" : "hover:text-white transition"}`}>
            <div className="relative">
              {userState ? <BsBoxSeam className="w-6 h-6" /> : <FiUserPlus className="w-6 h-6" />}
            </div>
            <span className="text-[15px] font-medium">{userState ? "Orders" : "SignUp"}</span>
          </NavLink>


          {/* login */}
          <NavLink
            to={userState ? "/profile" : "/login"}
            className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? "text-orange-500" : "hover:text-white transition"}`}>

            <div className="relative">
              {userState ? <CgProfile className="w-6 h-6" /> : <PiSignInBold className="w-6 h-6" />}
            </div>
            <span className="text-[15px] font-medium">{userState ? "Profile" : "LogIn"}</span>
          </NavLink>

        </div>
      </nav>
    </>
  )
}

export default HeaderAndNav;