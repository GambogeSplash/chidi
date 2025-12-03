"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Bell, Check, X, AlertTriangle, MessageSquare, ShoppingCart, Settings } from "lucide-react"

interface Notification {
  id: string
  type: "stock" | "message" | "sale" | "system" | "activity"
  title: string
  message: string
  timestamp: string
  read: boolean
  priority: "high" | "medium" | "low"
}

interface NotificationsPageProps {
  notifications: Notification[]
  onBack: () => void
  onMarkAsRead: (id: string) => void
  onMarkAllAsRead: () => void
  onDismiss: (id: string) => void
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "stock":
      return <AlertTriangle className="w-4 h-4" />
    case "message":
      return <MessageSquare className="w-4 h-4" />
    case "sale":
      return <ShoppingCart className="w-4 h-4" />
    case "system":
      return <Settings className="w-4 h-4" />
    case "activity":
      return <Bell className="w-4 h-4" />
    default:
      return <Bell className="w-4 h-4" />
  }
}

const getNotificationColor = (type: string, priority: string) => {
  if (priority === "high") return "text-red-500"
  if (priority === "medium") return "text-yellow-500"
  return "text-blue-500"
}

export function NotificationsPage({
  notifications,
  onBack,
  onMarkAsRead,
  onMarkAllAsRead,
  onDismiss,
}: NotificationsPageProps) {
  const unreadCount = notifications.filter((n) => !n.read).length
  const groupedNotifications = notifications.reduce(
    (acc, notification) => {
      const type = notification.type
      if (!acc[type]) acc[type] = []
      acc[type].push(notification)
      return acc
    },
    {} as Record<string, Notification[]>,
  )

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3 max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold">Notifications</h1>
              {unreadCount > 0 && <p className="text-xs text-muted-foreground">{unreadCount} unread</p>}
            </div>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={onMarkAllAsRead}>
              <Check className="w-3 h-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>
      </header>

      <main className="px-4 py-4 max-w-md mx-auto">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No notifications</h3>
            <p className="text-muted-foreground">You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedNotifications).map(([type, typeNotifications]) => (
              <div key={type}>
                <h2 className="text-sm font-medium text-muted-foreground mb-3 capitalize">
                  {type === "activity" ? "Business Activity" : `${type} Notifications`}
                </h2>
                <div className="space-y-2">
                  {typeNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg border transition-colors ${
                        notification.read ? "bg-muted/30" : "bg-card"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={getNotificationColor(notification.type, notification.priority)}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <h3 className="text-sm font-medium">{notification.title}</h3>
                              <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs text-muted-foreground">{notification.timestamp}</span>
                                <Badge
                                  variant={notification.priority === "high" ? "destructive" : "secondary"}
                                  className="text-xs"
                                >
                                  {notification.priority}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => onMarkAsRead(notification.id)}
                                >
                                  <Check className="w-3 h-3" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => onDismiss(notification.id)}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
