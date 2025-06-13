import React from "react";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {Button } from "@/components/ui/Button";
import { Link } from "react-router-dom";
import StatusBadge from "@/components/shared/Tables/StatusBadge";

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

export default TableCard;