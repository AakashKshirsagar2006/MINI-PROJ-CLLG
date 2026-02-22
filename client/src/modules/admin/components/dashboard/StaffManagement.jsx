import React, { useState, useEffect } from 'react';
import StaffModal from './components/StaffModal';

const baseURL = import.meta.env.VITE_SERVER_BASE_URL;

const StaffManagement = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedStaff, setSelectedStaff] = useState(null);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      // Adjust '/admin' prefix if your router is mounted differently in app.js!
      const res = await fetch(`${baseURL}/admin/all-staff`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch staff");
      const data = await res.json();
      setStaffList(data.staffList || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleOpenAddModal = () => {
    setModalMode('add');
    setSelectedStaff(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (staff) => {
    setModalMode('edit');
    setSelectedStaff(staff);
    setIsModalOpen(true);
  };

  const handleDelete = async (staffId) => {
    if (!window.confirm(`Are you sure you want to fire ${staffId}?`)) return;
    
    try {
      const res = await fetch(`${baseURL}/admin/delete-staff`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staffId }),
        credentials: "include"
      });
      if (!res.ok) throw new Error("Failed to delete staff");
      fetchStaff(); // Refresh the list
    } catch (err) {
      alert(err.message);
    }
  };

  const handleModalSubmit = async (formData) => {
    const url = modalMode === 'add' ? `${baseURL}/admin/add-staff` : `${baseURL}/admin/update-staff`;
    
    // If editing, we need to inject the staffId into the payload
    const payload = modalMode === 'add' 
      ? formData 
      : { ...formData, staffId: selectedStaff.staffId };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: "include"
      });
      
      if (!res.ok) throw new Error(`Failed to ${modalMode} staff`);
      
      setIsModalOpen(false);
      fetchStaff(); // Refresh the table
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Staff Management</h1>
          <p className="text-gray-500 mt-1">Manage canteen employees and their access credentials.</p>
        </div>
        
        {/* Localized ADD button - Better UX than globals! */}
        <button 
          onClick={handleOpenAddModal}
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-6 rounded-md shadow transition-colors"
        >
          + Add New Staff
        </button>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-6 border border-red-300">{error}</div>}

      {/* The Data Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-gray-200">
              <th className="py-4 px-6 font-semibold text-slate-700">Staff ID</th>
              <th className="py-4 px-6 font-semibold text-slate-700">Full Name</th>
              <th className="py-4 px-6 font-semibold text-slate-700">Joined Date</th>
              <th className="py-4 px-6 font-semibold text-slate-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" className="text-center py-10 text-gray-500">Loading staff data...</td></tr>
            ) : staffList.length === 0 ? (
              <tr><td colSpan="4" className="text-center py-10 text-gray-500">No staff members found. Add one above!</td></tr>
            ) : (
              staffList.map((staff) => (
                <tr key={staff.staffId} className="border-b border-gray-100 hover:bg-orange-50/30 transition-colors">
                  <td className="py-4 px-6 font-medium text-slate-900">
                    <span className="bg-orange-100 text-orange-700 py-1 px-3 rounded-full text-sm font-bold">
                      {staff.staffId}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-700 font-medium">{staff.name}</td>
                  <td className="py-4 px-6 text-gray-500 text-sm">
                    {new Date(staff.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 text-right space-x-3">
                    <button 
                      onClick={() => handleOpenEditModal(staff)}
                      className="text-slate-600 hover:text-orange-600 font-semibold transition-colors text-sm"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(staff.staffId)}
                      className="text-red-500 hover:text-red-700 font-semibold transition-colors text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mount the Modal Component */}
      <StaffModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        mode={modalMode}
        initialData={selectedStaff}
      />
    </div>
  );
};

export default StaffManagement;