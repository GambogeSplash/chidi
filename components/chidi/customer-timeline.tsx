"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, ShoppingBag } from "lucide-react"
import { buildCustomerTimeline } from "@/lib/customer-service"

interface CustomerTimelineProps {
  customer: any
  orders: any[]
}

export function CustomerTimeline({ customer, orders }: CustomerTimelineProps) {
  const timeline = buildCustomerTimeline(customer, orders)

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Customer Timeline</h3>

      <div className="relative space-y-4">
        {timeline.map((event, idx) => {
          const Icon = event.type === "contact" ? MessageCircle : ShoppingBag
          const isLast = idx === timeline.length - 1

          return (
            <div key={idx} className="flex gap-4">
              {/* Timeline line */}
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Icon className="w-4 h-4 text-primary-foreground" />
                </div>
                {!isLast && <div className="w-0.5 h-12 bg-border mt-2" />}
              </div>

              {/* Event content */}
              <div className="pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium">{event.event}</p>
                  <Badge variant="outline" className="text-xs">
                    {new Date(event.date).toLocaleDateString()}
                  </Badge>
                </div>
                {event.amount && (
                  <p className="text-sm text-muted-foreground">Amount: ₦{event.amount.toLocaleString()}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
