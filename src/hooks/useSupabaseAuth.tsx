
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
    
    // Fetch user profile from profiles table
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', supabaseUser.id)
      .single();
    
    if (error) {
      console.error('Error fetching user profile:', error);
      return;
    }
    
    // Create unified user object
    setUser({
      id: supabaseUser.id,
      name: profile.full_name,
      email: supabaseUser.email || '',
      role: profile.role,
      createdAt: profile.created_at,
    });
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
    
    // Register the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name
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
      // Create a profile for the user
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        full_name: name,
        role: role
      });
      
      if (profileError) {
        toast({ 
          title: "Profile creation failed", 
          description: profileError.message,
          variant: "destructive" 
        });
      } else {
        toast({ 
          title: "Signup successful", 
          description: "Your account has been created successfully!" 
        });
        
        navigate('/login');
      }
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
