import React, { useState, useEffect } from "react";
import { IoSearch, IoWalletOutline, IoRefresh } from "react-icons/io5";
import PlainMessageAdminStaff from "../../../shared/components/PlainMessageAdminStaff";

const AdminPaymentLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("PAYMENTS"); // 'PAYMENTS' or 'REFUNDS'

  // Fetch Logs Function
  const fetchLogs = async (query = "") => {
    setLoading(true);
    try {
      // Note: We use the /payments prefix because that's likely where your payment-router is mounted in app.js
      const url = `http://localhost:3000/payments/logs?type=${activeTab.toLowerCase()}&search=${query}`;
      
      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to fetch logs");
      
      const data = await response.json();
      setLogs(data.logs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Initial Fetch & Tab Change
  useEffect(() => {
    fetchLogs(searchTerm);
  }, [activeTab]); // Re-fetch when tab changes

  // Handle Search Submit
  const handleSearch = (e) => {
    e.preventDefault();
    fetchLogs(searchTerm);
  };

  return (
    <main className="max-w-[1600px] mx-auto px-4 md:px-6 pt-8 pb-20">
      
      {/* 1. HEADER & CONTROLS */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <IoWalletOutline className="text-orange-500"/> Payment Logs
          </h2>
          <p className="text-slate-500 text-sm">Track all successful transactions.</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm w-full md:w-auto">
            <IoSearch className="text-slate-400" />
            <input 
                type="text" 
                placeholder="Search Order UID..." 
                className="bg-transparent text-sm focus:outline-none w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="hidden"></button>
        </form>
      </div>

      {/* 2. TABS */}
      <div className="flex gap-4 border-b border-slate-200 mb-6">
        <button 
            onClick={() => setActiveTab("PAYMENTS")}
            className={`pb-2 text-sm font-bold transition-all border-b-2 ${activeTab === "PAYMENTS" ? "border-orange-500 text-orange-600" : "border-transparent text-slate-400 hover:text-slate-600"}`}>
            Payments
        </button>
        <button 
            onClick={() => setActiveTab("REFUNDS")}
            className={`pb-2 text-sm font-bold transition-all border-b-2 ${activeTab === "REFUNDS" ? "border-orange-500 text-orange-600" : "border-transparent text-slate-400 hover:text-slate-600"}`}>
            Refunds
        </button>
      </div>

      {/* 3. LOGS TABLE */}
      {loading ? (
        <div className="text-center py-10 text-slate-400 font-bold text-sm">Loading logs...</div>
      ) : logs.length === 0 ? (
        <PlainMessageAdminStaff 
            head={activeTab === "REFUNDS" ? "No Refunds Found" : "No Payments Found"} 
            buttonText="Refresh" 
            onclickFunc={() => fetchLogs("")}
        >
            {activeTab === "REFUNDS" 
                ? "There are no processed refunds yet." 
                : "No payment records matching your criteria."}
        </PlainMessageAdminStaff>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                            <th className="p-4 font-bold border-b border-slate-100">Order UID</th>
                            <th className="p-4 font-bold border-b border-slate-100">Transaction ID</th>
                            <th className="p-4 font-bold border-b border-slate-100">Amount</th>
                            <th className="p-4 font-bold border-b border-slate-100">Method</th>
                            <th className="p-4 font-bold border-b border-slate-100">Date</th>
                            <th className="p-4 font-bold border-b border-slate-100 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-slate-700">
                        {logs.map((log) => (
                            <tr key={log._id} className="hover:bg-slate-50 transition border-b border-slate-50 last:border-none">
                                <td className="p-4 font-bold">
                                    {log.orderData?.orderUID || "N/A"}
                                </td>
                                <td className="p-4 font-mono text-xs text-slate-500">
                                    {log.transactionId}
                                </td>
                                <td className="p-4 font-bold text-slate-900">
                                    ₹{log.amount}
                                </td>
                                <td className="p-4 capitalize">
                                    {log.method || log.provider}
                                </td>
                                <td className="p-4 text-xs text-slate-500">
                                    {new Date(log.paymentDate).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute:'2-digit' })}
                                </td>
                                <td className="p-4 text-right">
                                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-[10px] font-bold uppercase">
                                        {log.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      )}

    </main>
  );
};

export default AdminPaymentLogs;