import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Use 'role' as expected by backend
const staffSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["waiter", "chef", "manager"], "Select a valid role"),
});

const AddStaffDialog = ({ open, onOpenChange, onAddSuccess }) => {
  const form = useForm({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "waiter",
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await fetch("http://localhost:8095/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          password: "default123", // optional: prompt for this later
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to add staff");
      }

      toast.success("Staff member added successfully!");
      onAddSuccess();
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Staff Member</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <input
                      type="text"
                      placeholder="Enter full name"
                      {...field}
                      className="input-class"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <input
                      type="email"
                      placeholder="Enter email"
                      {...field}
                      className="input-class"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <select {...field} className="input-class">
                      <option value="waiter">Waiter</option>
                      <option value="chef">Chef</option>
                      <option value="manager">Manager</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Add Staff
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStaffDialog;
