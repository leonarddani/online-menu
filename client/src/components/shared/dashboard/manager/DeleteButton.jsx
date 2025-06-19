import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";
import { Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { fetchTables } from "@/store/tablesSlice";

const DeleteButton = ({ itemId, itemName, resource = "item" }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  // get token from redux
  const token = useSelector((state) => state.auth.token);

  const handleDeleteConfirm = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/tables/delete/${itemId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete ${resource}.`);
      }

      toast.success(`${resource[0].toUpperCase() + resource.slice(1)} deleted`, {
        description: `${resource[0].toUpperCase() + resource.slice(1)} "${itemName}" has been successfully deleted.`,
      });

      dispatch(fetchTables()); // refresh list
      setShowDialog(false);
    } catch (error) {
      toast.error("Error", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="destructive" size="sm" onClick={() => setShowDialog(true)}>
        <Trash />
      </Button>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {resource}</DialogTitle>
            <p className="text-muted-foreground">
              Are you sure you want to delete <span className="text-primary">{itemName}</span> {resource}?
            </p>
          </DialogHeader>
          <DialogFooter>
            <Button className="destructive" onClick={handleDeleteConfirm} disabled={loading}>
              {loading ? "Deleting..." : "Confirm Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeleteButton;
