
// Main storage module that re-exports all storage functions
import { generateId, getFromStorage, saveToStorage } from './utils';
import {
  getUsers, saveUser, updateUser,
  getProjects, getProject, saveProject, updateProject,
  getVehicles, getVehicle, saveVehicle, updateVehicle,
  getDrivers, getDriver, saveDriver, updateDriver,
  getProgressEntries, getProgressEntry, saveProgressEntry, updateProgressEntry,
  getPaymentRequests, getPaymentRequestsByStatus, savePaymentRequest, updatePaymentRequest,
  getNotifications, getNotificationsByUser, saveNotification, markNotificationAsRead
} from './entities';

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
