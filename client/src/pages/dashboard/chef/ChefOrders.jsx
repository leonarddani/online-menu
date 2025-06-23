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
import { Toaster } from "@/components/ui/sonner";
import { useSelector } from "react-redux";
import { toast } from "sonner";

export default function ChefOrders() {
    const [orders , setOrders] = useState([]);
    const [loading , setLoading] = useState(false);
    const token = useSelector((state) => state.auth.token);

    const fetchOrders = async () => {
        setLoading(true);
        
try {
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/chief/orders` , {
        headers : {
            Authorization: `Bearer ${token}`,
        },

    });

    const data = await res.json();
    setOrders(data)
} catch (error) {
    toast.error("Error loading orders");
} finally {
    setLoading(false)
}
    };

    useEffect(() => {
        if (!token) return;
        fetchOrders();
        const interval = setInterval(fetchOrders, 30000);
        return () => clearInterval(interval)
    }, [token]);

    const updateStatus = async (orderId , newStatus) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/chef/orders/${orderId}/status`, {
                method : {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({status: newStatus})
            });
            if(!res.ok) throw new Error("Update filed")
                toast.success(`Status updated to ${newStatus}`)
            fetchOrders();
        } catch (error) {
            console.error(error);
            toast.error("Error updating status")
        }
    };
    if (loading) return <div className="p-4 text-center">Loading...</div>
    if (orders.length === 0) return <div className="p-4 text-center">No orders</div>;

    return(
        <div className="space-y-6 p-4">
            {orders.map((order) => (
                <Card key={order.order_id} className="max-w-3xl mx-auto">
                    <CardHeader>
                        <CardTitle>Order #{order.order_id}</CardTitle>
                        <CardDescription>
                            Table: {order.table_id} | Status: {order.status} | Time:{" "}
                            {new Date(order.created_at).toLocaleString()}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5 space-y-1">
                            {order.items.map((item , idx) => (
                                <li key={idx}>
                                <strong>{item.name}</strong> - {item.quantity}x - {item.price}€ -{" "}
                                {item.notes || "no note"}
                            </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                        {order.status === "pending" && (
                            <button onClick={() => updateStatus(order.order_id, "preparing")} className="bg-yellow-500 text-white">
                                start preparing
                            </button>
                        )}
                        {order.status === "preparing" && (
                            <button onClick={() => updateStatus(order.order_id, "ready")} className="bg-green-700 text-white">
                                Order ready
                            </button>
                        )}
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}