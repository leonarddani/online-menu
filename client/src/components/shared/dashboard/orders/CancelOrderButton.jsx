import React from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const CancelOrderButton = ({ orderId, status, onCancel }) => {
  const token = useSelector((state) => state.auth.token);

  const handleCancel = async () => {
    if (!token) {
      toast.error("You must be logged in to cancel orders.");
      return;
    }

    try {
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/orders/${orderId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Order cancelled successfully");
      onCancel(); // refresh orders
    } catch (err) {
      console.error("Failed to cancel order:", err);
      toast.error("Failed to cancel order");
    }
  };

  // Show button ONLY if status is "pending"
  if (status !== "pending") return null;

  return (
    <Button variant="destructive" size="sm" onClick={handleCancel}>
      Cancel
    </Button>
  );
};

export default CancelOrderButton;
