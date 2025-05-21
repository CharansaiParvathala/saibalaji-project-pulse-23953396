
// Re-export from new storage structure to maintain backward compatibility
// This file should eventually be deprecated once all code is migrated to the new structure

import { 
  generateId, getFromStorage, saveToStorage,
  getUsers, saveUser, updateUser,
  getProjects, getProject, saveProject, updateProject,
  getVehicles, getVehicle, saveVehicle, updateVehicle,
  getDrivers, getDriver, saveDriver, updateDriver,
  getProgressEntries, getProgressEntry, saveProgressEntry, updateProgressEntry,
  getPaymentRequests, getPaymentRequestsByStatus, savePaymentRequest, updatePaymentRequest,
  getNotifications, getNotificationsByUser, saveNotification, markNotificationAsRead
} from './storage/index';

// Local Storage keys
export const STORAGE_KEYS = {
  USERS: "sai-balaji-users",
  PROJECTS: "sai-balaji-projects",
  VEHICLES: "sai-balaji-vehicles",
  DRIVERS: "sai-balaji-drivers",
  PROGRESS_ENTRIES: "sai-balaji-progress-entries",
  PAYMENT_REQUESTS: "sai-balaji-payment-requests",
  NOTIFICATIONS: "sai-balaji-notifications",
};

export {
  // Utils
  generateId,
  getFromStorage,
  saveToStorage,
  
  // User operations
  getUsers,
  saveUser,
  updateUser,
  
  // Project operations
  getProjects,
  getProject,
  saveProject,
  updateProject,
  
  // Vehicle operations
  getVehicles,
  getVehicle,
  saveVehicle,
  updateVehicle,
  
  // Driver operations
  getDrivers,
  getDriver,
  saveDriver,
  updateDriver,
  
  // Progress operations
  getProgressEntries,
  getProgressEntry,
  saveProgressEntry,
  updateProgressEntry,
  
  // Payment operations
  getPaymentRequests,
  getPaymentRequestsByStatus,
  savePaymentRequest,
  updatePaymentRequest,
  
  // Notification operations
  getNotifications,
  getNotificationsByUser,
  saveNotification,
  markNotificationAsRead
};
