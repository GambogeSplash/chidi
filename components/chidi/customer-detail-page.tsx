"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Edit, Phone, Mail, MapPin, Calendar } from "lucide-react"

interface Customer {
  id: number
  name: string
  phone: string
  email?: string
  location?: string
  totalOrders: number
  totalSpent: string
  lastOrder: string
  status: "active" | "inactive" | "vip"
  notes?: string
  joinDate: string
}

interface Order {
  id: number
  date: string
  items: string[]
  total: string
  status: "completed" | "pending" | "cancelled"
}

interface CustomerDetailPageProps {
  customer: Customer
  onBack: () => void
  onEditCustomer: (customer: Customer) => void
}

export function CustomerDetailPage({ customer, onBack, onEditCustomer }: CustomerDetailPageProps) {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock order data for the customer
  const customerOrders: Order[] = [
    {
      id: 1,
      date: "2024-01-15",
      items: ["Blue Ankara Dress", "Leather Handbag"],
      total: "₦50,000",
      status: "completed",
    },
    {
      id: 2,
      date: "2024-01-10",
      items: ["Casual Sneakers"],
      total: "₦25,000",
      status: "completed",
    },
    {
      id: 3,
      date: "2024-01-05",
      items: ["Wireless Earbuds"],
      total: "₦18,000",
      status: "pending",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "vip":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <Button size="sm" onClick={() => onEditCustomer(customer)}>
          <Edit className="w-4 h-4 mr-1" />
          Edit
        </Button>
      </div>

      {/* Customer Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="text-lg">
                {customer.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-xl font-semibold">{customer.name}</h1>
                <Badge className={`${getStatusColor(customer.status)}`}>{customer.status.toUpperCase()}</Badge>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{customer.phone}</span>
                </div>
                {customer.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{customer.email}</span>
                  </div>
                )}
                {customer.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{customer.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Customer since {customer.joinDate}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{customer.totalOrders}</div>
            <div className="text-xs text-muted-foreground">Total Orders</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{customer.totalSpent}</div>
            <div className="text-xs text-muted-foreground">Total Spent</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">4.8</div>
            <div className="text-xs text-muted-foreground">Avg Rating</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium">Last Order</label>
                <p className="text-sm text-muted-foreground">{customer.lastOrder}</p>
              </div>
              {customer.notes && (
                <div>
                  <label className="text-sm font-medium">Notes</label>
                  <p className="text-sm text-muted-foreground">{customer.notes}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium">Preferred Contact</label>
                <p className="text-sm text-muted-foreground">WhatsApp</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-3">
          {customerOrders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">Order #{order.id}</span>
                      <Badge className={`text-xs ${getOrderStatusColor(order.status)}`}>{order.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{order.total}</div>
                  </div>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Items: </span>
                  {order.items.join(", ")}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="messages" className="space-y-3">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs">
                    {customer.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm">"Do you have this in size M?"</p>
                  <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-xs text-primary-foreground">AI</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm">"Yes! We have size M in stock. Would you like to place an order?"</p>
                  <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
