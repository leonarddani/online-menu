import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TableGrid from "@/components/shared/Tables/TableGrid";
import SeatGuestsDialog from "@/components/shared/Tables/SeatGuestsDialog";
import CreateTableDialog from "@/components/shared/dashboard/manager/CreateTableDialog";

// Mapping room IDs to names
const roomNames = {
  "1": "Main Dining",
  "2": "Terrace",
  "3": "Private Room",
};

const TablesPage = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const reqUserRole = user?.role || "waiter"; // Fallback to "waiter" if role is undefined

  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [guestCount, setGuestCount] = useState("2");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user) {
      toast.error("Please log in to access this page");
      navigate("/login");
    }
  }, [user, navigate]);

  // Fetch tables from API on mount
  useEffect(() => {
    const fetchTables = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/tables`);
        if (!response.ok) throw new Error("Failed to fetch tables");

        const data = await response.json();
        const normalizedTables = data.tables.map((table) => ({
          id: table.id.toString(),
          number: table.table_number.toString(),
          roomId: table.room_id?.toString() || "1",
          capacity: table.capacity,
          status: table.status,
          guestsSeated: table.guests_seated || 0,
        }));

        setTables(normalizedTables);
      } catch (err) {
        setError(err.message);
        console.error("Fetch error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchTables();
    }
  }, [user]);

  const availableTables = tables.filter((table) => table.status === "available");
  const occupiedTables = tables.filter((table) => table.status === "occupied");
  const reservedTables = tables.filter((table) => table.status === "reserved");

  // Function to handle seating guests
  const handleSeatGuests = async (tableId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/tables/${tableId}/seat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: user?.id || 1, guests_seated: guestCount }),
      });

      if (!response.ok) throw new Error("Failed to seat guests");

      setTables((prev) =>
        prev.map((table) =>
          table.id === tableId
            ? { ...table, status: "occupied", guestsSeated: guestCount }
            : table
        )
      );

      toast.success(`Table ${tableId} marked as occupied with ${guestCount} guests`);
    } catch (error) {
      toast.error("Error seating guests");
      console.error(error);
    }
  };

  // Function to handle freeing a table
  const handleFreeTable = async (tableId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/tables/${tableId}/free`, {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to free table");

      setTables((prev) =>
        prev.map((table) =>
          table.id === tableId ? { ...table, status: "available", guestsSeated: 0 } : table
        )
      );

      toast.success(`Table ${tableId} marked as available`);
    } catch (error) {
      toast.error("Error freeing table");
      console.error(error);
    }
  };

  // Function to handle deleting a table
  const handleDeleteTable = async (tableId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/tables/${tableId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete table");

      setTables((prev) => prev.filter((table) => table.id !== tableId));

      toast.success(`Table ${tableId} deleted successfully`);
    } catch (error) {
      toast.error("Error deleting table");
      console.error(error);
    }
  };

  const openOrderDialog = (table) => {
    setSelectedTable(table);
    setIsOrderDialogOpen(true);
  };

  if (loading) return <p>Loading tables...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
         <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-yellow-700 to-yellow-400 bg-clip-text text-transparent">
  Tables
</h1>
<p className="bg-gradient-to-r from-yellow-700 to-yellow-400 bg-clip-text text-transparent">
  Manage tables and take orders
</p>

        </div>
        <CreateTableDialog/>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Tables</TabsTrigger>
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="occupied">Occupied</TabsTrigger>
          <TabsTrigger value="reserved">Reserved</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <TableGrid
            tables={tables}
            onSeatGuests={handleSeatGuests}
            onFreeTable={handleFreeTable}
            onDeleteTable={handleDeleteTable}
            openOrderDialog={openOrderDialog}
            roomNames={roomNames}
            reqUserRole={reqUserRole}
          />
        </TabsContent>
        <TabsContent value="available">
          <TableGrid
            tables={availableTables}
            onSeatGuests={handleSeatGuests}
            onFreeTable={handleFreeTable}
            onDeleteTable={handleDeleteTable}
            openOrderDialog={openOrderDialog}
            roomNames={roomNames}
            reqUserRole={reqUserRole}
          />
        </TabsContent>
        <TabsContent value="occupied">
          <TableGrid
            tables={occupiedTables}
            onSeatGuests={handleSeatGuests}
            onFreeTable={handleFreeTable}
            onDeleteTable={handleDeleteTable}
            openOrderDialog={openOrderDialog}
            roomNames={roomNames}
            reqUserRole={reqUserRole}
          />
        </TabsContent>
        <TabsContent value="reserved">
          <TableGrid
            tables={reservedTables}
            onSeatGuests={handleSeatGuests}
            onFreeTable={handleFreeTable}
            onDeleteTable={handleDeleteTable}
            openOrderDialog={openOrderDialog}
            roomNames={roomNames}
            reqUserRole={reqUserRole}
          />
        </TabsContent>
      </Tabs>

      <SeatGuestsDialog
        isOpen={isOrderDialogOpen}
        onOpenChange={setIsOrderDialogOpen}
        selectedTable={selectedTable}
        guestCount={guestCount}
        setGuestCount={setGuestCount}
        onSeatGuests={handleSeatGuests}
      />
    </div>
  );
};

export default TablesPage;