
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

export default function Unauthorized() {
  const { logout } = useAuth();
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-soft-brown/20 dark:bg-charcoal">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
        <p className="text-lg mb-6">
          You don't have permission to access this page. Please contact an administrator if you believe this is an error.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild variant="outline">
            <Link to="/dashboard">Return to Dashboard</Link>
          </Button>
          <Button onClick={logout}>Sign Out</Button>
        </div>
      </div>
    </div>
  );
}
