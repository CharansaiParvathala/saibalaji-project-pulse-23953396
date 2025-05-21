
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
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
  CalendarCheck,
  Menu,
  X,
  Key
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

export function Sidebar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  if (!user) return null;
  
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  
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
      { to: "/users/credentials", icon: Key, label: "Credentials" },
      { to: "/vehicles", icon: Truck, label: "Vehicles" },
      { to: "/statistics", icon: BarChart, label: "Statistics" },
    ],
  };
  
  const links = roleLinks[user.role as keyof typeof roleLinks] || [];
  
  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={toggleSidebar}
          className="p-2 bg-primary text-primary-foreground rounded-md"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar for desktop and mobile (when open) */}
      <aside 
        className={cn(
          "w-64 border-r bg-background overflow-y-auto fixed top-0 left-0 h-full z-40 transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          "md:w-64" // Fixed width on desktop
        )}
      >
        <div className="py-6 px-3 flex flex-col h-full pt-16 md:pt-6">
          <div className="px-4 py-2 mb-2">
            <p className="font-medium text-primary">{user.name}</p>
            <p className="text-sm text-muted-foreground">
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard
            </p>
          </div>
          
          <nav className="space-y-1 flex-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
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
              onClick={handleLogout}
              className="flex items-center px-4 py-3 text-sm font-medium w-full rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
