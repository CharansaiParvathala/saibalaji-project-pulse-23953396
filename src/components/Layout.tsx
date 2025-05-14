
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { Sidebar } from "@/components/Sidebar";

interface LayoutProps {
  children: ReactNode;
  requiredRoles?: Array<"leader" | "checker" | "owner" | "admin">;
}

export function Layout({ children, requiredRoles }: LayoutProps) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // Check if the user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if the user has required role
  if (requiredRoles && user && !requiredRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto p-4 bg-soft-brown/20 dark:bg-charcoal">
          <div className="container mx-auto py-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
