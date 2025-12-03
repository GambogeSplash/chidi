"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, DollarSign, Package, Users, ShoppingCart, AlertTriangle, Sparkles } from "lucide-react"
import { calculateBusinessMetrics, generateInsights } from "@/lib/analytics"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts"

interface AnalyticsDashboardProps {
  orders: any[]
  customers: any[]
  products: any[]
  onNavigate?: (page: string) => void
}

export function AnalyticsDashboard({ orders, customers, products, onNavigate }: AnalyticsDashboardProps) {
  const metrics = calculateBusinessMetrics(orders, customers, products)
  const insights = generateInsights(metrics, products)

  const orderStatusData = [
    { name: "Pending", value: orders.filter((o) => o.status === "pending").length, color: "#eab308" },
    { name: "Confirmed", value: orders.filter((o) => o.status === "confirmed").length, color: "#3b82f6" },
    { name: "Shipped", value: orders.filter((o) => o.status === "shipped").length, color: "#8b5cf6" },
    { name: "Delivered", value: orders.filter((o) => o.status === "delivered").length, color: "#22c55e" },
    { name: "Cancelled", value: orders.filter((o) => o.status === "cancelled").length, color: "#ef4444" },
  ]

  const topProducts = metrics.topProducts.slice(0, 5)

  // Build simple daily revenue series from orders
  const revenueByDateMap: Record<string, number> = {}
  orders.forEach((o) => {
    try {
      const d = new Date(o.orderDate || o.createdAt)
      const key = d.toLocaleDateString()
      const amt = Number.parseFloat((o.totalAmount || o.total || 0).toString().replace(/[^0-9.-]/g, "")) || 0
      revenueByDateMap[key] = (revenueByDateMap[key] || 0) + amt
    } catch (e) {
      // ignore parse errors
    }
  })

  const chartData = Object.keys(revenueByDateMap)
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
    .map((date) => ({ date, revenue: revenueByDateMap[date] }))

  return (
    <div className="space-y-6">
      {/* AI Insights Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">AI Insights</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {insights.map((insight, idx) => (
            <Card
              key={idx}
              className={`${
                insight.type === "danger"
                  ? "border-red-200 bg-red-50/50 dark:bg-red-950/20"
                  : insight.type === "warning"
                    ? "border-orange-200 bg-orange-50/50 dark:bg-orange-950/20"
                    : insight.type === "success"
                      ? "border-green-200 bg-green-50/50 dark:bg-green-950/20"
                      : "border-blue-200 bg-blue-50/50 dark:bg-blue-950/20"
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm mb-1">{insight.title}</h3>
                    <p className="text-sm text-muted-foreground">{insight.message}</p>
                  </div>
                  {insight.action && (
                    <Button size="sm" variant="outline">
                      {insight.action}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-950/20 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-950/20">
                <TrendingUp className="w-3 h-3 mr-1" />
                {metrics.growthRate}%
              </Badge>
            </div>
            <div>
              <p className="text-2xl font-bold">₦{metrics.totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">Total Revenue</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950/20 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold">{metrics.totalOrders}</p>
              <p className="text-xs text-muted-foreground mt-1">Total Orders</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-950/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <Badge variant="secondary">{metrics.customerInsights.vipCustomers} VIP</Badge>
            </div>
            <div>
              <p className="text-2xl font-bold">{metrics.customerInsights.activeCustomers}</p>
              <p className="text-xs text-muted-foreground mt-1">Active Customers</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-950/20 flex items-center justify-center">
                <Package className="w-5 h-5 text-orange-600" />
              </div>
              {metrics.inventoryHealth.lowStockCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {metrics.inventoryHealth.lowStockCount} low
                </Badge>
              )}
            </div>
            <div>
              <p className="text-2xl font-bold">{products.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Total Products</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Order Status Distribution</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {orderStatusData.map((status) => {
            const percentage = orders.length > 0 ? (status.value / orders.length) * 100 : 0
            return (
              <div key={status.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }} />
                    <span>{status.name}</span>
                  </div>
                  <span className="font-semibold">
                    {status.value} ({percentage.toFixed(0)}%)
                  </span>
                </div>
                <Progress
                  value={percentage}
                  className="h-2"
                  style={{ ["--progress-background" as any]: status.color }}
                />
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Revenue trend chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <div style={{ width: "100%", height: 240 }}>
              <ResponsiveContainer>
                <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={(v) => `₦${Number(v).toLocaleString()}`} />
                  <Tooltip formatter={(v: any) => `₦${Number(v).toLocaleString()}`} />
                  <Line type="monotone" dataKey="revenue" stroke="#34d399" strokeWidth={2} dot={{ r: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No revenue data available</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Top Performing Products</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {topProducts.map((product, idx) => {
            const maxSales = Math.max(...topProducts.map((p) => p.sales))
            const barWidth = (product.sales / maxSales) * 100
            return (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                      #{idx + 1}
                    </div>
                    <span className="font-medium truncate">{product.name}</span>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <div className="font-semibold">{product.revenue}</div>
                    <div className="text-xs text-muted-foreground">{product.sales} sold</div>
                  </div>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Inventory Health */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Inventory Health</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Well Stocked</span>
              <span className="font-semibold">{metrics.inventoryHealth.wellStockedCount}</span>
            </div>
            <Progress value={(metrics.inventoryHealth.wellStockedCount / products.length) * 100} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm font-semibold">{metrics.inventoryHealth.lowStockCount}</p>
                <p className="text-xs text-muted-foreground">Low Stock</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200">
              <Package className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm font-semibold">{metrics.inventoryHealth.outOfStockCount}</p>
                <p className="text-xs text-muted-foreground">Out of Stock</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
