
// Re-export from new storage structure to maintain backward compatibility
// This file should eventually be deprecated once all code is migrated to the new structure

import { STORAGE_KEYS } from './storage/constants';
import * as StorageModule from './storage/index';

// Re-export everything from the storage module
export const {
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
} = StorageModule;

// Also export the storage keys
export { STORAGE_KEYS };
