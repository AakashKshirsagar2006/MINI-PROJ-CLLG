// import { useContext, useEffect, useState } from "react";
// import { AuthContext } from "../../../shared/store/auth-context";
// import { useNavigate } from "react-router-dom";
// import PlainMessage from "../../../shared/components/PlainMessage";
// import { 
//   IoPencil, 
//   IoLogOutOutline, 
//   IoHelpCircleOutline, 
//   IoTrendingUp, 
//   IoFastFoodOutline
// } from "react-icons/io5";


// const ProfilePage = () => {
//   const navigate = useNavigate();
//   const { userState, setUserState } = useContext(AuthContext);

//   const Logout = async () => {
//     await fetch("http://localhost:3000/auth/logout", {
//       method: "POST",
//       credentials: "include"
//     });

//     setUserState(null);
//     navigate("/");
//   };
  
//   const [isEditing, setIsEditing] = useState(false);
//   const [expenseTimeframe, setExpenseTimeframe] = useState('Month'); 


//   const expenseData = {
//     Day: { total: 140, limit: 500, orders: 2, mostOrdered: "Cold Coffee" },
//     Week: { total: 850, limit: 2500, orders: 8, mostOrdered: "Veg Thali" },
//     Month: { total: 3400, limit: 5000, orders: 32, mostOrdered: "Chicken Burger" },
//     Year: { total: 12500, limit: 20000, orders: 145, mostOrdered: "Masala Dosa" },
//   };

//   const currentStats = expenseData[expenseTimeframe];

//   return (
//     <>
//     {!userState?<PlainMessage head={"Not Loged In !"} linkTo="Login" link="/login">Please Login to see your profile</PlainMessage>:
//     <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-24">

//       <main className="max-w-5xl mx-auto px-4 md:px-10 pt-24 pb-6 space-y-8">

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
//             {/* LEFT COLUMN: PROFILE */}
//             <div className="w-full h-full">
                
               
//                 <section className="bg-white rounded-[2.5rem] p-8 border border-slate-300 shadow-xl shadow-slate-200/50 relative overflow-hidden group h-full flex flex-col justify-center">
//                     <div className="relative z-10 flex flex-col items-center text-center">
                        
//                         {!isEditing ? (
//                             <>
//                                 <div className="w-24 h-24 rounded-full bg-slate-100 mb-4 flex items-center justify-center text-3xl font-serif text-slate-400">
//                                     {userState.name.charAt(0).toUpperCase()}
//                                 </div>
//                                 <h2 className="text-2xl font-serif font-bold text-slate-900">{userState.name}</h2>
//                                 <p className="text-slate-500 text-sm mb-1">{userState.email}</p>
//                                 <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-xs font-bold mt-2">
//                                     ID: {""}
//                                 </span>
//                                 <button 
//                                     onClick={() => setIsEditing(true)}
//                                     className="mt-6 flex items-center gap-2 text-sm font-bold text-slate-900 bg-slate-50 px-5 py-2.5 rounded-xl hover:bg-slate-900 hover:text-white transition"
//                                 >
//                                     <IoPencil /> Edit Profile
//                                 </button>
//                             </>
//                         ) : (
//                             <div className="w-full space-y-3 mt-2">
//                                 <input 
//                                     type="text" 
//                                     defaultValue={userState.name}
//                                     className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-orange-500 transition"
//                                     placeholder="Name"
//                                 />
//                                 <input 
//                                     type="text" 
//                                     defaultValue={"1234567890"}
//                                     className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-orange-500 transition"
//                                     placeholder="Phone"
//                                 />
//                                 <div className="flex gap-2 mt-4">
//                                     <button 
//                                         onClick={() => setIsEditing(false)}
//                                         className="flex-1 bg-slate-900 text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-slate-900/20"
//                                     >
//                                         Save
//                                     </button>
//                                     <button 
//                                         onClick={() => setIsEditing(false)}
//                                         className="flex-1 bg-white border border-slate-200 text-slate-500 py-3 rounded-xl text-sm font-bold hover:bg-slate-50"
//                                     >
//                                         Cancel
//                                     </button>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                     {/* Decorative Blob */}
//                     <div className="absolute -top-10 -left-10 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl"></div>
//                 </section>
//             </div>


//             {/* RIGHT COLUMN: ANALYTICS */}
//             <div className="w-full h-full"> 
                
                
//                 <section className="bg-white rounded-[2.5rem] p-8 border border-slate-300 shadow-sm h-full flex flex-col justify-between">
                    
//                     {/* Top Section */}
//                     <div>
//                         <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-8">
//                             <div>
//                                 <h2 className="text-xl font-serif font-bold text-slate-900">Analytics</h2>
//                                 <p className="text-slate-500 text-sm">Track your food spending</p>
//                             </div>
                            
