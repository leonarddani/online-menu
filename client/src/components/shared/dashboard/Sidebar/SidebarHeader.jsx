import { Link } from "react-router-dom";
import { Coffee, X  } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SidebarHeader({ showCloseButton, onClose }) {
  return (
    <div className="flex h-14 items-center border-b px-4">
      <Link to="/" className="flex items-center gap-2 font-semibold">
        <Coffee  className="h-6 w-6" />
        <span  className="text-2xl font-bold bg-gradient-to-r from-yellow-700 to-yellow-400 bg-clip-text text-transparent">Moxxa Caffe</span>
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