import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "sonner";

export default function ChefDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch orders assigned to kitchen
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/chef/orders`);
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error(error);
      toast.error("Error loading orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // Optionally refresh every 30 seconds
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  // Update order status
async function updateStatus(orderId, newStatus) {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/chef/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!response.ok) {
      throw new Error('Failed to update status');
    }

    // optionally refresh orders after update
    fetchOrders();
  } catch (error) {
    console.error(error);
    alert('Failed to update status');
  }
}


  if (loading) {
    return <div className="p-4 text-center">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return <div className="p-4 text-center">No pending orders</div>;
  }

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-3xl font-bold mb-4">Chef Dashboard - Pending Orders</h1>

      {orders.map((order) => (
        <Card key={order.order_id} className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Order #{order.order_id}</CardTitle>
            <CardDescription>
              Table: {order.table_id} | Status: {order.status} | Ordered at:{" "}
              {new Date(order.created_at).toLocaleString()}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              {order.items.map((item, idx) => (
                <li key={idx}>
                  <strong>{item.name}</strong> — Qty: {item.quantity} — Notes:{" "}
                  {item.notes || "None"} — Price: ${parseFloat(item.price).toFixed(2)}
                </li>
              ))}
            </ul>
          </CardContent>

          <CardFooter className="flex gap-2">
            {order.status === "pending" && (
              <Button
                onClick={() => updateStatus(order.order_id, "completed")}
                variant="primary"
              >
                Mark In Progress
              </Button>
            )}
            {order.status === "in_progress" && (
              <Button
                onClick={() => updateStatus(order.order_id, "completed")}
                variant="success"
              >
                Mark Completed
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
