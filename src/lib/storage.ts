
import { User, Project, Vehicle, Driver, ProgressEntry, PaymentRequest } from "@/types";

// Local Storage keys
const STORAGE_KEYS = {
  USERS: "sai-balaji-users",
  PROJECTS: "sai-balaji-projects",
  VEHICLES: "sai-balaji-vehicles",
  DRIVERS: "sai-balaji-drivers",
  PROGRESS_ENTRIES: "sai-balaji-progress-entries",
  PAYMENT_REQUESTS: "sai-balaji-payment-requests",
};

// Helper to generate IDs
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Generic storage functions
function getFromStorage<T>(key: string): T[] {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

function saveToStorage<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

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

// Projects
export function getProjects(): Project[] {
  return getFromStorage<Project>(STORAGE_KEYS.PROJECTS);
}

export function getProject(id: string): Project | undefined {
  const projects = getProjects();
  return projects.find((project) => project.id === id);
}

export function saveProject(project: Project): Project {
  const projects = getProjects();
  projects.push(project);
  saveToStorage(STORAGE_KEYS.PROJECTS, projects);
  return project;
}

export function updateProject(updatedProject: Project): Project {
  const projects = getProjects();
  const index = projects.findIndex((project) => project.id === updatedProject.id);
  
  if (index !== -1) {
    projects[index] = updatedProject;
    saveToStorage(STORAGE_KEYS.PROJECTS, projects);
  }
  
  return updatedProject;
}

// Vehicles
export function getVehicles(): Vehicle[] {
  return getFromStorage<Vehicle>(STORAGE_KEYS.VEHICLES);
}

export function getVehicle(id: string): Vehicle | undefined {
  const vehicles = getVehicles();
  return vehicles.find((vehicle) => vehicle.id === id);
}

export function saveVehicle(vehicle: Vehicle): Vehicle {
  const vehicles = getVehicles();
  vehicles.push(vehicle);
  saveToStorage(STORAGE_KEYS.VEHICLES, vehicles);
  return vehicle;
}

// Drivers
export function getDrivers(): Driver[] {
  return getFromStorage<Driver>(STORAGE_KEYS.DRIVERS);
}

export function getDriver(id: string): Driver | undefined {
  const drivers = getDrivers();
  return drivers.find((driver) => driver.id === id);
}

export function saveDriver(driver: Driver): Driver {
  const drivers = getDrivers();
  drivers.push(driver);
  saveToStorage(STORAGE_KEYS.DRIVERS, drivers);
  return driver;
}

// Progress Entries
export function getProgressEntries(): ProgressEntry[] {
  return getFromStorage<ProgressEntry>(STORAGE_KEYS.PROGRESS_ENTRIES);
}

export function getProgressEntry(id: string): ProgressEntry | undefined {
  const entries = getProgressEntries();
  return entries.find((entry) => entry.id === id);
}

export function saveProgressEntry(entry: ProgressEntry): ProgressEntry {
  const entries = getProgressEntries();
  entries.push(entry);
  saveToStorage(STORAGE_KEYS.PROGRESS_ENTRIES, entries);
  return entry;
}

export function updateProgressEntry(updatedEntry: ProgressEntry): ProgressEntry {
  const entries = getProgressEntries();
  const index = entries.findIndex((entry) => entry.id === updatedEntry.id);
  
  if (index !== -1) {
    entries[index] = updatedEntry;
    saveToStorage(STORAGE_KEYS.PROGRESS_ENTRIES, entries);
  }
  
  return updatedEntry;
}

// Payment Requests
export function getPaymentRequests(): PaymentRequest[] {
  return getFromStorage<PaymentRequest>(STORAGE_KEYS.PAYMENT_REQUESTS);
}

export function getPaymentRequestsByStatus(status: PaymentRequest["status"]): PaymentRequest[] {
  const requests = getPaymentRequests();
  return requests.filter((request) => request.status === status);
}

export function savePaymentRequest(request: PaymentRequest): PaymentRequest {
  const requests = getPaymentRequests();
  requests.push(request);
  saveToStorage(STORAGE_KEYS.PAYMENT_REQUESTS, requests);
  return request;
}

export function updatePaymentRequest(updatedRequest: PaymentRequest): PaymentRequest {
  const requests = getPaymentRequests();
  const index = requests.findIndex((request) => request.id === updatedRequest.id);
  
  if (index !== -1) {
    requests[index] = updatedRequest;
    saveToStorage(STORAGE_KEYS.PAYMENT_REQUESTS, requests);
  }
  
  return updatedRequest;
}
