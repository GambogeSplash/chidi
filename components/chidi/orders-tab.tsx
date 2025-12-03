"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Plus, Filter, Calendar, DollarSign, Package } from "lucide-react"

interface Order {
  id: number
  orderNumber: string
  customerId: number
  customerName: string
  customerPhone: string
  items: Array<{
    productId: number
    productName: string
    quantity: number
    price: string
  }>
  total: string
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  paymentStatus: "unpaid" | "paid" | "refunded"
  orderDate: string
  deliveryDate?: string
  notes?: string
}

interface OrdersTabProps {
  orders: Order[]
  customers: any[]
  products: any[]
  onAddOrder: () => void
  onViewOrder: (order: Order) => void
  onUpdateOrderStatus: (orderId: number, status: string) => void
}

export function OrdersTab({
  orders,
  customers,
  products,
  onAddOrder,
  onViewOrder,
  onUpdateOrderStatus,
}: OrdersTabProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showFilters, setShowFilters] = useState(false)

  const filteredOrders = orders.filter((order) => {
    if (!order) return false
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerPhone.includes(searchQuery)

    const matchesFilter = filterStatus === "all" || order.status === filterStatus

    return matchesSearch && matchesFilter
  })

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

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "unpaid":
        return "bg-red-100 text-red-800"
      case "refunded":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCustomerData = (customerId: number) => {
    return customers.find((c) => c.id === customerId) || null
  }

  const getProductData = (productId: number) => {
    return products.find((p) => p.id === productId) || null
  }

  const totalRevenue = orders
    .filter((order) => order.paymentStatus === "paid")
    .reduce((sum, order) => sum + Number.parseInt(order.total.replace(/[₦,]/g, "")), 0)

  const pendingOrders = orders.filter((order) => order.status === "pending").length

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Orders</h2>
          <p className="text-sm text-muted-foreground">{orders.length} total orders</p>
        </div>
        <Button onClick={onAddOrder} size="sm" className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-1" />
          New Order
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <Card>
          <CardContent className="p-2 sm:p-3 text-center">
            <div className="flex items-center justify-center mb-1">
              <Package className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
            </div>
            <div className="text-base sm:text-lg font-bold text-primary">{pendingOrders}</div>
            <div className="text-xs text-muted-foreground">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-2 sm:p-3 text-center">
            <div className="flex items-center justify-center mb-1">
              <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
            </div>
            <div className="text-base sm:text-lg font-bold text-primary">₦{totalRevenue.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Revenue</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-2 sm:p-3 text-center">
            <div className="flex items-center justify-center mb-1">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
            </div>
            <div className="text-base sm:text-lg font-bold text-primary">{orders.length}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="w-4 h-4 mr-1" />
            Filter
          </Button>
          {filterStatus !== "all" && (
            <Badge variant="secondary" className="capitalize">
              {filterStatus}
            </Badge>
          )}
        </div>

        {showFilters && (
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filterStatus === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("all")}
            >
              All
            </Button>
            <Button
              variant={filterStatus === "pending" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("pending")}
            >
              Pending
            </Button>
            <Button
              variant={filterStatus === "confirmed" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("confirmed")}
            >
              Confirmed
            </Button>
            <Button
              variant={filterStatus === "shipped" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("shipped")}
            >
              Shipped
            </Button>
            <Button
              variant={filterStatus === "delivered" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("delivered")}
            >
              Delivered
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">No orders found</p>
              <Button onClick={onAddOrder} className="mt-2" size="sm">
                Create Your First Order
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => {
            const customerData = getCustomerData(order.customerId)
            return (
              <Card
                key={order.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onViewOrder(order)}
              >
                <CardContent className="p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-3 mb-3">
                    <div className="flex items-start gap-2 sm:gap-3 flex-1 w-full">
                      <Avatar className="w-8 h-8 sm:w-10 sm:h-10 shrink-0">
                        {customerData?.image ? (
                          <AvatarImage src={customerData.image || "/placeholder.svg"} alt={order.customerName} />
                        ) : null}
                        <AvatarFallback>
                          {order.customerName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1">
                          <h3 className="font-medium text-sm sm:text-base">#{order.orderNumber}</h3>
                          <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                            {order.status.toUpperCase()}
                          </Badge>
                          <Badge className={`text-xs ${getPaymentStatusColor(order.paymentStatus)}`}>
                            {order.paymentStatus.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1 truncate">{order.customerName}</p>
                        <p className="text-xs text-muted-foreground">
                          {order.items.length} item{order.items.length > 1 ? "s" : ""} • {order.orderDate}
                        </p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right w-full sm:w-auto">
                      <div className="font-medium text-lg">{order.total}</div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="flex -space-x-2">
                      {order.items.slice(0, 3).map((item, index) => {
                        const productData = getProductData(item.productId)
                        return (
                          <Avatar key={index} className="w-6 h-6 border-2 border-white">
                            {productData?.image ? (
                              <AvatarImage src={productData.image || "/placeholder.svg"} alt={item.productName} />
                            ) : null}
                            <AvatarFallback className="text-xs">
                              {item.productName.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        )
                      })}
                      {order.items.length > 3 && (
                        <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                          <span className="text-xs text-gray-600">+{order.items.length - 3}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
                      {order.items.map((item) => `${item.productName} (${item.quantity})`).join(", ")}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
