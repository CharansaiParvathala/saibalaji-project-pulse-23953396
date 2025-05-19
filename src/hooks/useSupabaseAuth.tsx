
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
  const [user, setUser] = useState<User | null>(() => {
    // Check if user data exists in localStorage
    const savedUser = localStorage.getItem("sai-balaji-user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Initial session check and setup auth change listener
  useEffect(() => {
    async function getInitialSession() {
      setIsLoading(true);
      
      try {
        // Check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log("Found existing session", session.user.email);
          await handleAuthChange(session.user);
        } else {
          console.log("No existing session found");
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setIsLoading(false);
      }
      
      // Set up auth state change listener
      const { data: { subscription } } = await supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log("Auth state change event:", event);
          if (event === 'SIGNED_IN' && session?.user) {
            console.log("User signed in:", session.user.email);
            await handleAuthChange(session.user);
          } else if (event === 'SIGNED_OUT') {
            console.log("User signed out");
            setUser(null);
            setSupabaseUser(null);
            localStorage.removeItem("sai-balaji-user");
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
      console.log("Processing user data from metadata");
      
      // Use the user metadata instead of querying tables
      // This is a temporary workaround until proper database tables are created
      const fakeProfile: ProfileData = {
        id: supabaseUser.id,
        full_name: supabaseUser.user_metadata?.full_name || 'User',
        role: (supabaseUser.user_metadata?.role as UserRole) || 'checker',
      };
      
      // Create unified user object
      const userData: User = {
        id: supabaseUser.id,
        name: fakeProfile.full_name,
        email: supabaseUser.email || '',
        role: fakeProfile.role,
        createdAt: fakeProfile.created_at || new Date().toISOString(),
      };
      
      setUser(userData);
      
      // Store user in localStorage for persistence
      localStorage.setItem("sai-balaji-user", JSON.stringify(userData));
      console.log("User processed successfully:", userData.email);
    } catch (error) {
      console.error('Error handling auth change:', error);
    }
  }
  
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
      } else if (data.user) {
        console.log("Login successful for:", data.user.email);
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
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Logout error:", error);
        toast({ 
          title: "Sign out failed", 
          description: error.message,
          variant: "destructive" 
        });
        throw error;
      } else {
        console.log("Logout successful");
        toast({ title: "Signed out successfully" });
        setUser(null);
        setSupabaseUser(null);
        localStorage.removeItem("sai-balaji-user");
        navigate('/login');
      }
    } catch (error) {
      console.error("Logout process error:", error);
      throw error;
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
        // We'll create the profile using metadata instead
        // This avoids direct table access until tables are properly set up
        toast({ 
          title: "Signup successful", 
          description: "Your account has been created successfully! Please verify your email if required." 
        });
        
        // Redirect to login instead of auto-login
        // This gives time for email verification if enabled
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
