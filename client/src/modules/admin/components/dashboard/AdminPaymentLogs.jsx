import React, { useState, useEffect } from "react";
import { IoSearch, IoWalletOutline, IoCloudDownloadOutline } from "react-icons/io5";
import PlainMessageAdminStaff from "../../../../shared/components/PlainMessageAdminStaff";

// SAFETY FIX: Hardcoded URL
const baseURL = import.meta.env.VITE_SERVER_BASE_URL;

const AdminPaymentLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("PAYMENTS"); // 'PAYMENTS' or 'REFUNDS'

  // MOCK DATA (Kept so UI works immediately)
  const mockLogs = [
    {
      "_id": "log_654a1b2c3d4e5f6g7h8i9j0k",
      "orderData": { "orderUID": "ORD-2024-8821" },
      "transactionId": "pay_Ni8s992MmKa10",
      "amount": 1499,
      "method": "UPI",
      "provider": "PhonePe",
      "paymentDate": "2024-02-14T10:30:00.000Z",
      "status": "SUCCESS"
    },
    {
      "_id": "log_1a2b3c4d5e6f7g8h9i0j1k2l",
      "orderData": { "orderUID": "ORD-2024-8822" },
      "transactionId": "pay_Tk772JsKw91Lm",
      "amount": 4999,
      "method": "Credit Card",
      "provider": "Stripe",
      "paymentDate": "2024-02-14T09:15:22.000Z",
      "status": "CAPTURED"
    },
    {
      "_id": "log_ccddxxwwyyzz112233445566",
      "orderData": { "orderUID": "ORD-2024-8788" },
      "transactionId": "ref_9921MmKLo91",
      "amount": 299,
      "method": "UPI",
      "provider": "GPay",
      "paymentDate": "2024-02-12T11:05:00.000Z",
      "status": "REFUNDED"
    }
  ];

  // Fetch Logs Function
  const fetchLogs = async (query = "") => {
    setLoading(true);
    // TEMPORARY: Using Mock Data until Backend is ready
    setLogs(mockLogs);
    
    /* try {
      const url = `${baseUrl}/admin/payment-logs?type=${activeTab.toLowerCase()}&search=${query}`;
      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch logs");
      const data = await response.json();
      setLogs(data.logs || []);
    } catch (err) {
      console.error(err);
    } 
    */
    setLoading(false);
  };

  // Initial Fetch & Tab Change
  useEffect(() => {
    fetchLogs(searchTerm);
  }, [activeTab]);

  // Handle Search Submit
  const handleSearch = (e) => {
    e.preventDefault();
    fetchLogs(searchTerm);
  };

  const handleExport = () => {
    if (!logs.length) return;

    const headers = ["Order UID", "Transaction ID", "Amount", "Method", "Provider", "Date", "Status"];
    
    const escapeCsv = (text) => {
        if (text == null) return "";
        const stringText = String(text);
        if (stringText.includes(",") || stringText.includes("\n") || stringText.includes('"')) {
            return `"${stringText.replace(/"/g, '""')}"`;
        }
        return stringText;
    };

    const rows = logs.map(log => [
      escapeCsv(log.orderData?.orderUID || "N/A"),
      escapeCsv(log.transactionId),
      escapeCsv(log.amount),
      escapeCsv(log.method || "N/A"),
      escapeCsv(log.provider || "N/A"),
      escapeCsv(new Date(log.paymentDate).toLocaleString()),
      escapeCsv(log.status)
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(e => e.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `payment_logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

        <div className="flex gap-3 w-full md:w-auto">
          
          <button 
              onClick={handleExport}
              className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all whitespace-nowrap"
          >
              <IoCloudDownloadOutline className="text-lg" />
              <span className="hidden sm:inline">Export</span>
          </button>
          

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
                                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${log.status === 'REFUNDED' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
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