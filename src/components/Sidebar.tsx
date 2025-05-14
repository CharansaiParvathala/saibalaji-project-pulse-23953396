
import { NavLink } from "react-router-dom";
import { 
  Home, 
  PlusCircle, 
  CheckCircle, 
  CreditCard, 
  BarChart, 
  Users,
  Truck,
  LogOut,
  Clock,
  FileText,
  History,
  CalendarCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

export function Sidebar() {
  const { user, logout } = useAuth();
  
  if (!user) return null;
  
  const roleLinks = {
    leader: [
      { to: "/dashboard", icon: Home, label: "Dashboard" },
      { to: "/projects/create", icon: PlusCircle, label: "Create Project" },
      { to: "/progress", icon: Clock, label: "Add Progress" },
      { to: "/payments/request", icon: CreditCard, label: "Request Payment" },
      { to: "/payments/history", icon: History, label: "Payment History" },
    ],
    checker: [
      { to: "/dashboard", icon: Home, label: "Dashboard" },
      { to: "/submissions", icon: FileText, label: "Review Submissions" },
      { to: "/history", icon: History, label: "Review History" },
    ],
    owner: [
      { to: "/dashboard", icon: Home, label: "Dashboard" },
      { to: "/payments/approve", icon: CalendarCheck, label: "Payment Management" },
      { to: "/statistics", icon: BarChart, label: "Statistics" },
    ],
    admin: [
      { to: "/dashboard", icon: Home, label: "Dashboard" },
      { to: "/users", icon: Users, label: "Manage Users" },
      { to: "/vehicles", icon: Truck, label: "Vehicles" },
      { to: "/statistics", icon: BarChart, label: "Statistics" },
    ],
  };
  
  const links = roleLinks[user.role] || [];
  
  return (
    <aside className="w-64 border-r bg-background overflow-y-auto hidden md:block">
      <div className="py-6 px-3 flex flex-col h-full">
        <div className="px-4 py-2 mb-2">
          <p className="font-medium text-sm text-muted-foreground">
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard
          </p>
        </div>
        
        <nav className="space-y-1 flex-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-md",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                )
              }
            >
              <link.icon className="mr-3 h-5 w-5" />
              {link.label}
            </NavLink>
          ))}
        </nav>
        
        <div className="pt-2 mt-auto">
          <button
            onClick={logout}
            className="flex items-center px-4 py-3 text-sm font-medium w-full rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign out
          </button>
        </div>
      </div>
    </aside>
  );
}
