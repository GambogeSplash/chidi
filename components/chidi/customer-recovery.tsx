"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageCircle, TrendingUp } from "lucide-react"

interface CustomerRecoveryProps {
  inactiveCustomers: any[]
  onSendMessage: (customer: any) => void
}

export function CustomerRecovery({ inactiveCustomers, onSendMessage }: CustomerRecoveryProps) {
  if (inactiveCustomers.length === 0) {
    return null
  }

  return (
    <Card className="p-4 bg-yellow-50 border-yellow-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-yellow-600" />
          <h3 className="font-semibold text-yellow-900">Customer Recovery Opportunity</h3>
        </div>
        <Badge variant="outline" className="text-yellow-700">
          {inactiveCustomers.length} inactive
        </Badge>
      </div>

      <div className="space-y-2">
        {inactiveCustomers.slice(0, 3).map((customer) => (
          <div
            key={customer.id}
            className="flex items-center justify-between p-2 bg-white rounded border border-yellow-100"
          >
            <div>
              <p className="font-medium text-sm">{customer.name}</p>
              <p className="text-xs text-muted-foreground">Last order: 45 days ago</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onSendMessage(customer)}
              className="text-yellow-700 border-yellow-200 hover:bg-yellow-50"
            >
              <MessageCircle className="w-3 h-3 mr-1" />
              Re-engage
            </Button>
          </div>
        ))}
      </div>
    </Card>
  )
}
