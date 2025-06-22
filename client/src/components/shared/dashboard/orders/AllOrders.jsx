import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import axios from "axios";
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChefHat, User2 } from "lucide-react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

// --- CancelOrderButton Component ---
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
      onCancel(); // refetch
    } catch (err) {
      console.error("Failed to cancel order:", err);
      toast.error("Failed to cancel order");
    }
  };

  if (status === "cancelled") return null;

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
// --- End CancelOrderButton Component ---

export const AllOrders = forwardRef((props, ref) => {
  const token = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.auth.userId);

  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const limit = 10;

  const fetchOrders = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError(null);
    try {
      let url = `${import.meta.env.VITE_BASE_URL}/orders/user-waiter?page=${page}&limit=${limit}`;
      if (userId) url += `&userId=${userId}`;

      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(res.data.orders);
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }, [page, token, userId]);

  const handleDownloadCSV = useCallback(async () => {
    if (!token) return;

    try {
      let url = `${import.meta.env.VITE_BASE_URL}/orders/user-waiter?page=1&limit=10000`;
      if (userId) url += `&userId=${userId}`;

      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const allOrders = res.data.orders;

      const csvHeaders = [
        "Order ID",
        "User Name",
        "User Role",
        "Table ID",
        "Status",
        "Total Amount",
      ];
      const csvRows = allOrders.map((order) => [
        order.id,
        order.user_name,
        order.user_role,
        order.table_id,
        order.status,
        order.total_amount,
      ]);

      const csvContent = [
        csvHeaders.join(","),
        ...csvRows.map((row) =>
          row.map((cell) => `"${(cell ?? "").toString().replace(/"/g, '""')}"`).join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;",
      });
      const urlBlob = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", urlBlob);
      link.setAttribute("download", "orders.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Failed to download CSV:", err);
    }
  }, [token, userId]);

  useImperativeHandle(ref, () => ({
    downloadCSV: handleDownloadCSV,
  }));

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (loading) return <div className="p-4 text-center">Loading orders...</div>;
  if (error) return <div className="p-4 text-center text-red-600">{error}</div>;

  return (
    <div className="p-4">
      <Button onClick={handleDownloadCSV} className="mb-4">
        Download CSV
      </Button>
      <Table>
        <TableCaption>A list of recent orders.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Order ID</TableHead>
            <TableHead>User Name</TableHead>
            <TableHead>User Role</TableHead>
            <TableHead>Table</TableHead>
            <TableHead className="text-right">Status</TableHead>
            <TableHead className="text-right text-2xl">Total</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">
                No orders found.
              </TableCell>
            </TableRow>
          )}
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium text-white">{order.id}</TableCell>
              <TableCell className="font-medium capitalize text-white">
                {order.user_name || "N/A"}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 text-white">
                  {order.user_role === "chef" && (
                    <ChefHat className="w-4 h-4 text-orange-500" />
                  )}
                  {order.user_role === "waiter" && (
                    <User2 className="w-4 h-4 text-blue-500" />
                  )}
                  <span className="capitalize">{order.user_role || "N/A"}</span>
                </div>
              </TableCell>
              <TableCell className="flex text-white">{order.table_number}</TableCell>
              <TableCell className="text-right">
                <div className="flex flex-col items-end gap-2">
                  <div
                    className={`
                      inline-block px-2 py-1 rounded-md border font-medium capitalize
                       ${order.status === "pending" ? "border-yellow-500 text-yellow-600" : ""}
                        ${order.status === "cancelled" ? "border-red-500 text-red-600" : ""}
                       ${order.status === "preparing" ? "border-blue-500 text-blue-600" : ""}
                       ${order.status === "ready" ? "border-green-500 text-green-600" : ""}
                    `}
                  >
                    {order.status}
                  </div>
                 
                </div>
              </TableCell>
              <TableCell className="text-right text-white">${order.total_amount}</TableCell>
              <TableCell className="text-right text-white">
                 <CancelOrderButton
                    orderId={order.id}
                    status={order.status}
                    onCancel={fetchOrders}
                  />
              </TableCell>
            </TableRow>
          ))}

         
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={6}>
              <div className="flex justify-between items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span>
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
});
