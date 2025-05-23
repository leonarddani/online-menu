import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardList, QrCode, Users } from "lucide-react";
import { Link } from "react-router-dom";  // React Router Link
import { toast } from "sonner";  // Import Sonner toast directly

// Mock data
const mockTables = [
  { id: "1", number: "1", roomId: "1", capacity: 4, status: "available" },
  { id: "2", number: "2", roomId: "1", capacity: 4, status: "occupied" },
  { id: "3", number: "3", roomId: "1", capacity: 6, status: "available" },
  { id: "4", number: "4", roomId: "1", capacity: 2, status: "reserved" },
  { id: "5", number: "5", roomId: "2", capacity: 4, status: "available" },
  { id: "6", number: "6", roomId: "2", capacity: 4, status: "occupied" },
  { id: "7", number: "7", roomId: "3", capacity: 8, status: "reserved" },
  { id: "8", number: "8", roomId: "3", capacity: 4, status: "available" },
];

const roomNames = {
  "1": "Main Dining",
  "2": "Terrace",
  "3": "Private Room",
};

const TablesPage = () => {
  const [tables, setTables] = useState(mockTables);
  const [selectedTable, setSelectedTable] = useState(null);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [guestCount, setGuestCount] = useState("2");

  const availableTables = tables.filter((table) => table.status === "available");
  const occupiedTables = tables.filter((table) => table.status === "occupied");
  const reservedTables = tables.filter((table) => table.status === "reserved");

  const handleSeatGuests = (tableId) => {
    setTables(tables.map((table) => (table.id === tableId ? { ...table, status: "occupied" } : table)));
    toast.success(`Table ${tableId} has been marked as occupied`);
  };

  const handleFreeTable = (tableId) => {
    setTables(tables.map((table) => (table.id === tableId ? { ...table, status: "available" } : table)));
    toast.success(`Table ${tableId} has been marked as available`);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tables</h1>
          <p className="text-muted-foreground">Manage tables and take orders</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Tables</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableTables.length}</div>
            <p className="text-xs text-muted-foreground">Ready to seat guests</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupied Tables</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{occupiedTables.length}</div>
            <p className="text-xs text-muted-foreground">Currently serving</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reserved Tables</CardTitle>
            <QrCode className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reservedTables.length}</div>
            <p className="text-xs text-muted-foreground">Upcoming bookings</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Tables</TabsTrigger>
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="occupied">Occupied</TabsTrigger>
          <TabsTrigger value="reserved">Reserved</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tables.map((table) => (
              <TableCard
                key={table.id}
                table={table}
                roomName={roomNames[table.roomId]}
                onSeatGuests={handleSeatGuests}
                onFreeTable={handleFreeTable}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="available" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {availableTables.map((table) => (
              <TableCard
                key={table.id}
                table={table}
                roomName={roomNames[table.roomId]}
                onSeatGuests={handleSeatGuests}
                onFreeTable={handleFreeTable}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="occupied" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {occupiedTables.map((table) => (
              <TableCard
                key={table.id}
                table={table}
                roomName={roomNames[table.roomId]}
                onSeatGuests={handleSeatGuests}
                onFreeTable={handleFreeTable}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reserved" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reservedTables.map((table) => (
              <TableCard
                key={table.id}
                table={table}
                roomName={roomNames[table.roomId]}
                onSeatGuests={handleSeatGuests}
                onFreeTable={handleFreeTable}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Seat Guests at Table {selectedTable?.number}</DialogTitle>
            <DialogDescription>Enter the number of guests to seat at this table</DialogDescription>
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
              <p className="text-xs text-muted-foreground">Maximum capacity: {selectedTable?.capacity} guests</p>
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

function TableCard({ table, roomName, onSeatGuests, onFreeTable }) {
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
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {table.status === "available" ? (
          <Button onClick={() => onSeatGuests(table.id)}>Seat Guests</Button>
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
          <Button onClick={() => onSeatGuests(table.id)}>Seat Reservation</Button>
        )}
      </CardFooter>
    </Card>
  );
}

function StatusBadge({ status }) {
  let color = "bg-gray-100 text-gray-800";

  if (status === "available") {
    color = "bg-green-100 text-green-800";
  } else if (status === "occupied") {
    color = "bg-red-100 text-red-800";
  } else if (status === "reserved") {
    color = "bg-amber-100 text-amber-800";
  }

  return (
    <span className={`text-xs px-2 py-1 rounded-full ${color}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default TablesPage;
