
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser, AuthError } from "@supabase/supabase-js";
import { User, UserRole } from "@/types";
import { toast } from "@/components/ui/use-toast";

interface AuthState {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
}

// Define a type for the profile data from Supabase
interface ProfileData {
  id: string;
  full_name: string;
  role: UserRole;
  created_at?: string;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Initial session check and setup auth change listener
  useEffect(() => {
    async function getInitialSession() {
      setIsLoading(true);
      
      // Check for existing session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        await handleAuthChange(session.user);
      }
      
      setIsLoading(false);
      
      // Set up auth state change listener
      const { data: { subscription } } = await supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === 'SIGNED_IN' && session?.user) {
            await handleAuthChange(session.user);
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
            setSupabaseUser(null);
          }
        }
      );
      
      // Cleanup subscription
      return () => subscription.unsubscribe();
    }
    
    getInitialSession();
  }, []);
  
  // Handle auth change by fetching user profile
  async function handleAuthChange(supabaseUser: SupabaseUser) {
    setSupabaseUser(supabaseUser);
    
    try {
      // Use the storage/local API instead of direct Supabase query
      // This is a temporary workaround until proper database tables are created
      const fakeProfile: ProfileData = {
        id: supabaseUser.id,
        full_name: supabaseUser.user_metadata?.full_name || 'User',
        role: (supabaseUser.user_metadata?.role as UserRole) || 'checker',
      };
      
      // Create unified user object
      setUser({
        id: supabaseUser.id,
        name: fakeProfile.full_name,
        email: supabaseUser.email || '',
        role: fakeProfile.role,
        createdAt: fakeProfile.created_at || new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error handling auth change:', error);
    }
  }
  
  async function login(email: string, password: string) {
    setIsLoading(true);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      toast({ 
        title: "Login failed", 
        description: error.message,
        variant: "destructive"
      });
    } else if (data.user) {
      toast({ 
        title: "Login successful", 
        description: `Welcome back, ${data.user.email}!` 
      });
      navigate('/dashboard');
    }
    
    setIsLoading(false);
  }
  
  async function logout() {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast({ 
        title: "Sign out failed", 
        description: error.message,
        variant: "destructive" 
      });
    } else {
      toast({ title: "Signed out successfully" });
      setUser(null);
      setSupabaseUser(null);
      navigate('/login');
    }
  }
  
  async function signup(email: string, password: string, name: string, role: UserRole) {
    setIsLoading(true);
    
    // Register the user with metadata
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          role: role
        }
      }
    });
    
    if (error) {
      toast({ 
        title: "Signup failed", 
        description: error.message,
        variant: "destructive" 
      });
      setIsLoading(false);
      return;
    }
    
    if (data.user) {
      // We'll create the profile using metadata instead
      // This avoids direct table access until tables are properly set up
      toast({ 
        title: "Signup successful", 
        description: "Your account has been created successfully!" 
      });
      
      navigate('/login');
    }
    
    setIsLoading(false);
  }
  
  return (
    <AuthContext.Provider
      value={{
        user,
        supabaseUser,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        signup
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useSupabaseAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useSupabaseAuth must be used within a SupabaseAuthProvider");
  }
  
  return context;
}
