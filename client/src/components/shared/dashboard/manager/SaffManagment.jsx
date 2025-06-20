import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Edit, Users } from "lucide-react";
import EditStaffDialog from "./EditStaffDialog";
import DeleteStaffButton from "./DeleteStaffButton";

import { useSelector, useDispatch } from "react-redux";
import { fetchStaff, updateStaff, removeStaff } from "@/store/staffSlice";

const StaffManagement = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  // Use staffList from Redux store, loading and error states
  const staffList = useSelector((state) => state.staff.staffList);
  const loading = useSelector((state) => state.staff.loading);
  const error = useSelector((state) => state.staff.error);

  const [isEditStaffOpen, setIsEditStaffOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  // Fetch staff on mount or token change
  useEffect(() => {
    if (token) {
      dispatch(fetchStaff(token));
    }
  }, [token, dispatch]);

  // When a staff member is saved in EditStaffDialog
  const handleSaveStaff = (updatedStaff) => {
    dispatch(updateStaff(updatedStaff)); // update in Redux store
    setIsEditStaffOpen(false);
  };

  // When a staff member is deleted successfully in DeleteStaffButton
  const handleDeleteStaff = (id) => {
    dispatch(removeStaff(id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Staff</CardTitle>
        <CardDescription>Staff currently working at your restaurant</CardDescription>
      </CardHeader>
      <CardContent>
        {loading && <p>Loading staff...</p>}
        {error && <p className="text-red-600">Error: {error}</p>}
        {!loading && !error && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                    No active staff found
                  </TableCell>
                </TableRow>
              ) : (
                staffList.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{member.role}</span>
                      </div>
                    </TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedStaff(member);
                            setIsEditStaffOpen(true);
                          }}
                          aria-label={`Edit ${member.name}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        <DeleteStaffButton
                          staff={member}
                          onDeleteSuccess={() => handleDeleteStaff(member.id)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}

        <EditStaffDialog
          open={isEditStaffOpen}
          onOpenChange={setIsEditStaffOpen}
          staff={selectedStaff}
          onSave={handleSaveStaff}
        />
      </CardContent>
    </Card>
  );
};

export default StaffManagement;
