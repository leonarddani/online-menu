import { ScrollArea } from "@/components/ui/scroll-area";
import SidebarHeader from "./SidebarHeader";
import SidebarLinks from "./SidebarLinks";
import SidebarLogout from "./SidebarLogout";

export default function DesktopSidebar({ routes, handleLogout }) {
  return (
    <div className="hidden h-screen border-r bg-muted/40 md:flex md:w-64 md:flex-col">
      <SidebarHeader />
      <ScrollArea className="flex-1">
        <SidebarLinks routes={routes} />
      </ScrollArea>
      <SidebarLogout handleLogout={handleLogout} />
    </div>
  );
}