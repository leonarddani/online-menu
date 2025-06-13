import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function SidebarLogout({ handleLogout }) {
  return (
    <div className="mt-auto p-4 border-t">
      <Button
        variant="outline"
        className="w-full justify-start gap-2"
        onClick={handleLogout}
      >
        <LogOut className="h-4 w-4" />
        Logout
      </Button>
    </div>
  );
}