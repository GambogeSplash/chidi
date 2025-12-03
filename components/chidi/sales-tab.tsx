"use client"

import { ShoppingBag } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface SalesTabProps {
  orders: any[]
  onViewOrder: (orderId: number) => void
}

export function SalesTab({ orders, onViewOrder }: SalesTabProps) {
  const safeOrders = orders.filter(Boolean)

  const totalRevenue = safeOrders
    .filter((order) => order.paymentStatus === "paid")
    .reduce((sum, order) => sum + Number.parseInt(order.total.replace(/[₦,]/g, "")), 0)

  const totalOrders = safeOrders.length
  const pendingOrders = safeOrders.filter((order) => order.status === "pending").length
  const completedOrders = safeOrders.filter((order) => order.status === "delivered").length
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Sales Overview</h2>
        <p className="text-muted-foreground">Track your orders, customers, and revenue</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">From paid orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">{completedOrders} completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">Require action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{Math.round(avgOrderValue).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Per order</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">All Orders</h3>
          <p className="text-sm text-muted-foreground">Click to view details</p>
        </div>
        <div className="space-y-3">
          {orders.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground mb-2">No orders yet</p>
                <p className="text-sm text-muted-foreground">Orders will appear here once customers start buying</p>
              </CardContent>
            </Card>
          ) : (
            safeOrders.map((order) => (
              <Card
                key={order.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onViewOrder(order.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">#{order.orderNumber}</p>
                        <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                          {order.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{order.customerName}</p>
                      <p className="text-xs text-muted-foreground mt-1">{order.orderDate}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-lg">{order.total}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.items.length} item{order.items.length > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
