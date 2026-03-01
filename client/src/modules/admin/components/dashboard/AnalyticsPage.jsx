import { useEffect, useState } from "react";
import RevenueChart from "./components/RevenueChart";
import { 
  IoPeopleOutline, 
  IoTimeOutline, 
  IoWalletOutline,
  IoCartOutline
} from "react-icons/io5";

const baseURL = import.meta.env.VITE_SERVER_BASE_URL;

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch real analytics data from backend on mount
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch(`${baseURL}/admin/analytics/dashboard`, {
          method: "GET",
          credentials: "include"
        });

        if (!res.ok) throw new Error("Failed to load dashboard data");
        const data = await res.json();
        setAnalytics(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="p-10 text-center font-bold text-slate-500">Loading Enterprise Analytics...</div>;
  }

  if (error) {
    return <div className="p-10 text-center font-bold text-red-500">Error: {error}</div>;
  }

  // Map the backend metrics dynamically to the 6 required cards
  const kpiData = [
    { title: "Total Revenue", value: `₹${analytics.metrics.totalRevenue.toLocaleString()}`, icon: <IoWalletOutline /> },
    { title: "Total Orders", value: analytics.metrics.totalOrders.toLocaleString(), icon: <IoCartOutline /> },
    { title: "Today's Revenue", value: `₹${analytics.metrics.todayRevenue.toLocaleString()}`, icon: <IoWalletOutline /> },
    { title: "Today's Orders", value: analytics.metrics.todayOrders.toLocaleString(), icon: <IoCartOutline /> },
    { title: "Active Staff", value: analytics.metrics.activeStaff, icon: <IoPeopleOutline /> },
    { title: "Pending Orders", value: analytics.metrics.pendingOrders, icon: <IoTimeOutline /> },
  ];

  return (
    <>
      <div className="p-6 md:p-10 max-w-8xl mx-auto">
        <div className="space-y-8">
          
          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {kpiData.map((kpi, index) => (
              <div key={index} className="bg-white p-6 rounded-4xl border border-slate-100 shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-slate-50 rounded-2xl text-slate-900 text-xl">
                    {kpi.icon}
                  </div>
                </div>
                <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider">{kpi.title}</h3>
                <p className="text-3xl font-serif font-bold text-slate-900 mt-1">{kpi.value}</p>
              </div>
            ))}
          </div>

          {/* Main Chart Section */}
          <div className="bg-white p-6 rounded-4xl border border-slate-100 shadow-sm">
             <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900">Monthly Revenue</h2>
             </div>
             {/* Pass the graph array directly to your chart component */}
             <RevenueChart graphData={analytics.graphData} />
          </div>

        </div>
      </div>
    </>
  );
};

export default AnalyticsPage;