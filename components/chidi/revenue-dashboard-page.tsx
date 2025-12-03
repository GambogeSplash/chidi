"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package, Download } from "lucide-react"

interface RevenueDashboardPageProps {
  onBack: () => void
  orders: any[]
  customers: any[]
  products: any[]
}

export function RevenueDashboardPage({ onBack, orders, customers, products }: RevenueDashboardPageProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month" | "quarter" | "year">("month")

  const safeOrders = orders || []
  const safeCustomers = customers || []
  const safeProducts = products || []

  // Calculate revenue metrics
  const totalRevenue = safeOrders
    .filter((order) => order.paymentStatus === "paid")
    .reduce((sum, order) => sum + Number.parseInt(order.total.replace(/[₦,]/g, "")), 0)

  const totalOrders = safeOrders.length
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
  const totalCustomers = safeCustomers.length
  const repeatCustomers = safeCustomers.filter((customer) => customer.totalOrders > 1).length
  const customerRetentionRate = totalCustomers > 0 ? (repeatCustomers / totalCustomers) * 100 : 0

  // Calculate period-specific metrics
  const thisMonthRevenue = 245000 // Mock data
  const lastMonthRevenue = 180000 // Mock data
  const revenueGrowth = lastMonthRevenue > 0 ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0

  // Top performing products
  const productPerformance = safeProducts
    .map((product) => {
      const productOrders = safeOrders.filter((order) => order.items.some((item: any) => item.productId === product.id))
      const revenue = productOrders.reduce((sum, order) => {
        const productItem = order.items.find((item: any) => item.productId === product.id)
        return sum + (productItem ? Number.parseInt(productItem.price.replace(/[₦,]/g, "")) * productItem.quantity : 0)
      }, 0)
      const unitsSold = productOrders.reduce((sum, order) => {
        const productItem = order.items.find((item: any) => item.productId === product.id)
        return sum + (productItem ? productItem.quantity : 0)
      }, 0)

      return {
        ...product,
        revenue,
        unitsSold,
        orders: productOrders.length,
      }
    })
    .sort((a, b) => b.revenue - a.revenue)

  // Mock chart data for revenue trends
  const revenueChartData = [
    { period: "Week 1", revenue: 45000 },
    { period: "Week 2", revenue: 52000 },
    { period: "Week 3", revenue: 48000 },
    { period: "Week 4", revenue: 65000 },
    { period: "Week 5", revenue: 75000 },
  ]

  const maxRevenue = Math.max(...revenueChartData.map((d) => d.revenue))

  const formatCurrency = (amount: number) => `₦${amount.toLocaleString()}`

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return "text-green-600"
    if (growth < 0) return "text-red-600"
    return "text-gray-600"
  }

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <TrendingUp className="w-4 h-4" />
    if (growth < 0) return <TrendingDown className="w-4 h-4" />
    return null
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <h1 className="text-lg font-semibold">Revenue Dashboard</h1>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-1" />
          Export
        </Button>
      </div>

      {/* Period Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {["week", "month", "quarter", "year"].map((period) => (
          <Button
            key={period}
            variant={selectedPeriod === period ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedPeriod(period as any)}
            className="capitalize whitespace-nowrap"
          >
            {period}
          </Button>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <div className={`flex items-center gap-1 text-sm ${getGrowthColor(revenueGrowth)}`}>
                {getGrowthIcon(revenueGrowth)}
                <span>{Math.abs(revenueGrowth).toFixed(1)}%</span>
              </div>
            </div>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <div className="text-xs text-muted-foreground">Total Revenue</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <ShoppingCart className="w-5 h-5 text-blue-600" />
              <div className="flex items-center gap-1 text-sm text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span>12%</span>
              </div>
            </div>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <div className="text-xs text-muted-foreground">Total Orders</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-purple-600" />
              <div className="flex items-center gap-1 text-sm text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span>8%</span>
              </div>
            </div>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <div className="text-xs text-muted-foreground">Total Customers</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Package className="w-5 h-5 text-orange-600" />
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <span>{customerRetentionRate.toFixed(1)}%</span>
              </div>
            </div>
            <div className="text-2xl font-bold">{formatCurrency(averageOrderValue)}</div>
            <div className="text-xs text-muted-foreground">Avg Order Value</div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Revenue Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {revenueChartData.map((data, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-16 text-xs text-muted-foreground">{data.period}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(data.revenue / maxRevenue) * 100}%` }}
                      />
                    </div>
                    <div className="text-sm font-medium w-20 text-right">{formatCurrency(data.revenue)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Top Performing Products</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {productPerformance.slice(0, 5).map((product, index) => (
            <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">#{index + 1}</span>
                </div>
                <div>
                  <div className="font-medium text-sm">{product.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {product.unitsSold} units • {product.orders} orders
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-sm">{formatCurrency(product.revenue)}</div>
                <div className="text-xs text-muted-foreground">Revenue</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Customer Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Customer Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{repeatCustomers}</div>
              <div className="text-xs text-muted-foreground">Repeat Customers</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{customerRetentionRate.toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground">Retention Rate</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>New Customers</span>
              <span className="font-medium">{totalCustomers - repeatCustomers}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>VIP Customers</span>
              <span className="font-medium">{safeCustomers.filter((c) => c.status === "vip").length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Average Customer Value</span>
              <span className="font-medium">
                {formatCurrency(totalCustomers > 0 ? totalRevenue / totalCustomers : 0)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Financial Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">Gross Revenue</span>
            <span className="font-medium">{formatCurrency(totalRevenue)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Estimated Costs</span>
            <span className="font-medium text-red-600">-{formatCurrency(totalRevenue * 0.3)}</span>
          </div>
          <div className="border-t pt-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">Net Profit</span>
              <span className="font-bold text-green-600">{formatCurrency(totalRevenue * 0.7)}</span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-2">*Estimated based on 30% cost margin</div>
        </CardContent>
      </Card>
    </div>
  )
}
