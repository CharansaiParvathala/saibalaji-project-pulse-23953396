
import { useState, useEffect, createContext, useContext } from 'react';
import { User, Role } from '@/types';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { getUsers, saveUser, updateUser } from '@/lib/storage';
import { generateId } from '@/lib/storage/utils';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isLoading: boolean; // Added for compatibility
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, fullName: string, role: Role) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isLoading: true,
  isAuthenticated: false,
  signIn: async () => ({ error: null }),
  signOut: async () => {},
  refreshUser: async () => {},
  login: async () => ({ error: null }),
  logout: async () => {},
  signup: async () => ({ error: null }),
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserProfile = () => {
      const storedUser = localStorage.getItem('currentUser');
      
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('currentUser');
        }
      }
      
      setLoading(false);
    };

    getUserProfile();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const users = getUsers();
      const foundUser = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
      
      // In a real app, you would hash passwords. This is a simplified version.
      if (foundUser && (password === '123456' || password === 'password')) {
        localStorage.setItem('currentUser', JSON.stringify(foundUser));
        setUser(foundUser);
        return { error: null };
      }
      
      return { 
        error: {
          message: 'Invalid login credentials'
        }
      };
    } catch (error) {
      console.error('Login error:', error);
      return { error };
    }
  };

  const signup = async (email: string, password: string, fullName: string, role: Role) => {
    try {
      const users = getUsers();
      const existingUser = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
      
      if (existingUser) {
        return { 
          error: {
            message: 'User with this email already exists'
          }
        };
      }
      
      const newUser: User = {
        id: generateId(),
        name: fullName,
        email: email,
        role: role,
        created_at: new Date().toISOString()
      };
      
      saveUser(newUser);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      setUser(newUser);
      
      toast({
        title: "Sign up successful",
        description: "Your account has been created successfully."
      });
      
      return { error: null };
    } catch (error) {
      console.error('Signup error:', error);
      return { error };
    }
  };

  const handleSignOut = async () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    navigate('/login');
  };

  const refreshUser = async () => {
    const currentUserId = user?.id;
    if (currentUserId) {
      const users = getUsers();
      const refreshedUser = users.find(u => u.id === currentUserId);
      
      if (refreshedUser) {
        localStorage.setItem('currentUser', JSON.stringify(refreshedUser));
        setUser(refreshedUser);
      }
    }
  };

  const value = {
    user,
    loading,
    isLoading: loading,
    isAuthenticated: !!user,
    signIn: login,
    signOut: handleSignOut,
    refreshUser,
    login,
    logout: handleSignOut,
    signup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Export the hook
export const useAuth = () => useContext(AuthContext);

export type { User };
export type UserRole = Role;
