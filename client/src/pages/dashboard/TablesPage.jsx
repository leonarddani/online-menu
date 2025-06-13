import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TableGrid from "@/components/shared/Tables/TableGrid";
import SeatGuestsDialog from "@/components/shared/Tables/SeatGuestsDialog";

// Mapping room IDs to names
const roomNames = {
  "1": "Main Dining",
  "2": "Terrace",
  "3": "Private Room",
};

const TablesPage = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [guestCount, setGuestCount] = useState("2");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch tables from API on mount
  useEffect(() => {
    const fetchTables = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8095/api/tables");
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

    fetchTables();
  }, []);

  const availableTables = tables.filter((table) => table.status === "available");
  const occupiedTables = tables.filter((table) => table.status === "occupied");
  const reservedTables = tables.filter((table) => table.status === "reserved");

  // Function to handle seating guests
  const handleSeatGuests = async (tableId) => {
    try {
      const response = await fetch(`http://localhost:8095/api/tables/${tableId}/seat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: 1, guests_seated: guestCount }),
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
      const response = await fetch(`http://localhost:8095/api/tables/${tableId}/free`, {
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
          <h1 className="text-3xl font-bold tracking-tight">Tables</h1>
          <p className="text-muted-foreground">Manage tables and take orders</p>
        </div>
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
            openOrderDialog={openOrderDialog}
            roomNames={roomNames}
          />
        </TabsContent>
        <TabsContent value="available">
          <TableGrid
            tables={availableTables}
            onSeatGuests={handleSeatGuests}
            onFreeTable={handleFreeTable}
            openOrderDialog={openOrderDialog}
            roomNames={roomNames}
          />
        </TabsContent>
        <TabsContent value="occupied">
          <TableGrid
            tables={occupiedTables}
            onSeatGuests={handleSeatGuests}
            onFreeTable={handleFreeTable}
            openOrderDialog={openOrderDialog}
            roomNames={roomNames}
          />
        </TabsContent>
        <TabsContent value="reserved">
          <TableGrid
            tables={reservedTables}
            onSeatGuests={handleSeatGuests}
            onFreeTable={handleFreeTable}
            openOrderDialog={openOrderDialog}
            roomNames={roomNames}
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