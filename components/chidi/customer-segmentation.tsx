"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, TrendingUp, AlertCircle, Star } from "lucide-react"
import { segmentCustomer } from "@/lib/customer-service"

interface CustomerSegmentationProps {
  customers: any[]
  onSegmentClick: (segment: string) => void
}

export function CustomerSegmentation({ customers, onSegmentClick }: CustomerSegmentationProps) {
  const segments = {
    vip: customers.filter((c) => segmentCustomer(c) === "vip"),
    regular: customers.filter((c) => segmentCustomer(c) === "regular"),
    new: customers.filter((c) => segmentCustomer(c) === "new"),
    dormant: customers.filter((c) => segmentCustomer(c) === "dormant"),
  }

  const segmentConfig = [
    {
      key: "vip",
      label: "VIP Customers",
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      description: "High-value repeat customers",
    },
    {
      key: "regular",
      label: "Regular Customers",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      description: "Active engaged customers",
    },
    {
      key: "new",
      label: "New Customers",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      description: "Recent first-time buyers",
    },
    {
      key: "dormant",
      label: "Dormant",
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      description: "Need re-engagement",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {segmentConfig.map((segment) => {
        const Icon = segment.icon
        const count = segments[segment.key as keyof typeof segments].length

        return (
          <Card
            key={segment.key}
            className={`p-4 ${segment.bgColor} border ${segment.borderColor} cursor-pointer hover:shadow-md transition-shadow`}
          >
            <div className="flex items-start justify-between mb-3">
              <Icon className={`w-6 h-6 ${segment.color}`} />
              <Badge variant="outline" className={segment.color}>
                {count}
              </Badge>
            </div>

            <h3 className="font-semibold text-sm mb-1">{segment.label}</h3>
            <p className="text-xs text-muted-foreground mb-3">{segment.description}</p>

            <Button size="sm" variant="outline" onClick={() => onSegmentClick(segment.key)} className="w-full">
              View Details
            </Button>
          </Card>
        )
      })}
    </div>
  )
}
