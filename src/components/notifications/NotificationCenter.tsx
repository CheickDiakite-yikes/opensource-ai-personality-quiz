
import React, { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Bell, Check, Clock } from "lucide-react";
import { MotivationalNotification } from "@/utils/types";
import { toast } from "sonner";
import { format } from "date-fns";

const NotificationCenter: React.FC = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notifications, setNotifications] = useState<MotivationalNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Load notifications from localStorage on component mount
  useEffect(() => {
    try {
      // Load notification settings
      const savedEnabled = localStorage.getItem('notificationsEnabled');
      if (savedEnabled) {
        setNotificationsEnabled(savedEnabled === 'true');
      }
      
      // Load notifications
      const savedNotifications = localStorage.getItem('notifications');
      if (savedNotifications) {
        const parsedNotifications = JSON.parse(savedNotifications);
        setNotifications(parsedNotifications);
        
        // Count unread notifications
        const unread = parsedNotifications.filter(
          (n: MotivationalNotification) => !n.read
        ).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  }, []);
  
  // Mock the creation of new notifications
  useEffect(() => {
    if (!notificationsEnabled) return;
    
    // This simulates receiving a new notification every day
    // In a real app, this would come from a push notification service
    const mockSuggestions = [
      {
        message: "Start your day with mindfulness",
        suggestion: "Take 5 minutes to meditate and set an intention for the day.",
        relatedTraits: ["Mindfulness", "Self-awareness"]
      },
      {
        message: "Embrace your analytical strengths",
        suggestion: "Tackle a complex problem today by breaking it down into smaller parts.",
        relatedTraits: ["Analytical Thinking", "Problem-solving"]
      },
      {
        message: "Nurture your creativity",
        suggestion: "Spend 15 minutes on a creative activity without judgment.",
        relatedTraits: ["Creativity", "Innovation"]
      },
      {
        message: "Build emotional resilience",
        suggestion: "Acknowledge a difficult emotion today without trying to change it.",
        relatedTraits: ["Emotional Intelligence", "Resilience"]
      },
      {
        message: "Exercise your curiosity",
        suggestion: "Learn something new that's outside your usual interests.",
        relatedTraits: ["Curiosity", "Growth Mindset"]
      }
    ];
    
    // For demo purposes, we'll add a notification when toggled on
    if (notificationsEnabled) {
      const randomIndex = Math.floor(Math.random() * mockSuggestions.length);
      const suggestion = mockSuggestions[randomIndex];
      
      const newNotification: MotivationalNotification = {
        id: `notification-${Date.now()}`,
        message: suggestion.message,
        suggestion: suggestion.suggestion,
        relatedTraits: suggestion.relatedTraits,
        createdAt: new Date(),
        type: 'insight', // Adding required type field
        date: new Date(), // Adding required date field
        read: false,
        userId: 'current-user', // In a real app, this would be the actual user ID
      };
      
      const updatedNotifications = [newNotification, ...notifications];
      setNotifications(updatedNotifications);
      setUnreadCount(unreadCount + 1);
      
      // Save to localStorage
      localStorage.setItem('notifications', JSON.stringify(updatedNotifications.slice(0, 20))); // Keep only the last 20 notifications
      
      // Show toast for the new notification
      toast.info(suggestion.message, {
        description: suggestion.suggestion,
        duration: 5000,
      });
    }
  }, [notificationsEnabled]);
  
  const handleNotificationToggle = (enabled: boolean) => {
    setNotificationsEnabled(enabled);
    localStorage.setItem('notificationsEnabled', enabled.toString());
    
    if (enabled) {
      toast.success("Daily motivational notifications enabled!");
    } else {
      toast.info("Notifications disabled");
    }
  };
  
  const markAsRead = (notificationId: string) => {
    const updatedNotifications = notifications.map(notification => {
      if (notification.id === notificationId) {
        return { ...notification, read: true };
      }
      return notification;
    });
    
    setNotifications(updatedNotifications);
    
    // Update unread count
    const unread = updatedNotifications.filter(n => !n.read).length;
    setUnreadCount(unread);
    
    // Save to localStorage
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };
  
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));
    
    setNotifications(updatedNotifications);
    setUnreadCount(0);
    
    // Save to localStorage
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    
    toast.success("All notifications marked as read");
  };
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 bg-primary text-primary-foreground text-xs flex items-center justify-center rounded-full">
              {unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="pb-4 border-b">
          <SheetTitle className="flex justify-between items-center">
            Notifications
            <div className="flex items-center text-sm gap-2">
              <span className="text-muted-foreground">Daily Motivation</span>
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={handleNotificationToggle}
              />
            </div>
          </SheetTitle>
        </SheetHeader>
        
        <div className="mt-4">
          {notifications.length > 0 ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-muted-foreground">
                  Receive daily inspiration & growth tips
                </p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                >
                  Mark all read
                </Button>
              </div>
              
              <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
                {notifications.map(notification => (
                  <div 
                    key={notification.id}
                    className={`p-3 rounded-lg border ${notification.read ? 'bg-card/50' : 'bg-card border-primary/20'}`}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className={`font-medium ${notification.read ? 'text-muted-foreground' : ''}`}>
                        {notification.message}
                      </h4>
                      {!notification.read && (
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <p className="text-sm mt-1">{notification.suggestion}</p>
                    <div className="flex items-center text-xs text-muted-foreground mt-2 gap-2">
                      <Clock className="h-3 w-3" />
                      {format(new Date(notification.createdAt), 'PPP')}
                    </div>
                    
                    {notification.relatedTraits && notification.relatedTraits.length > 0 && (
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {notification.relatedTraits.map(trait => (
                          <span 
                            key={trait} 
                            className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full"
                          >
                            {trait}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-10">
              <Bell className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium">No notifications yet</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Enable daily notifications to receive personalized motivation
              </p>
              <div className="mt-4">
                <Switch
                  checked={notificationsEnabled}
                  onCheckedChange={handleNotificationToggle}
                />
                <span className="ml-2">Enable notifications</span>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationCenter;