//                             <div className="flex bg-slate-50 p-1 rounded-xl self-start">
//                                 {['Day', 'Week', 'Month', 'Year'].map((tab) => (
//                                     <button
//                                         key={tab}
//                                         onClick={() => setExpenseTimeframe(tab)}
//                                         className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${
//                                             expenseTimeframe === tab 
//                                             ? 'bg-white text-slate-900 shadow-sm' 
//                                             : 'text-slate-400 hover:text-slate-600'
//                                         }`}
//                                     >
//                                         {tab}
//                                     </button>
//                                 ))}
//                             </div>
//                         </div>

//                         <div className="grid grid-cols-2 gap-4">
//                             <div className="bg-orange-50 border border-orange-100 p-5 rounded-2xl">
//                                 <p className="text-xs font-bold text-orange-600 mb-1 uppercase tracking-wide">Total Spent</p>
//                                 <h3 className="text-3xl font-bold text-slate-900">₹{currentStats.total}</h3>
//                             </div>
//                             <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl">
//                                 <p className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wide">Orders</p>
//                                 <h3 className="text-3xl font-bold text-slate-900">{currentStats.orders}</h3>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Bottom Section */}
//                     <div className="mt-6 pt-6 border-t border-slate-50">
//                             <div className="flex items-center gap-3">
//                             <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
//                                 <IoFastFoodOutline />
//                             </div>
//                             <div>
//                                 <p className="text-xs text-slate-400 font-bold uppercase">Most Ordered</p>
//                                 <p className="text-sm font-bold text-slate-800">{currentStats.mostOrdered}</p>
//                             </div>
//                             </div>
//                     </div>
//                 </section>
//             </div>

//         </div>

//         {/* BOTTOM NAV */}
//         <section className="mt-12 w-full">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                
//                 <button className="flex w-full items-center justify-center gap-3 bg-white px-6 py-4 rounded-full border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
//                     <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-orange-50 group-hover:text-orange-600 transition shrink-0">
//                         <IoTrendingUp />
//                     </div>
//                     <span className="font-bold text-slate-700 text-sm whitespace-nowrap">Order History</span>
//                 </button>

//                 <button className="flex w-full items-center justify-center gap-3 bg-white px-6 py-4 rounded-full border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
//                     <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-orange-50 group-hover:text-orange-600 transition shrink-0">
//                         <IoHelpCircleOutline />
//                     </div>
//                     <span className="font-bold text-slate-700 text-sm whitespace-nowrap">Help & Support</span>
//                 </button>

//                 <button
//                 onClick={Logout}
//                 className="flex w-full items-center justify-center gap-3 bg-white px-6 py-4 rounded-full border border-red-50 shadow-sm hover:shadow-md hover:shadow-red-100/50 hover:-translate-y-1 transition-all duration-300 group">
//                     <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500 group-hover:bg-red-100 transition shrink-0">
//                         <IoLogOutOutline />
//                     </div>
//                     <span className="font-bold text-red-500 text-sm whitespace-nowrap">Log Out</span>
//                 </button>

//             </div>
//         </section>

//       </main>

//     </div>
// }
//     </>
//   );
// };

// export default ProfilePage;
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../shared/store/auth-context";
import { useNavigate } from "react-router-dom";
import PlainMessage from "../../../shared/components/PlainMessage";
import useAuth from "../../../shared/hooks/useAuth";
import { 
  IoLogOutOutline, 
  IoHelpCircleOutline, 
  IoTrendingUp, 
  IoWalletOutline,
  IoReceiptOutline
} from "react-icons/io5";
const baseURL = import.meta.env.VITE_SERVER_BASE_URL;

