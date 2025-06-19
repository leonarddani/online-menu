import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Trash } from "lucide-react";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const DeleteStaffButton = ({ staff, onDeleteSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const token = useSelector((state) => state.auth.token);

  const handleDeleteConfirm = async () => {
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/employees/${staff.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        let errorMessage = "Failed to delete staff";
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
        } catch {}
        throw new Error(errorMessage);
      }

      toast.success("Staff deleted successfully.");
      onDeleteSuccess(staff.id);
      setShowDialog(false);
    } catch (error) {
      toast.error(`Delete failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const openDialog = () => {
    if (staff.role === "manager") {
      toast.error("Cannot delete employee with role 'manager'.");
      return;
    }
    setShowDialog(true);
  };

  return (
    <>
      <Button
        variant="destructive"
        size="sm"
        onClick={openDialog}
        disabled={loading || staff.role === "manager"}
        title={staff.role === "manager" ? "Cannot delete manager" : "Delete staff"}
      >
        <Trash className="h-4 w-4" />
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Staff Member</DialogTitle>
            <p className="text-muted-foreground">
              Are you sure you want to delete <strong>{staff.name}</strong>?
            </p>
          </DialogHeader>

          <DialogFooter className="space-x-2">
            <Button variant="outline" onClick={() => setShowDialog(false)} disabled={loading}>
              Cancel
            </Button>
            <Button
              className="destructive"
              onClick={handleDeleteConfirm}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Confirm Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeleteStaffButton;
