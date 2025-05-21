
import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole } from '@/types';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, fullName: string, role: UserRole) => Promise<{ error: any }>;
  isLoading: boolean; // Added missing property
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  signIn: async () => ({ error: null }),
  signOut: async () => {},
  refreshUser: async () => {},
  login: async () => ({ error: null }),
  logout: async () => {},
  signup: async () => ({ error: null }),
  isLoading: true // Added missing property
});

export const SupabaseAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          setUser({
            id: session.user.id,
            name: profile.full_name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email || '',
            role: profile.role as UserRole || 'leader'
          });
        }
      }
      
      setLoading(false);
    };

    getUserProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.info('Auth state changed:', event, session);
      
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (profile) {
          setUser({
            id: session.user.id,
            name: profile.full_name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email || '',
            role: profile.role as UserRole || 'leader'
          });
        }
      } else {
        console.info('No existing session found');
        setUser(null);
      }
      
      setLoading(false);
    });

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signup = async (email: string, password: string, fullName: string, role: UserRole) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role
          }
        }
      });
      
      if (!error) {
        toast({
          title: "Sign up successful",
          description: "Please check your email to verify your account."
        });
      }
      
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    signIn: login,
    signOut: async () => {
      await supabase.auth.signOut();
      setUser(null);
      navigate('/login');
    },
    refreshUser: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (profile) {
          setUser({
            id: session.user.id,
            name: profile.full_name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email || '',
            role: profile.role as UserRole || 'leader'
          });
        }
      }
    },
    login,
    logout: async () => {
      await supabase.auth.signOut();
      setUser(null);
      navigate('/login');
    },
    signup,
    isLoading: loading // Add missing property
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Export the hook
export const useSupabaseAuth = () => useContext(AuthContext);

// For toast notifications
