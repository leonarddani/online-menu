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
import { Edit, Trash, Users } from "lucide-react";
import EditStaffDialog from "./EditStaffDialog";
import DeleteStaffButton from "./DeleteStaffButton";

const SaffManagment = () => {
  const [activeStaff, setActiveStaff] = useState([]);
  const [isEditStaffOpen, setIsEditStaffOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  useEffect(() => {
    const fetchWaiters = async () => {
      try {
        const token = localStorage.getItem("token"); 

        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/employees/staff`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch waiters");

        const data = await res.json();
        setActiveStaff(data.data);
      } catch (error) {
        console.error("Error fetching waiters:", error);
      }
    };

    fetchWaiters();
  }, []);

  // This is the new function to handle saving edited staff data
  const handleSaveStaff = (updatedStaff) => {
    setActiveStaff((prev) =>
      prev.map((staff) => (staff.id === updatedStaff.id ? updatedStaff : staff))
    );
    setIsEditStaffOpen(false);
  };

  const handleDeleteStaff = (id) => {
    setActiveStaff((prev) => prev.filter((staff) => staff.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active staff</CardTitle>
        
        <CardDescription>Staff currently working at your restaurant</CardDescription>
      </CardHeader>
      <CardContent>
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
                  No active waiters found
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
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                     
                      <DeleteStaffButton
  staff={member}
  onDeleteSuccess={(id) => setActiveStaff(prev => prev.filter(s => s.id !== id))}
/>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Edit dialog */}
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

export default SaffManagment;
