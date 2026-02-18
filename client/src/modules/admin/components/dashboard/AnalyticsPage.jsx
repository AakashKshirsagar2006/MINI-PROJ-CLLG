import RevenueChart from "./components/RevenueChart";
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

const AnalyticsPage = ()=>{
  const kpiData = [
      { title: "Total Revenue", value: "₹45,230", change: "+12.5%", trend: "up", icon: <IoWalletOutline /> },
      { title: "Total Orders", value: "1,240", change: "+8.2%", trend: "up", icon: <IoCartOutline /> },
      { title: "Active Staff", value: "12", change: "0%", trend: "neutral", icon: <IoPeopleOutline /> },
      { title: "Pending Orders", value: "5", change: "-2.4%", trend: "down", icon: <IoTimeOutline /> },
    ];
  return(
    <>
     <div className="p-6 md:p-10 max-w-8xl mx-auto">
    <div className="space-y-8">
                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                       {kpiData.map((kpi, index) => (
                          <div key={index} className="bg-white p-6 rounded-4xl border border-slate-100 shadow-sm hover:shadow-md transition">
                             <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-slate-50 rounded-2xl text-slate-900 text-xl">{kpi.icon}</div>
                                <span className={`text-xs font-bold px-2 py-1 rounded-lg ${kpi.trend === 'up' ? 'bg-green-50 text-green-600' : kpi.trend === 'down' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-500'}`}>
                                   {kpi.change}
                                </span>
                             </div>
                             <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider">{kpi.title}</h3>
                             <p className="text-3xl font-serif font-bold text-slate-900 mt-1">{kpi.value}</p>
                          </div>
                       ))}
                    </div>
    
                    {/* Main Chart Section */}
                <RevenueChart/>
                 </div>
                 </div>
    </>
  )
}

export default AnalyticsPage;