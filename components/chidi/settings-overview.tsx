"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Settings, Lock, Bell, Zap, Database, Shield } from "lucide-react"

interface SettingsOverviewProps {
  businessConfig: any
  onManageIntegrations: () => void
  onManageHours: () => void
  onManageSecurity: () => void
}

export function SettingsOverview({
  businessConfig,
  onManageIntegrations,
  onManageHours,
  onManageSecurity,
}: SettingsOverviewProps) {
  const settingsList = [
    {
      icon: Zap,
      title: "Integrations",
      description: "Connect WhatsApp, Instagram, Email & SMS",
      status: businessConfig?.integrations?.whatsapp?.enabled ? "Active" : "Inactive",
      action: onManageIntegrations,
    },
    {
      icon: Settings,
      title: "Business Hours",
      description: "Set your operating hours & auto-responses",
      status: "Configured",
      action: onManageHours,
    },
    {
      icon: Bell,
      title: "Notifications",
      description: "Customize alerts & notification preferences",
      status: "Enabled",
      action: () => {},
    },
    {
      icon: Shield,
      title: "Security",
      description: "Two-factor authentication & data encryption",
      status: businessConfig?.security?.twoFactorEnabled ? "Enabled" : "Disabled",
      action: onManageSecurity,
    },
    {
      icon: Database,
      title: "Data & Backup",
      description: "Export data, manage backups & storage",
      status: "Active",
      action: () => {},
    },
    {
      icon: Lock,
      title: "Privacy & Policies",
      description: "Delivery, return & refund policies",
      status: "Updated",
      action: () => {},
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {settingsList.map((setting, idx) => {
        const Icon = setting.icon
        const statusColor =
          setting.status === "Active" || setting.status === "Enabled" ? "text-green-600" : "text-gray-600"

        return (
          <Card key={idx} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <Icon className="w-5 h-5 text-primary" />
              <Badge variant="outline" className={statusColor}>
                {setting.status}
              </Badge>
            </div>

            <h4 className="font-semibold text-sm mb-1">{setting.title}</h4>
            <p className="text-xs text-muted-foreground mb-3">{setting.description}</p>

            <Button size="sm" variant="outline" onClick={setting.action} className="w-full bg-transparent">
              Manage
            </Button>
          </Card>
        )
      })}
    </div>
  )
}
