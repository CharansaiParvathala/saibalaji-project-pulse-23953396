
import { User } from "@/types";
import { generateId } from "./utils";
import { saveToStorage } from "./utils";
import { STORAGE_KEYS } from "./constants";
import { getUsers } from "./entities/users";

export function initializeDefaultUsers(): void {
  // Check if default users already exist
  const existingUsers = getUsers();
  
  if (existingUsers.length === 0) {
    // Create default users
    const defaultUsers: User[] = [
      {
        id: generateId(),
        name: "Admin User",
        email: "admin@saibalajiconst.com",
        role: "admin",
        created_at: new Date().toISOString()
      },
      {
        id: generateId(),
        name: "Owner User",
        email: "owner@saibalajiconst.com",
        role: "owner",
        created_at: new Date().toISOString()
      },
      {
        id: generateId(),
        name: "Checker User",
        email: "checker@saibalajiconst.com",
        role: "checker",
        created_at: new Date().toISOString()
      }
    ];
    
    // Save the default users to storage
    saveToStorage<User>(STORAGE_KEYS.USERS, defaultUsers);
    
    console.log("Default users have been created:", defaultUsers);
  } else {
    console.log("Users already exist in storage");
  }
}
