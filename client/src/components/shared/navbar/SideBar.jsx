import { useSelector } from "react-redux";
import { useState, useMemo } from "react";
import { Link, useLocation, useNavigate, matchPath } from "react-router-dom";
import {
  BookOpenCheck,
  ChefHat,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Star,
  Store,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const user = useSelector((state) => state.auth.user);
  const role = user?.role;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("You have been successfully logged out");
    navigate("/login");
  };

  const baseRoutes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: `/dashboard/${role}`,
      exact: true, // custom prop to require exact match
    },
    {
      label: "Settings",
      icon: Settings,
      href: `/dashboard/${role}/settings`,
    },
  ];

  const roleRoutes = {
    manager: [
      { label: "Tables", icon: Store, href: "/dashboard/manager/tables" },
      { label: "Staff Management", icon: Users, href: "/dashboard/manager/staff" },
      { label: "Products & Offers", icon: Menu, href: "/dashboard/manager/products" },
      { label: "Bookings", icon: BookOpenCheck, href: "/dashboard/manager/bookings" },
    ],
    waiter: [
      // { label: "Tables", icon: Store, href: "/dashboard/waiter/tables" },
      { label: "Orders", icon: ClipboardList, href: "/dashboard/waiter/orders" },
    ],
    chef: [
      { label: "Orders", icon: ClipboardList, href: "/dashboard/chef/orders" },
      { label: "Menu", icon: Menu, href: "/dashboard/chef/menu" },
    ],
    client: [
      { label: "Menu", icon: Menu, href: "/dashboard/client/menu" },
      { label: "My Orders", icon: ClipboardList, href: "/dashboard/client/orders" },
      { label: "Book a Table", icon: BookOpenCheck, href: "/dashboard/client/book" },
      { label: "My Ratings", icon: Star, href: "/dashboard/client/ratings" },
    ],
  };

  const routes = useMemo(() => {
    const allRoutes = [...baseRoutes, ...(roleRoutes[role] || [])];
    return allRoutes.map((route) => {
      // matchPath options
      const match = matchPath(
        {
          path: route.href,
          end: route.exact || false,
        },
        location.pathname
      );

      return {
        ...route,
        active: Boolean(match),
      };
    });
  }, [role, location.pathname]);

  const SidebarLinks = ({ onClick }) => (
    <div className="flex flex-col gap-2 p-4">
      {routes.map((route) => (
        <Link
          key={route.href}
          to={route.href}
          onClick={onClick}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-primary",
            route.active ? "bg-primary/10 text-primary" : "text-muted-foreground"
          )}
        >
          <route.icon className="h-5 w-5" />
          {route.label}
        </Link>
      ))}
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <div className="flex h-full flex-col bg-muted/40">
            <div className="flex h-14 items-center px-4 border-b">
              <Link to="/" className="flex items-center gap-2 font-semibold">
                <ChefHat className="h-6 w-6" />
                <span>Restaurant POS</span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto"
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
            <ScrollArea className="flex-1">
              <SidebarLinks onClick={() => setOpen(false)} />
            </ScrollArea>
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
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden h-screen border-r bg-muted/40 md:flex md:w-64 md:flex-col">
        <div className="flex h-14 items-center border-b px-4">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <ChefHat className="h-6 w-6" />
            <span>Kaffe POS</span>
          </Link>
        </div>
        <ScrollArea className="flex-1">
          <SidebarLinks />
        </ScrollArea>
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
      </div>
    </>
  );
}
