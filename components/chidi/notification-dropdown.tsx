"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bell, Package, MessageSquare, TrendingUp, AlertTriangle, Check, X, Activity } from "lucide-react"

interface Notification {
  id: string
  type: "stock" | "message" | "sale" | "system" | "activity"
  title: string
  message: string
  timestamp: string
  read: boolean
  priority: "low" | "medium" | "high"
}

interface NotificationDropdownProps {
  notifications: Notification[]
  onMarkAsRead: (id: string) => void
  onMarkAllAsRead: () => void
  onDismiss: (id: string) => void
}

export function NotificationDropdown({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDismiss,
}: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "stock":
        return <Package className="w-4 h-4 text-amber-600" />
      case "message":
        return <MessageSquare className="w-4 h-4 text-blue-600" />
      case "sale":
        return <TrendingUp className="w-4 h-4 text-green-600" />
      case "activity":
        return <Activity className="w-4 h-4 text-purple-600" />
      case "system":
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      default:
        return <Bell className="w-4 h-4" />
    }
  }

  const getPriorityColor = (priority: string, read: boolean) => {
    if (read) return "bg-muted/50"

    switch (priority) {
      case "high":
        return "bg-red-50 border-red-200"
      case "medium":
        return "bg-amber-50 border-amber-200"
      case "low":
        return "bg-blue-50 border-blue-200"
      default:
        return "bg-muted/50"
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return timestamp
  }

  const groupedNotifications = notifications.reduce(
    (groups, notification) => {
      const type = notification.type
      if (!groups[type]) {
        groups[type] = []
      }
      groups[type].push(notification)
      return groups
    },
    {} as Record<string, Notification[]>,
  )

  const typeOrder = ["stock", "message", "sale", "activity", "system"]
  const sortedNotifications = typeOrder.flatMap((type) => groupedNotifications[type] || [])

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 relative">
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500 hover:bg-red-500">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0" align="end">
        <div className="border-b p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={onMarkAllAsRead} className="text-xs">
                Mark all read
              </Button>
            )}
          </div>
          {unreadCount > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        <ScrollArea className="max-h-96">
          {sortedNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {sortedNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`cursor-pointer hover:shadow-sm transition-shadow ${getPriorityColor(
                    notification.priority,
                    notification.read,
                  )}`}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">{getNotificationIcon(notification.type)}</div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${notification.read ? "text-muted-foreground" : ""}`}>
                              {notification.title}
                            </p>
                            <p className={`text-xs mt-1 ${notification.read ? "text-muted-foreground" : ""}`}>
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatTimestamp(notification.timestamp)}
                            </p>
                          </div>

                          <div className="flex gap-1">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onMarkAsRead(notification.id)
                                }}
                              >
                                <Check className="w-3 h-3" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={(e) => {
                                e.stopPropagation()
                                onDismiss(notification.id)
                              }}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>

                        {!notification.read && (
                          <div className="w-2 h-2 bg-primary rounded-full absolute top-3 right-3" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>

        {sortedNotifications.length > 0 && (
          <div className="border-t p-2">
            <Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => setIsOpen(false)}>
              Close Notifications
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
