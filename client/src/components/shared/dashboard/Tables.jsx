import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ClipboardList, QrCode, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "../navbar/Navbar";

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
        const response = await fetch("http://localhost:8095/api/tables");
        if (!response.ok) throw new Error("Failed to fetch tables");

        const data = await response.json();
        console.log("API Response:", data);

        // Normalize table data to match expected format
        const normalizedTables = data.tables.map((table) => ({
          id: table.id.toString(),                 // ensure id is a string
          number: table.table_number.toString(),   // use table_number as number
          roomId: table.room_id?.toString() || "1",// fallback if no room_id
          capacity: table.capacity,
          status: table.status,
          guestsSeated: table.guests_seated || 0,  // Track the number of guests seated at the table
        }));

        setTables(normalizedTables);
      } catch (err) {
        console.error("Fetch error:", err.message);
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
        body: JSON.stringify({ user_id: 1, guests_seated: guestCount }), // Assuming user_id is 1 (replace as needed)
      });

      if (!response.ok) throw new Error("Failed to seat guests");

      // Update table status to "occupied" and update guests seated
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

      // Update table status to "available" and reset guests seated
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
      <Navbar/>
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
          />
        </TabsContent>
        <TabsContent value="available">
          <TableGrid
            tables={availableTables}
            onSeatGuests={handleSeatGuests}
            onFreeTable={handleFreeTable}
            openOrderDialog={openOrderDialog}
          />
        </TabsContent>
        <TabsContent value="occupied">
          <TableGrid
            tables={occupiedTables}
            onSeatGuests={handleSeatGuests}
            onFreeTable={handleFreeTable}
            openOrderDialog={openOrderDialog}
          />
        </TabsContent>
        <TabsContent value="reserved">
          <TableGrid
            tables={reservedTables}
            onSeatGuests={handleSeatGuests}
            onFreeTable={handleFreeTable}
            openOrderDialog={openOrderDialog}
          />
        </TabsContent>
      </Tabs>

      <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Seat Guests at Table {selectedTable?.number}</DialogTitle>
            <DialogDescription>Enter the number of guests</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="guests">Number of Guests</Label>
              <Input
                id="guests"
                type="number"
                min="1"
                max={selectedTable?.capacity || 10}
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Max capacity: {selectedTable?.capacity}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOrderDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (selectedTable) {
                  handleSeatGuests(selectedTable.id);
                  setIsOrderDialogOpen(false);
                }
              }}
            >
              Seat Guests
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

function TableGrid({ tables, onSeatGuests, onFreeTable, openOrderDialog }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tables.map((table) => (
        <TableCard
          key={table.id}
          table={table}
          roomName={roomNames[table.roomId]}
          onSeatGuests={onSeatGuests}
          onFreeTable={onFreeTable}
          openOrderDialog={openOrderDialog}
        />
      ))}
    </div>
  );
}

function TableCard({ table, roomName, onSeatGuests, onFreeTable, openOrderDialog }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Table {table.number}</CardTitle>
          <StatusBadge status={table.status} />
        </div>
        <CardDescription>{roomName}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-muted-foreground">Capacity</div>
          <div className="text-right font-medium">{table.capacity} guests</div>
          {table.status === "occupied" && (
            <>
              <div className="text-muted-foreground">Guests Seated</div>
              <div className="text-right font-medium">{table.guestsSeated} guests</div>
            </>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {table.status === "available" ? (
          <Button onClick={() => openOrderDialog(table)}>Seat Guests</Button>
        ) : table.status === "occupied" ? (
          <>
            <Button variant="outline" onClick={() => onFreeTable(table.id)}>
              Free Table
            </Button>
            <Button asChild>
              <Link to={`/dashboard/waiter/tables/${table.number}`}>Take Order</Link>
            </Button>
          </>
        ) : (
          <Button onClick={() => openOrderDialog(table)}>Seat Reservation</Button>
        )}
      </CardFooter>
    </Card>
  );
}

function StatusBadge({ status }) {
  let color = "bg-gray-100 text-gray-800";
  if (status === "available") color = "bg-green-100 text-green-800";
  else if (status === "occupied") color = "bg-red-100 text-red-800";
  else if (status === "reserved") color = "bg-amber-100 text-amber-800";

  return (
    <span className={`text-xs px-2 py-1 rounded-full ${color}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default TablesPage;
