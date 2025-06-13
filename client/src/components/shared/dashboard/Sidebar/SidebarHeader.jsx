import { Link } from "react-router-dom";
import { ChefHat } from "lucide-react";

export default function SidebarHeader({ showCloseButton, onClose }) {
  return (
    <div className="flex h-14 items-center border-b px-4">
      <Link to="/" className="flex items-center gap-2 font-semibold">
        <ChefHat className="h-6 w-6" />
        <span>Kaffe POS</span>
      </Link>
      {showCloseButton && (
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </Button>
      )}
    </div>
  );
}