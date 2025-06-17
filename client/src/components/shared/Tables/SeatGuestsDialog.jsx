import React from "react";
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function SeatGuestsDialog({ isOpen, onOpenChange, selectedTable, guestCount, setGuestCount, onSeatGuests }) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (selectedTable) {
                onSeatGuests(selectedTable.id);
                onOpenChange(false);
              }
            }}
          >
            Seat Guests
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SeatGuestsDialog;