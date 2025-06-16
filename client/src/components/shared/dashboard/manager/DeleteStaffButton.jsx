import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { toast } from "sonner"; // or your toast lib

const DeleteStaffButton = ({ staff, onDeleteSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (staff.role === "manager") {
      toast.error("Cannot delete employee with role 'manager'.");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${staff.name}?`)) return;

    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:8095/api/employees/${staff.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete staff");
      }

      toast.success("Staff deleted successfully.");
      onDeleteSuccess(staff.id);
    } catch (error) {
      toast.error(`Delete failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      disabled={loading}
      title={staff.role === "manager" ? "Cannot delete manager" : "Delete staff"}
    >
      <Trash className="h-4 w-4" />
    </Button>
  );
};

export default DeleteStaffButton;
