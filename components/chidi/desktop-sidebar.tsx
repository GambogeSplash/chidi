"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Home, Package, ShoppingBag, Settings, Zap, Bell, LogOut, ChevronLeft, ChevronRight } from "lucide-react"
import type { User } from "@/lib/auth"

interface DesktopSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  user: User | null
  onProfileClick: () => void
  onNotificationClick: () => void
  onSignOut: () => void
  notificationCount: number
  collapsed?: boolean
  onToggleCollapse?: () => void
}

export function DesktopSidebar({
  activeTab,
  onTabChange,
  user,
  onProfileClick,
  onNotificationClick,
  onSignOut,
  notificationCount,
  collapsed = false,
  onToggleCollapse,
}: DesktopSidebarProps) {
  const navItems = [
    { id: "home", label: "Chat", icon: Home, description: "AI Assistant" },
    { id: "catalog", label: "Catalog", icon: Package, description: "Products" },
    { id: "orders", label: "Orders", icon: ShoppingBag, description: "View all" },
    { id: "settings", label: "Settings", icon: Settings, description: "Configure" },
  ]

  return (
    <aside
      className={`flex flex-col border-r border-border bg-card h-full transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      } fixed lg:relative z-40 lg:z-0`}
    >
      <div
        className={`p-4 sm:p-6 flex items-center gap-3 border-b border-border ${collapsed ? "justify-center p-3" : ""}`}
      >
        {!collapsed && (
          <>
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold tracking-tight truncate">CHIDI</h1>
              <p className="text-xs text-muted-foreground truncate">AI Business Assistant</p>
            </div>
          </>
        )}
        {collapsed && (
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Zap className="w-6 h-6 text-primary-foreground" />
          </div>
        )}
      </div>

      {/* Toggle Button */}
      {onToggleCollapse && (
        <div className="px-2 py-2 border-b border-border">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-center h-8"
            onClick={onToggleCollapse}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id

          return (
            <Button
              key={item.id}
              variant={isActive ? "secondary" : "ghost"}
              className={`w-full h-12 ${
                collapsed ? "justify-center px-0" : "justify-start gap-3 px-3"
              } ${isActive ? "bg-primary/10 text-primary font-medium" : ""}`}
              onClick={() => onTabChange(item.id)}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && (
                <div className="flex-1 text-left min-w-0">
                  <div className="text-sm font-medium truncate">{item.label}</div>
                  <div className="text-xs text-muted-foreground truncate">{item.description}</div>
                </div>
              )}
            </Button>
          )
        })}
      </nav>

      <Separator />

      {/* Footer - User Profile */}
      <div className="p-2 space-y-1 border-t border-border">
        <Button
          variant="ghost"
          className={`w-full h-12 relative ${collapsed ? "justify-center px-0" : "justify-start gap-3 px-3"}`}
          onClick={onNotificationClick}
          title={collapsed ? "Notifications" : undefined}
        >
          <Bell className="w-5 h-5 shrink-0" />
          {!collapsed && <span className="flex-1 text-left text-sm">Notifications</span>}
          {notificationCount > 0 && (
            <div
              className={`${
                collapsed ? "absolute -top-1 -right-1" : ""
              } w-5 h-5 bg-red-500 rounded-full flex items-center justify-center`}
            >
              <span className="text-xs text-white font-semibold">
                {notificationCount > 9 ? "9+" : notificationCount}
              </span>
            </div>
          )}
        </Button>

        <Button
          variant="ghost"
          className={`w-full h-12 ${collapsed ? "justify-center px-0" : "justify-start gap-3 px-2"}`}
          onClick={onProfileClick}
          title={collapsed ? user?.name || "Profile" : undefined}
        >
          <Avatar className="w-8 h-8 shrink-0">
            <AvatarFallback className="text-sm bg-primary/10">
              {user?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 text-left overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.name || "User"}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.businessName || "Business"}</p>
            </div>
          )}
        </Button>

        <Button
          variant="ghost"
          className={`w-full h-12 text-muted-foreground hover:text-destructive hover:bg-destructive/10 ${
            collapsed ? "justify-center px-0" : "justify-start gap-3 px-3"
          }`}
          onClick={onSignOut}
          title={collapsed ? "Sign Out" : undefined}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span className="text-sm">Sign Out</span>}
        </Button>
      </div>
    </aside>
  )
}
