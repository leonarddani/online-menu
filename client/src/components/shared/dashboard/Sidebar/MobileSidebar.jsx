import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"; // Correct import
import { ScrollArea } from "@/components/ui/scroll-area";
import { Menu } from "lucide-react";
import SidebarHeader from "./SidebarHeader";
import SidebarLinks from "./SidebarLinks";
import SidebarLogout from "./SidebarLogout";

export default function MobileSidebar({ open, setOpen, routes, handleLogout }) {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <div className="flex h-full flex-col bg-muted/40">
          <SidebarHeader showCloseButton onClose={() => setOpen(false)} />
          <ScrollArea className="flex-1">
            <SidebarLinks routes={routes} onClick={() => setOpen(false)} />
          </ScrollArea>
          <SidebarLogout handleLogout={handleLogout} />
        </div>
      </SheetContent>
    </Sheet>
  );
}