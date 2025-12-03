"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, Lightbulb, ChevronRight } from "lucide-react"
import { generateInsights, generateGrowthRecommendations } from "@/lib/insights-engine"

interface InsightsPanelProps {
  orders: any[]
  customers: any[]
  products: any[]
}

export function InsightsPanel({ orders, customers, products }: InsightsPanelProps) {
  const insights = generateInsights(orders, customers, products)
  const recommendations = generateGrowthRecommendations(orders, customers)

  const priorityColors = {
    high: "bg-red-50 border-red-200",
    medium: "bg-yellow-50 border-yellow-200",
    low: "bg-blue-50 border-blue-200",
  }

  const priorityBadgeColors = {
    high: "text-red-700",
    medium: "text-yellow-700",
    low: "text-blue-700",
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Insights */}
      <div className="lg:col-span-2 space-y-4">
        <h3 className="font-semibold text-lg">AI Insights</h3>

        {insights.map((insight) => (
          <Card key={insight.id} className={`p-4 border ${priorityColors[insight.priority]}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm">{insight.title}</h4>
                  <Badge
                    variant="outline"
                    className={priorityBadgeColors[insight.priority]}
                    className={priorityBadgeColors[insight.priority]}
                  >
                    {insight.priority}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>

                {insight.action && (
                  <Button size="sm" variant="outline" className="w-full bg-transparent">
                    {insight.action}
                    <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                )}
              </div>

              {insight.metric && (
                <div className="text-right">
                  <p className="text-2xl font-bold">{insight.metric}</p>
                  {insight.trend && (
                    <div className="flex items-center gap-1 text-xs mt-1">
                      <TrendingUp
                        className={`w-3 h-3 ${insight.trend === "up" ? "text-green-600" : "text-gray-600"}`}
                      />
                      <span className={insight.trend === "up" ? "text-green-600" : "text-gray-600"}>
                        {insight.trend}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Recommendations */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Growth Tips</h3>

        <Card className="p-4 space-y-3">
          {recommendations.map((rec, idx) => (
            <div key={idx} className="flex gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">{rec}</p>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}
