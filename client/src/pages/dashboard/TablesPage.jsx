import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import TableGrid from "@/components/shared/Tables/TableGrid";
import SeatGuestsDialog from "@/components/shared/Tables/SeatGuestsDialog";
import CreateTableDialog from "@/components/shared/dashboard/manager/CreateTableDialog";

import {
  fetchTables,
  seatGuests,
  freeTable,
  deleteTable,
} from "@/store/tablesSlice";

// Room name mapping
const roomNames = {
  "1": "Main Dining",
  "2": "Terrace",
  "3": "Private Room",
};

const TablesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);
  const reqUserRole = user?.role || "waiter";

  const { tables, loading, error } = useSelector((state) => state.tables);

  const [selectedTable, setSelectedTable] = useState(null);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [guestCount, setGuestCount] = useState("2");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      toast.error("Please log in to access this page");
      navigate("/login");
    }
  }, [user, navigate]);

  // Fetch tables on mount
  useEffect(() => {
    if (user) dispatch(fetchTables());
  }, [user, dispatch]);

  const handleSeatGuests = async (tableId) => {
    try {
      await dispatch(seatGuests({ tableId, userId: user.id, guests: guestCount })).unwrap();
      toast.success(`Table ${tableId} marked as occupied with ${guestCount} guests`);
    } catch (err) {
      toast.error(err.message || "Failed to seat guests");
    }
  };

  const handleFreeTable = async (tableId) => {
    try {
      await dispatch(freeTable(tableId)).unwrap();
      toast.success(`Table ${tableId} marked as available`);
    } catch (err) {
      toast.error(err.message || "Failed to free table");
    }
  };

  const handleDeleteTable = async (tableId) => {
    try {
      await dispatch(deleteTable(tableId)).unwrap();
      toast.success(`Table ${tableId} deleted`);
    } catch (err) {
      toast.error(err.message || "Failed to delete table");
    }
  };

  const openOrderDialog = (table) => {
    setSelectedTable(table);
    setIsOrderDialogOpen(true);
  };

  const availableTables = tables.filter((t) => t.status === "available");
  const occupiedTables = tables.filter((t) => t.status === "occupied");
  const reservedTables = tables.filter((t) => t.status === "reserved");

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

        <CreateTableDialog
          isOpen={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onTableCreated={() => {
            dispatch(fetchTables());
            setIsCreateDialogOpen(false);
          }}
        />
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
