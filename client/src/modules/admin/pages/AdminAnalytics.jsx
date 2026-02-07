import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import PlainMessage from '../../../shared/components/PlainMessage';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('http://localhost:3000/admin/dashboard', {
          method: 'GET',
          credentials: 'include', // Important for Admin Auth check later
        });
        
        if (!response.ok) throw new Error('Failed to fetch data');
        
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return <div className="text-center mt-20 font-bold text-slate-400">Loading Analytics...</div>;
  if (error) return <div className="text-center mt-20 font-bold text-red-500">Error: {error}</div>;
  if (!data) return null;

  // Prepare Chart Data
  const chartData = {
    labels: data.graph.map(item => item.label), // ["Jan 2026", "Feb 2026"]
    datasets: [
      {
        label: 'Monthly Revenue (₹)',
        data: data.graph.map(item => item.revenue),
        backgroundColor: 'rgba(249, 115, 22, 0.8)', // Orange-500
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: false },
    },
    scales: {
      y: { beginAtZero: true, grid: { display: false } },
      x: { grid: { display: false } }
    }
  };

  return (
    <main className="max-w-[1600px] mx-auto px-4 md:px-6 pt-8 pb-20">
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Analytics Dashboard</h2>
        <p className="text-slate-500 text-sm">Overview of canteen performance.</p>
      </div>

      {/* 1. STATS CARDS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        
        {/* Card 1: Today's Revenue */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Today's Sales</p>
          <h3 className="text-3xl font-extrabold text-slate-900">₹{data.cards.todayRevenue}</h3>
          <p className="text-xs text-green-500 font-bold mt-2">
             {data.cards.todayOrders} Orders
          </p>
        </div>

        {/* Card 2: This Month */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">This Month</p>
          <h3 className="text-3xl font-extrabold text-slate-900">₹{data.cards.monthRevenue}</h3>
        </div>

        {/* Card 3: Total Lifetime */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Lifetime</p>
          <h3 className="text-3xl font-extrabold text-slate-900">₹{data.cards.totalRevenue}</h3>
          <p className="text-xs text-slate-400 mt-2">All time collection</p>
        </div>

        {/* Card 4: Avg Orders */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Avg Orders/Day</p>
          <h3 className="text-3xl font-extrabold text-orange-500">{data.cards.avgOrdersPerDay}</h3>
        </div>

      </div>

      {/* 2. GRAPH SECTION */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
             <h3 className="font-bold text-slate-800">Revenue Trends</h3>
             <span className="text-xs bg-slate-100 px-3 py-1 rounded-full text-slate-500 font-bold">Last 12 Months</span>
        </div>
        <div className="h-64 md:h-80 w-full">
            {data.graph.length > 0 ? (
                <Bar options={chartOptions} data={chartData} />
            ) : (
                <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                    Not enough data to generate graph yet.
                </div>
            )}
        </div>
      </div>

    </main>
  );
};

export default AdminAnalytics;