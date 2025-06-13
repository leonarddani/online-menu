import { useSelector } from "react-redux";
import { useState, useMemo } from "react";
import { useLocation, useNavigate, matchPath } from "react-router-dom";
import MobileSidebar from "./MobileSidebar";
import DesktopSidebar from "./DesktopSidebar";
import {ClipboardList, Home, Menu, Settings, Star, Store, Users } from "lucide-react";
import { toast } from "sonner";

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
      icon: Home,
      href: `/dashboard/${role}`,
      exact: true,
    },
    {
      label: "Settings",
      icon: Settings,
      href: `/dashboard/${role}/settings`,
    },
  ];

  const roleRoutes = {
    manager: [
      // { label: "Tables", icon: Store, href: "/dashboard/manager/tables" },
      { label: "Staff Management", icon: Users, href: "/dashboard/manager/staff" },
       { label: "Orders", icon: ClipboardList, href: "/dashboard/waiter/orders" },
      // { label: "Products & Offers", icon: Menu, href: "/dashboard/manager/products" },
      // { label: "Bookings", icon: BookOpenCheck, href: "/dashboard/manager/bookings" },
    ],
    waiter: [
      { label: "Orders", icon: ClipboardList, href: "/dashboard/waiter/orders" },
    ],
    chef: [
      { label: "Orders", icon: ClipboardList, href: "/dashboard/chef/orders" },
      { label: "Menu", icon: Menu, href: "/dashboard/chef/menu" },
    ],
    client: [
      // { label: "Menu", icon: Menu, href: "/dashboard/client/menu" },
      { label: "My Orders", icon: ClipboardList, href: "/dashboard/client/orders" },
      // { label: "Book a Table", icon: BookOpenCheck, href: "/dashboard/client/book" },
      { label: "My Ratings", icon: Star, href: "/dashboard/client/ratings" },
    ],
  };

  const routes = useMemo(() => {
    const allRoutes = [...baseRoutes, ...(roleRoutes[role] || [])];
    return allRoutes.map((route) => {
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

  return (
    <>
      <MobileSidebar
        open={open}
        setOpen={setOpen}
        routes={routes}
        handleLogout={handleLogout}
      />
      <DesktopSidebar routes={routes} handleLogout={handleLogout} />
    </>
  );
}