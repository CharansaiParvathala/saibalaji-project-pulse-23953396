
import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { getNotificationsByUser, markNotificationAsRead } from "@/lib/storage";
import { Notification } from "@/types";
import { format } from "date-fns";

export function NotificationCenter() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Load notifications for the user
    const userNotifications = getNotificationsByUser(user.id);
    setNotifications(userNotifications);
    
    // Count unread notifications
    const unread = userNotifications.filter(n => !n.isRead).length;
    setUnreadCount(unread);
    
    // Set up interval to check for new notifications every 30 seconds
    const intervalId = setInterval(() => {
      const freshNotifications = getNotificationsByUser(user.id);
      setNotifications(freshNotifications);
      setUnreadCount(freshNotifications.filter(n => !n.isRead).length);
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, [user]);

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    if (!notification.isRead) {
      markNotificationAsRead(notification.id);
      
      // Update local state
      setNotifications(notifications.map(n => 
        n.id === notification.id ? { ...n, isRead: true } : n
      ));
      setUnreadCount(Math.max(0, unreadCount - 1));
    }
    
    // Handle navigation based on notification type
    // This could be expanded to navigate to specific pages
  };

  const markAllAsRead = () => {
    // Mark all as read
    notifications.forEach(notification => {
      if (!notification.isRead) {
        markNotificationAsRead(notification.id);
      }
    });
    
    // Update local state
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  if (!user) return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 h-4 w-4 text-[10px] font-medium flex items-center justify-center rounded-full bg-primary text-primary-foreground">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs"
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No notifications
            </div>
          ) : (
            <div>
              {notifications.map((notification) => (
                <div 
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={cn(
                    "p-4 border-b last:border-b-0 cursor-pointer",
                    !notification.isRead ? "bg-muted/50" : "",
                    "hover:bg-muted/30"
                  )}
                >
                  <div className="flex justify-between items-start">
                    <h4 className={cn(
                      "text-sm font-medium",
                      !notification.isRead ? "font-semibold" : ""
                    )}>
                      {notification.title}
                    </h4>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(notification.createdAt), "MMM dd")}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {notification.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
