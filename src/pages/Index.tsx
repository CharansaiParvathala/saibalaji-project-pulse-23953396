
import { Navigate } from "react-router-dom";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

const Index = () => {
  const { isAuthenticated, isLoading } = useSupabaseAuth();
  
  // Add detailed console logs to help debug
  console.log("Index component rendered, isAuthenticated:", isAuthenticated, "isLoading:", isLoading);
  
  // Show a loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
        <div className="bg-white p-8 rounded-lg shadow-xl flex flex-col items-center">
          <svg className="animate-spin h-10 w-10 text-purple-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-700">Loading your session...</p>
        </div>
      </div>
    );
  }
  
  if (isAuthenticated) {
    console.log("User is authenticated, redirecting to dashboard");
    return <Navigate to="/dashboard" replace />;
  }
  
  console.log("User is not authenticated, redirecting to login");
  return <Navigate to="/login" replace />;
};

export default Index;
