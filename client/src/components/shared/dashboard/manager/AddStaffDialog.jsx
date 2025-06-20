import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useSelector, useDispatch } from "react-redux";
import { addStaff } from "@/store/staffSlice";

const schema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["manager", "waiter", "chef"], {
    errorMap: () => ({ message: "Role is required" }),
  }),
});

const AddStaffDialog = ({ open, onOpenChange, onAddSuccess }) => {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const role = watch("role");

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const handleRoleChange = (value) => {
    setValue("role", value, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to add staff");
      }

      const newStaff = await res.json();
      toast.success("Staff added!");

      dispatch(addStaff(newStaff)); // optimistic update in Redux

      onAddSuccess?.(newStaff);
      onOpenChange(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Staff Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label>Name</label>
            <Input {...register("name")} autoFocus />
            {errors.name && <p className="text-red-600">{errors.name.message}</p>}
          </div>
          <div>
            <label>Email</label>
            <Input {...register("email")} type="email" />
            {errors.email && <p className="text-red-600">{errors.email.message}</p>}
          </div>
          <div>
            <label>Password</label>
            <Input {...register("password")} type="password" />
            {errors.password && (
              <p className="text-red-600">{errors.password.message}</p>
            )}
          </div>
          <div>
            <label>Role</label>
            <Select onValueChange={handleRoleChange} value={role || ""}>
              <SelectTrigger className="w-full" aria-label="Select role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="waiter">Waiter</SelectItem>
                <SelectItem value="chef">Chef</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && <p className="text-red-600">{errors.role.message}</p>}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Staff"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStaffDialog;
