
import { User } from "@/types";
import { STORAGE_KEYS } from "../constants";
import { getFromStorage, saveToStorage } from "../utils";

// Users
export function getUsers(): User[] {
  return getFromStorage<User>(STORAGE_KEYS.USERS);
}

export function saveUser(user: User): User {
  const users = getUsers();
  users.push(user);
  saveToStorage(STORAGE_KEYS.USERS, users);
  return user;
}

export function updateUser(updatedUser: User): User {
  const users = getUsers();
  const index = users.findIndex((user) => user.id === updatedUser.id);
  
  if (index !== -1) {
    users[index] = updatedUser;
    saveToStorage(STORAGE_KEYS.USERS, users);
  }
  
  return updatedUser;
}
