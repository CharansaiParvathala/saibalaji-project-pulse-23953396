
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { isAuthenticated } = useAuth();
  
  // Add detailed console logs to help debug
  console.log("Index component rendered, isAuthenticated:", isAuthenticated);
  
  // Make sure we're handling all possible states
  if (isAuthenticated === undefined) {
    // Still loading auth state
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (isAuthenticated) {
    console.log("User is authenticated, redirecting to dashboard");
    return <Navigate to="/dashboard" replace />;
  }
  
  console.log("User is not authenticated, redirecting to login");
  return <Navigate to="/login" replace />;
};

export default Index;
