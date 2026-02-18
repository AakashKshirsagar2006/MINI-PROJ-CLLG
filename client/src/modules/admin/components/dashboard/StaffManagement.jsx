import React from 'react';
import PlainMessage from '../../../../shared/components/PlainMessage';

const StaffManagement = () => {
  return (
    <div className="p-10">
      <PlainMessage head="Staff Management" linkTo="Dashboard" link="/admin/dashboard">
        Staff management features are coming soon.
      </PlainMessage>
    </div>
  );
};

export default StaffManagement;