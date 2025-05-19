
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth"; 
import { Sidebar } from "@/components/Sidebar";
import { UserRole } from "@/types";

interface LayoutProps {
  children: ReactNode;
  requiredRoles?: Array<UserRole>;
}

export function Layout({ children, requiredRoles }: LayoutProps) {
  const { user, isAuthenticated, isLoading } = useSupabaseAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-10 w-10 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p>Loading your session...</p>
        </div>
      </div>
    );
  }

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
        
        <main className="flex-1 overflow-y-auto p-4 bg-soft-brown/20 dark:bg-charcoal md:ml-64">
          {/* Add left margin on md screens to account for fixed sidebar */}
          <div className="container mx-auto py-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
