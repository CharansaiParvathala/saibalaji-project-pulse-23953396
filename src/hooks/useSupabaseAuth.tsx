
import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => ({ error: null }),
  signOut: async () => {},
  refreshUser: async () => {},
  isAuthenticated: false
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
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
            role: profile.role || 'leader'
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
            role: profile.role || 'leader'
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

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    signIn: async (email, password) => {
      try {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error };
      } catch (error) {
        return { error };
      }
    },
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
            role: profile.role || 'leader'
          });
        }
      }
    }
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
