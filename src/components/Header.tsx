
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth"; // We'll create this later

export function Header() {
  const { user } = useAuth(); // We'll create this hook later
  
  return (
    <header className="border-b py-2 px-4 bg-background">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
            SB
          </div>
          <h1 className="text-xl md:text-2xl font-bold m-0 mb-0">Sai Balaji</h1>
        </div>
        
        <div className="flex items-center gap-4">
          {user && (
            <span className="hidden md:inline text-sm text-muted-foreground">
              Welcome, {user.name}
            </span>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
