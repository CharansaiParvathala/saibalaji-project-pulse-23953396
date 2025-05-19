
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import ClassicMenuBar from "@/components/ClassicMenuBar";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { 
  Home, FileText, Truck, Users, 
  Calendar, DollarSign, BarChart2, 
  LogOut, Settings, FileArchive, History,
  User
} from "lucide-react";
import { UserRole } from "@/types";

interface ClassicLayoutProps {
  children: ReactNode;
  requiredRoles?: UserRole[];
}

export function ClassicLayout({ children, requiredRoles }: ClassicLayoutProps) {
  const { user, isAuthenticated, logout } = useSupabaseAuth();
  const location = useLocation();

  // Check if the user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if the user has required role
  if (requiredRoles && user && !requiredRoles.includes(user.role as UserRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  const menuSections = [
    {
      label: "File",
      items: [
        {
          label: "Dashboard",
          icon: <Home className="h-4 w-4" />,
          link: "/dashboard"
        },
        {
          label: "Sign Out",
          icon: <LogOut className="h-4 w-4" />,
          onClick: () => logout()
        },
      ]
    },
    {
      label: "Projects",
      items: [
        {
          label: "All Projects",
          icon: <FileText className="h-4 w-4" />,
          link: "/projects"
        },
        {
          label: "Add Progress",
          icon: <Calendar className="h-4 w-4" />,
          link: "/progress"
        },
      ]
    },
    {
      label: "Payments",
      items: [
        {
          label: "Request Payment",
          icon: <DollarSign className="h-4 w-4" />,
          link: "/payments/request"
        },
        {
          label: "Approve Payments",
          icon: <DollarSign className="h-4 w-4" />,
          link: "/payments/approve"
        },
        {
          label: "Payment History",
          icon: <History className="h-4 w-4" />,
          link: "/payments/history"
        },
      ]
    },
    {
      label: "Resources",
      items: [
        {
          label: "Vehicles",
          icon: <Truck className="h-4 w-4" />,
          link: "/vehicles"
        },
        {
          label: "Users",
          icon: <User className="h-4 w-4" />,
          link: "/users"
        },
        {
          label: "Statistics",
          icon: <BarChart2 className="h-4 w-4" />,
          link: "/statistics"
        },
      ]
    }
  ];

  // Add admin-only menu items
  if (user?.role === "admin" || user?.role === "owner") {
    menuSections.push({
      label: "Admin",
      items: [
        {
          label: "User Credentials",
          icon: <Users className="h-4 w-4" />,
          link: "/users/credentials"
        },
        {
          label: "Data Backup",
          icon: <FileArchive className="h-4 w-4" />,
          link: "/backup"
        },
        {
          label: "Settings",
          icon: <Settings className="h-4 w-4" />,
          link: "/settings"
        },
      ]
    });
  }

  return (
    <div className="flex flex-col min-h-screen">
      <ClassicMenuBar sections={menuSections} />
      
      <main className="flex-1 overflow-y-auto p-4 bg-background">
        <div className="container mx-auto py-4">
          {children}
        </div>
      </main>
      
      <footer className="bg-muted text-center p-2 border-t border-border text-xs">
        <p>Sai Balaji Construction © {new Date().getFullYear()} - Classic 90s Edition</p>
      </footer>
    </div>
  );
}

export default ClassicLayout;
