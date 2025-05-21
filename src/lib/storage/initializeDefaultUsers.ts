
import { supabase } from '@/integrations/supabase/client';
import { saveToStorage } from '@/lib/storage';

export interface DefaultUser {
  email: string;
  password: string;
  name: string;
  role: "admin" | "owner" | "checker" | "leader";
}

export const defaultUsers: DefaultUser[] = [
  {
    email: "admin@example.com",
    password: "password",
    name: "Admin User",
    role: "admin"
  },
  {
    email: "owner@example.com",
    password: "password",
    name: "Owner User",
    role: "owner"
  },
  {
    email: "checker@example.com",
    password: "password",
    name: "Checker User",
    role: "checker"
  }
];

export async function initializeDefaultUsers() {
  try {
    console.log("Checking if default users exist...");
    
    for (const user of defaultUsers) {
      // Check if user already exists
      const { data: existingUsers, error: searchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', user.email)
        .single();
      
      if (searchError && searchError.code !== 'PGRST116') {
        console.error(`Error checking user ${user.email}:`, searchError);
        continue;
      }
      
      if (!existingUsers) {
        console.log(`Creating default user: ${user.email} (${user.role})`);
        
        // Create user in Supabase Auth
        const { data, error } = await supabase.auth.signUp({
          email: user.email,
          password: user.password,
          options: {
            data: {
              full_name: user.name,
              role: user.role
            }
          }
        });
        
        if (error) {
          console.error(`Error creating user ${user.email}:`, error);
        } else {
          console.log(`Successfully created user: ${user.email}`);
          
          // Store user in local storage (for demo persistence)
          const userObj = {
            id: data.user?.id || `local-${user.role}-${Date.now()}`,
            email: user.email,
            name: user.name,
            role: user.role,
            created_at: new Date().toISOString()
          };
          
          const existingUsers = JSON.parse(localStorage.getItem('sai-balaji-users') || '[]');
          const updatedUsers = [...existingUsers, userObj];
          saveToStorage('sai-balaji-users', updatedUsers);
        }
      } else {
        console.log(`User ${user.email} already exists`);
      }
    }
    
    console.log("Default user initialization complete");
  } catch (error) {
    console.error("Error initializing default users:", error);
  }
}
