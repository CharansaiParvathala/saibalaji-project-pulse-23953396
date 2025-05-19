import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { User, UserRole } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface AuthState {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
}

// Context for authentication state
const AuthContext = createContext<AuthState | undefined>(undefined);

export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Handle session and user profile data
  const handleUserData = async (supabaseUser: SupabaseUser | null) => {
    if (!supabaseUser) {
      setUser(null);
      setSupabaseUser(null);
      localStorage.removeItem("sai-balaji-user");
      return;
    }
    
    setSupabaseUser(supabaseUser);
    
    try {
      // Use as unknown type to bypass TypeScript strictness for now
      // This is a workaround until proper types are available for your tables
      const { data: profile, error } = await supabase
        .from('profiles' as unknown as never)
        .select('*')
        .eq('id', supabaseUser.id)
        .single();
        
      if (error) {
        console.error("Error fetching user profile:", error);
        // Fallback to metadata if no profile found
        const userData: User = {
          id: supabaseUser.id,
          name: supabaseUser.user_metadata?.full_name || 'User',
          email: supabaseUser.email || '',
          role: (supabaseUser.user_metadata?.role as UserRole) || 'checker',
          createdAt: new Date().toISOString(),
        };
        
        setUser(userData);
        localStorage.setItem("sai-balaji-user", JSON.stringify(userData));
        return;
      }
      
      // Create unified user object from profile data with null checks
      const userData: User = {
        id: supabaseUser.id,
        name: profile?.full_name || supabaseUser.user_metadata?.full_name || 'User',
        email: supabaseUser.email || '',
        role: (profile?.role as UserRole) || (supabaseUser.user_metadata?.role as UserRole) || 'checker',
        createdAt: profile?.created_at || new Date().toISOString(),
      };
      
      setUser(userData);
      localStorage.setItem("sai-balaji-user", JSON.stringify(userData));
      console.log("User profile loaded:", userData);
    } catch (error) {
      console.error('Error processing user profile:', error);
    }
  };

  // Initial session check and setup auth change listener
  useEffect(() => {
    async function setupAuth() {
      setIsLoading(true);
      
      try {
        // First set up the auth state listener to avoid race conditions
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log("Auth state changed:", event, session?.user?.email);
            
            if (event === 'SIGNED_IN' && session?.user) {
              await handleUserData(session.user);
            } else if (event === 'SIGNED_OUT') {
              handleUserData(null);
            }
          }
        );
        
        // Then check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log("Found existing session", session.user.email);
          await handleUserData(session.user);
        } else {
          console.log("No existing session found");
          handleUserData(null);
        }
      } catch (error) {
        console.error("Error setting up auth:", error);
      } finally {
        setIsLoading(false);
      }
      
      return () => {
        // Cleanup function
        console.log("Cleaning up auth subscription");
      };
    }
    
    setupAuth();
  }, []);
  
  async function login(email: string, password: string) {
    setIsLoading(true);
    console.log("Attempting login for:", email);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("Login error:", error);
        toast({ 
          title: "Login failed", 
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }
      
      if (data.user) {
        console.log("Login successful for:", data.user.email);
        await handleUserData(data.user);
        
        toast({ 
          title: "Login successful", 
          description: `Welcome back, ${data.user.email}!` 
        });
        
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Login process error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }
  
  async function logout() {
    try {
      console.log("Attempting logout");
      setIsLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Logout error:", error);
        toast({ 
          title: "Sign out failed", 
          description: error.message,
          variant: "destructive" 
        });
        throw error;
      }
      
      console.log("Logout successful");
      toast({ 
        title: "Signed out successfully" 
      });
      
      // Clear user data
      setUser(null);
      setSupabaseUser(null);
      localStorage.removeItem("sai-balaji-user");
      
      navigate('/login');
    } catch (error) {
      console.error("Logout process error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }
  
  async function signup(email: string, password: string, name: string, role: UserRole) {
    setIsLoading(true);
    console.log("Attempting signup for:", email, "with role:", role);
    
    try {
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
        console.error("Signup error:", error);
        toast({ 
          title: "Signup failed", 
          description: error.message,
          variant: "destructive" 
        });
        throw error;
      }
      
      if (data.user) {
        console.log("Signup successful for:", data.user.email);
        
        toast({ 
          title: "Signup successful", 
          description: "Your account has been created successfully! You can now log in." 
        });
        
        // Redirect to login instead of auto-login
        navigate('/login');
      }
    } catch (error) {
      console.error("Signup process error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
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
