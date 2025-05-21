
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth"; 
import { UserRole } from "@/types";
import { useTranslation } from "react-i18next";

interface LayoutProps {
  children: ReactNode;
  requiredRoles?: Array<UserRole>;
  containerClassName?: string;
}

export function Layout({ children, requiredRoles, containerClassName = "" }: LayoutProps) {
  const { user, isAuthenticated, isLoading } = useSupabaseAuth();
  const location = useLocation();
  const { t } = useTranslation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-10 w-10 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p>{t('common.loading')}</p>
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
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      
      <main className="flex-1 overflow-auto">
        <div className={`container mx-auto py-4 px-4 ${containerClassName}`}>
          {children}
        </div>
      </main>
    </div>
  );
}