const ProfilePage = () => {
  const navigate = useNavigate();
  const { userState, setUserState } = useContext(AuthContext);
  const [stats, setStats] = useState({ totalSpent: 0, totalOrders: 0 });
  const [loading, setLoading] = useState(true);

  // --- 1. LOGOUT LOGIC ---
  const {logout} = useAuth();
  

  // --- 2. FETCH REAL STATS ---
  useEffect(() => {
    if(!userState) return;

    fetch(baseURL+"/orders/stats", {
        method: "GET",
        credentials: "include"
    })
    .then(res => res.json())
    .then(data => {
        setStats(data);
        setLoading(false);
    })
    .catch(err => {
        console.error(err);
        setLoading(false);
    });
  }, [userState]);

  // --- 3. HELP ALERT ---
  const showSupport = () => {
      alert("For support, please contact the Canteen Admin at:\n\nadmin@college-canteen.com\n+91 98765 43210");
  };

  return (
    <>
    {!userState ? (
        <PlainMessage head={"Not Logged In!"} linkTo="Login" link="/login">
            Please Login to see your profile
        </PlainMessage>
    ) : (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-24">

      <main className="max-w-5xl mx-auto px-4 md:px-10 pt-24 pb-6 space-y-8">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* LEFT COLUMN: PROFILE CARD */}
            <div className="w-full h-full">
                <section className="bg-white rounded-[2.5rem] p-8 border border-slate-300 shadow-xl shadow-slate-200/50 relative overflow-hidden h-full flex flex-col justify-center">
                    <div className="relative z-10 flex flex-col items-center text-center">
                        
                        <div className="w-24 h-24 rounded-full bg-slate-900 mb-4 flex items-center justify-center text-3xl font-serif text-white shadow-lg shadow-slate-900/20">
                            {userState.name.charAt(0).toUpperCase()}
                        </div>
                        
                        <h2 className="text-2xl font-serif font-bold text-slate-900">{userState.name}</h2>
                        <p className="text-slate-500 text-sm mb-3">{userState.email}</p>
                        
                        {/* Static Info Badges */}
                        <div className="flex gap-2 mt-2">
                            <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-xs font-bold border border-orange-100">
                                Student
                            </span>
                            <span className="bg-slate-50 text-slate-600 px-3 py-1 rounded-full text-xs font-bold border border-slate-100">
                                {userState.phone || "No Phone"}
                            </span>
                        </div>

                    </div>
                    {/* Decorative Blob */}
                    <div className="absolute -top-10 -left-10 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl"></div>
                </section>
            </div>


            {/* RIGHT COLUMN: ANALYTICS (REAL DATA) */}
            <div className="w-full h-full"> 
                <section className="bg-white rounded-[2.5rem] p-8 border border-slate-300 shadow-sm h-full flex flex-col justify-between">
                    
                    <div>
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h2 className="text-xl font-serif font-bold text-slate-900">Your Stats</h2>
                                <p className="text-slate-500 text-sm">Lifetime spending & orders</p>
                            </div>
                            <div className="p-2 bg-slate-50 rounded-full">
                                <IoTrendingUp className="text-slate-400"/>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Total Spent */}
                            <div className="bg-orange-50 border border-orange-100 p-5 rounded-2xl flex flex-col justify-between h-32">
                                <div className="p-2 bg-white w-fit rounded-lg text-orange-500 shadow-sm mb-2">
                                    <IoWalletOutline />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-orange-600 mb-1 uppercase tracking-wide">Total Spent</p>
                                    <h3 className="text-2xl md:text-3xl font-black text-slate-900">
                                        {loading ? "..." : `₹${stats.totalSpent}`}
                                    </h3>
                                </div>
                            </div>

                            {/* Total Orders */}
                            <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex flex-col justify-between h-32">
                                <div className="p-2 bg-white w-fit rounded-lg text-slate-600 shadow-sm mb-2">
                                    <IoReceiptOutline />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wide">Total Orders</p>
                                    <h3 className="text-2xl md:text-3xl font-black text-slate-900">
                                        {loading ? "..." : stats.totalOrders}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>

                </section>
            </div>

        </div>

        {/* BOTTOM NAV / ACTIONS */}
        <section className="mt-12 w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                
                {/* 1. ORDER HISTORY (Navigates to /orders) */}
                <button 
                    onClick={() => navigate('/orders')}
                    className="flex w-full items-center justify-center gap-3 bg-white px-6 py-4 rounded-full border border-slate-200 shadow-sm hover:border-orange-500 hover:text-orange-600 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-orange-50 group-hover:text-orange-600 transition shrink-0">
                        <IoReceiptOutline />
                    </div>
                    <span className="font-bold text-slate-700 group-hover:text-orange-600 text-sm whitespace-nowrap">View Order History</span>
                </button>

                {/* 2. HELP & SUPPORT (Simple Alert) */}
                <button 
                    onClick={showSupport}
                    className="flex w-full items-center justify-center gap-3 bg-white px-6 py-4 rounded-full border border-slate-200 shadow-sm hover:border-blue-500 hover:text-blue-600 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition shrink-0">
                        <IoHelpCircleOutline />
                    </div>
                    <span className="font-bold text-slate-700 group-hover:text-blue-600 text-sm whitespace-nowrap">Help & Support</span>
                </button>

                {/* 3. LOGOUT */}
                <button
                    onClick={logout}
                    className="flex w-full items-center justify-center gap-3 bg-white px-6 py-4 rounded-full border border-red-100 shadow-sm hover:border-red-500 hover:shadow-md hover:shadow-red-100/50 hover:-translate-y-1 transition-all duration-300 group">
                    <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition shrink-0">
                        <IoLogOutOutline />
                    </div>
                    <span className="font-bold text-red-500 text-sm whitespace-nowrap">Log Out</span>
                </button>

            </div>
        </section>

      </main>

    </div>
    )}
     
    </>
  );
};

export default ProfilePage;
