import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { toast } from "sonner"; // or your preferred toast library

const EditStaffDialog = ({ open, onOpenChange, staff, onSave }) => {
  const [role, setRole] = useState(staff?.role || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setRole(staff?.role || "");
  }, [staff]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!staff) return;

    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/employees/${staff.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update staff");
      }

      const updatedStaff = await res.json();

      toast.success("Staff updated successfully!");
      onSave(updatedStaff.data || updatedStaff); // pass updated staff to parent
      onOpenChange(false);
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Staff Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input type="text" value={staff?.name || ""} disabled />
          </div>

          <div>
            <Label>Email</Label>
            <Input type="email" value={staff?.email || ""} disabled />
          </div>

          <div>
            <Label>Role</Label>
            <Select onValueChange={setRole} value={role}>
              <SelectTrigger className="w-full" disabled={loading}>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="waiter">Waiter</SelectItem>
                <SelectItem value="chef">Chef</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditStaffDialog;
