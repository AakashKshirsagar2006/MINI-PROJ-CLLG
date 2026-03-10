import React, { useState, useEffect } from 'react';

const StaffModal = ({ isOpen, onClose, onSubmit, initialData, mode }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  // Pre-fill data when editing
  useEffect(() => {
    if (initialData && mode === 'edit') {
      setName(initialData.name);
      setPassword(''); // Keep password blank unless they want to change it
    } else {
      setName('');
      setPassword('');
    }
  }, [initialData, mode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, password });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center opacity-100 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden transform transition-all">
        <div className="bg-slate-900 px-6 py-4 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">
            {mode === 'add' ? 'Add New Staff Member' : `Edit Staff: ${initialData?.staffId}`}
          </h3>
          <button onClick={onClose} className="text-gray-300 hover:text-white text-xl font-bold">
            &times;
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="block text-slate-700 text-sm font-bold mb-2">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="e.g. Ramesh Kumar"
            />
          </div>

          <div className="mb-6">
            <label className="block text-slate-700 text-sm font-bold mb-2">
              Password {mode === 'edit' && <span className="text-xs text-gray-400 font-normal">(Leave blank to keep current)</span>}
            </label>
            <input
              type="password"
              required={mode === 'add'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter secure password"
            />
          </div>

          <div className="flex justify-end space-x-3 border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors"
            >
              {mode === 'add' ? 'Create Staff' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffModal;