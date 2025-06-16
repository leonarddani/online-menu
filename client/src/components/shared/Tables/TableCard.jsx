import React from "react";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import DeleteButton from "../dashboard/manager/DeleteButton";

function TableCard({ table, roomName, onSeatGuests, onFreeTable, onDeleteTable, openOrderDialog, reqUserRole }) {
   console.log("TableCard props:", { table, roomName, reqUserRole });
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
        <div className="flex gap-2">
          {table.status === "available" ? (
            <Button onClick={() => openOrderDialog(table)} className="bg-green-800 hover:bg-emerald-700 text-white">Seat Guests</Button>
          ) : table.status === "occupied" ? (
            <>
              <Button variant="outline" onClick={() => onFreeTable(table.id)} className=" border-green-800">
                Free Table
              </Button>
              {/* <Button asChild className="bg-green-800 hover:bg-emerald-700 text-white">
                <Link to={`/dashboard/waiter/tables/${table.number}`}>Take Order</Link>
              </Button> */}

              <Button asChild className="bg-green-800 hover:bg-emerald-700 text-white">
  <Link to={`/dashboard/${reqUserRole}/tables/${table.number}`}>Take Order</Link>
</Button>

            </>
          ) : (
            <Button onClick={() => openOrderDialog(table)}>Seat Reservation</Button>
          )}
        </div>
        {reqUserRole === "manager" && (
          
<DeleteButton
  
  itemId={table.id}
  itemName={`Table ${table.number}`}
  resource="table"
  endpoint="/api/tables/delete"
  onDeleted={() => {
    // refetch data, or remove table from local state
    console.log("Table deleted");
  }}
/>
        )}
      </CardFooter>
    </Card>
  );
}

export default TableCard;