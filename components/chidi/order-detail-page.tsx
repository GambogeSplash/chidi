"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Edit, Phone, Calendar, Package } from "lucide-react"

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

interface OrderDetailPageProps {
  order: Order
  onBack: () => void
  onUpdateStatus: (orderId: number, status: string) => void
}

export function OrderDetailPage({ order, onBack, onUpdateStatus }: OrderDetailPageProps) {
  if (!order) return null

  const [currentStatus, setCurrentStatus] = useState(order.status)

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

  const handleStatusUpdate = (newStatus: string) => {
    setCurrentStatus(newStatus as any)
    onUpdateStatus(order.id, newStatus)
  }

  const subtotal = order.items.reduce((sum, item) => {
    const price = Number.parseInt(item.price.replace(/[₦,]/g, ""))
    return sum + price * item.quantity
  }, 0)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <Button size="sm" variant="outline">
          <Edit className="w-4 h-4 mr-1" />
          Edit
        </Button>
      </div>

      {/* Order Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-xl font-semibold mb-2">Order #{order.orderNumber}</h1>
              <div className="flex items-center gap-2 mb-2">
                <Badge className={`${getStatusColor(currentStatus)}`}>{currentStatus.toUpperCase()}</Badge>
                <Badge className={`${getPaymentStatusColor(order.paymentStatus)}`}>
                  {order.paymentStatus.toUpperCase()}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Ordered on {order.orderDate}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{order.total}</div>
            </div>
          </div>

          {/* Status Update */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Update Status</label>
            <Select value={currentStatus} onValueChange={handleStatusUpdate}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Customer Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarFallback>
                {order.customerName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{order.customerName}</div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Phone className="w-3 h-3" />
                <span>{order.customerPhone}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Order Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {order.items.map((item, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                  <Package className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <div className="font-medium">{item.productName}</div>
                  <div className="text-sm text-muted-foreground">Qty: {item.quantity}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">{item.price}</div>
                <div className="text-sm text-muted-foreground">
                  ₦{(Number.parseInt(item.price.replace(/[₦,]/g, "")) * item.quantity).toLocaleString()}
                </div>
              </div>
            </div>
          ))}

          {/* Order Summary */}
          <div className="pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>₦{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Delivery:</span>
              <span>₦2,000</span>
            </div>
            <div className="flex justify-between font-medium text-lg pt-2 border-t">
              <span>Total:</span>
              <span>{order.total}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      {order.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{order.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
