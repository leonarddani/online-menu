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
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Edit, Users } from "lucide-react";
import EditStaffDialog from "./EditStaffDialog";
import DeleteStaffButton from "./DeleteStaffButton";
import { useSelector } from "react-redux";

const StaffManagement = () => {
  const token = useSelector((state) => state.auth.token);
  const [activeStaff, setActiveStaff] = useState([]);
  const [isEditStaffOpen, setIsEditStaffOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWaiters = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/employees/staff`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch staff");

        const data = await res.json();
        setActiveStaff(data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchWaiters();
  }, [token]);

  const handleSaveStaff = (updatedStaff) => {
    setActiveStaff((prev) =>
      prev.map((staff) => (staff.id === updatedStaff.id ? updatedStaff : staff))
    );
    setIsEditStaffOpen(false);
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
              {activeStaff.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                    No active staff found
                  </TableCell>
                </TableRow>
              ) : (
                activeStaff.map((member) => (
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
                          onDeleteSuccess={(id) =>
                            setActiveStaff((prev) => prev.filter((s) => s.id !== id))
                          }
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
