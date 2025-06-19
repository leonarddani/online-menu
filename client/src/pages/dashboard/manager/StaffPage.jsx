import React, { useState } from "react";
import Header from "@/components/shared/dashboard/Header";
import AddStaffDialog from "@/components/shared/dashboard/manager/AddStaffDialog";
import StaffManagement from "@/components/shared/dashboard/manager/SaffManagment";
import Layout from "@/components/shared/layouts/Layout";
import { Button } from "@/components/ui/button";

const StaffPage = () => {
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);

  const handleAddStaffSuccess = () => {
    setIsAddStaffOpen(false);
    setRefreshFlag((prev) => !prev); // Toggle to force StaffManagement refresh
    console.log("Staff added! Refreshing list...");
  };

  return (
    <Layout>
      <Header title="Staff Management" subtitle="Manage your waiters and chefs">
        <Button onClick={() => setIsAddStaffOpen(true)}>Add Staff</Button>

        <AddStaffDialog
          open={isAddStaffOpen}
          onOpenChange={setIsAddStaffOpen}
          onAddSuccess={handleAddStaffSuccess}
        />
      </Header>

      <StaffManagement refreshFlag={refreshFlag} />
    </Layout>
  );
};

export default StaffPage;
