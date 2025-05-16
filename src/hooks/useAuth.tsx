
import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "leader" | "checker" | "owner" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo purposes
const mockUsers: User[] = [
  {
    id: "1",
    name: "Leader User",
    email: "leader@example.com",
    role: "leader",
  },
  {
    id: "2",
    name: "Checker User",
    email: "checker@example.com",
    role: "checker",
  },
  {
    id: "3",
    name: "Owner User",
    email: "owner@example.com",
    role: "owner",
  },
  {
    id: "4",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("sai-balaji-user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const matchedUser = mockUsers.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );

      if (matchedUser && password === "password") {
        setUser(matchedUser);
        localStorage.setItem("sai-balaji-user", JSON.stringify(matchedUser));
      } else {
        throw new Error("Invalid email or password");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("sai-balaji-user");
    // Note: Navigation is now handled in the Sidebar component 
    // for better separation of concerns
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
