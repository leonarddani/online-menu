import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function SidebarLinks({ routes, onClick }) {
  return (
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
}