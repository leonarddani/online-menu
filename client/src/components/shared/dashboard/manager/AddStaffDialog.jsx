import React, { useEffect, useState } from "react";
import AddStaffDialog from "./AddStaffDialog"; // your dialog component
import { Button } from "@/components/ui/button";

import { useDispatch, useSelector } from "react-redux";
import { fetchStaff } from "@/store/staffSlice"; // your thunk to fetch staff

const StaffManagement = () => {
  const dispatch = useDispatch();

  // Select staff state from Redux store
  const { staffList, loading, error } = useSelector((state) => state.staff);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch staff list on mount
  useEffect(() => {
    dispatch(fetchStaff());
  }, [dispatch]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Staff Management</h1>
        <Button onClick={() => setIsDialogOpen(true)}>Add Staff</Button>
      </div>

      {loading && <p>Loading staff...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      <ul>
        {staffList.map((staff) => (
          <li key={staff.id} className="mb-2">
            {staff.name} — {staff.role} — {staff.email}
          </li>
        ))}
      </ul>

      <AddStaffDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onAddSuccess={() => dispatch(fetchStaff())} // refetch after add
      />
    </div>
  );
};

export default StaffManagement;
