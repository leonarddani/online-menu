// components/CancelOrderButton.jsx
import React from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner"; // optional for notifications
import { useSelector } from "react-redux";

const CancelOrderButton = ({ orderId, status, onCancel }) => {
  const token = useSelector((state) => state.auth.token);

  const handleCancel = async () => {
    if (!token) return;

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

  // ❌ Don't show button for these statuses
  if (status === "cancelled" || status === "completed") return null;

  return (
    <Button
      variant="destructive"
      size="sm"
      disabled={status === "in progress"}
      onClick={handleCancel}
    >
      Cancel
    </Button>
  );
};

export default CancelOrderButton;
