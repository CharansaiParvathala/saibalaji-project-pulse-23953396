
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { NotificationCenter } from "@/components/NotificationCenter";
import { Link } from "react-router-dom";
import { Menu, Building2 } from "lucide-react";

export function Header() {
  const { user } = useSupabaseAuth();
  
  return (
    <header className="border-b bg-background sticky top-0 z-10">
      <div className="container mx-auto py-3 px-4 flex items-center justify-between">
        <div className="flex items-center">
          <button className="mr-4 text-muted-foreground md:hidden">
            <Menu className="h-6 w-6" />
          </button>
          <Link to="/" className="font-bold text-lg text-primary flex items-center">
            <Building2 className="h-5 w-5 mr-2" />
            SAI BALAJI
          </Link>
        </div>
        
        <div className="flex items-center gap-2">
          {user && <NotificationCenter />}
          <ThemeToggle />
          {!user && (
            <Link to="/login">
              <Button>Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
