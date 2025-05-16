
import { Notification } from "@/types";
import { STORAGE_KEYS } from "../constants";
import { getFromStorage, saveToStorage } from "../utils";

// Notifications
export function getNotifications(): Notification[] {
  return getFromStorage<Notification>(STORAGE_KEYS.NOTIFICATIONS);
}

export function getNotificationsByUser(userId: string): Notification[] {
  const notifications = getNotifications();
  return notifications.filter(notification => notification.userId === userId);
}

export function saveNotification(notification: Notification): Notification {
  const notifications = getNotifications();
  notifications.push(notification);
  saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);
  return notification;
}

export function markNotificationAsRead(id: string): void {
  const notifications = getNotifications();
  const index = notifications.findIndex((notification) => notification.id === id);
  
  if (index !== -1) {
    notifications[index].isRead = true;
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }
}
