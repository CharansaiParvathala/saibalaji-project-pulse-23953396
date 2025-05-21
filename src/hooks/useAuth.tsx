
import { useSupabaseAuth } from "./useSupabaseAuth";
import { User, UserRole } from "@/types";

// This is a compatibility layer to allow existing components to still use useAuth
// while we transition to useSupabaseAuth everywhere
export function useAuth() {
  return useSupabaseAuth();
}

// Re-export types and interfaces for backward compatibility
export type { User, UserRole };

// No need for the AuthProvider since we're using SupabaseAuthProvider
// This file now just serves as a bridge to useSupabaseAuth
