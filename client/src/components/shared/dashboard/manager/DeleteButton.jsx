import { Button } from '@/components/ui/button';
import { Dialog, DialogHeader, DialogFooter, DialogTitle, DialogContent } from '@/components/ui/dialog';
import { Trash } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const DeleteButton = ({ itemId, itemName, resource = "item", endpoint, onDeleted }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDeleteConfirm = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/tables/delete/${itemId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete ${resource}.`);
      }

      toast.success(`${resource[0].toUpperCase() + resource.slice(1)} deleted`, {
        description: `${resource[0].toUpperCase() + resource.slice(1)} "${itemName}" has been successfully deleted.`
      });

      onDeleted?.(); // only call if defined
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
            <p className='text-muted-foreground'>
              Are you sure you want to delete <span className='text-primary'>{itemName}</span> {resource}?
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
