"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Plus, Minus, Search } from "lucide-react"

interface Product {
  id: number
  name: string
  price: string
  stock: number
}

interface Customer {
  id: number
  name: string
  phone: string
  email?: string
}

interface CreateOrderPageProps {
  onBack: () => void
  onCreateOrder: (order: any) => void
  products: Product[]
  customers: Customer[]
}

export function CreateOrderPage({ onBack, onCreateOrder, products, customers }: CreateOrderPageProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [orderItems, setOrderItems] = useState<Array<{ productId: number; quantity: number }>>([])
  const [paymentStatus, setPaymentStatus] = useState("unpaid")
  const [notes, setNotes] = useState("")
  const [customerSearch, setCustomerSearch] = useState("")
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false)

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(customerSearch.toLowerCase()) || customer.phone.includes(customerSearch),
  )

  const addOrderItem = (productId: number) => {
    const existingItem = orderItems.find((item) => item.productId === productId)
    if (existingItem) {
      setOrderItems((prev) =>
        prev.map((item) => (item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item)),
      )
    } else {
      setOrderItems((prev) => [...prev, { productId, quantity: 1 }])
    }
  }

  const updateItemQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      setOrderItems((prev) => prev.filter((item) => item.productId !== productId))
    } else {
      setOrderItems((prev) => prev.map((item) => (item.productId === productId ? { ...item, quantity } : item)))
    }
  }

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => {
      const product = products.find((p) => p.id === item.productId)
      if (product) {
        const price = Number.parseInt(product.price.replace(/[₦,]/g, ""))
        return total + price * item.quantity
      }
      return total
    }, 0)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedCustomer || orderItems.length === 0) {
      return
    }

    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`
    const total = calculateTotal()

    const newOrder = {
      id: Date.now(),
      orderNumber,
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      customerPhone: selectedCustomer.phone,
      items: orderItems.map((item) => {
        const product = products.find((p) => p.id === item.productId)!
        return {
          productId: item.productId,
          productName: product.name,
          quantity: item.quantity,
          price: product.price,
        }
      }),
      total: `₦${total.toLocaleString()}`,
      status: "pending" as const,
      paymentStatus: paymentStatus as "paid" | "unpaid",
      orderDate: new Date().toLocaleDateString(),
      notes,
    }

    onCreateOrder(newOrder)
    onBack()
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <h1 className="text-lg font-semibold">Create Order</h1>
        <div className="w-16" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Customer Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Customer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Select Customer *</Label>
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search customers..."
                    value={selectedCustomer ? selectedCustomer.name : customerSearch}
                    onChange={(e) => {
                      setCustomerSearch(e.target.value)
                      setSelectedCustomer(null)
                      setShowCustomerDropdown(true)
                    }}
                    onFocus={() => setShowCustomerDropdown(true)}
                    className="pl-10"
                  />
                </div>
                {showCustomerDropdown && !selectedCustomer && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-40 overflow-y-auto">
                    {filteredCustomers.map((customer) => (
                      <div
                        key={customer.id}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setSelectedCustomer(customer)
                          setShowCustomerDropdown(false)
                          setCustomerSearch("")
                        }}
                      >
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-sm text-muted-foreground">{customer.phone}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Products</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Available Products</Label>
              <div className="grid gap-2">
                {products
                  .filter((product) => product.stock > 0)
                  .map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex-1">
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {product.price} • {product.stock} in stock
                        </div>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => addOrderItem(product.id)}
                        disabled={product.stock === 0}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
              </div>
            </div>

            {/* Selected Items */}
            {orderItems.length > 0 && (
              <div className="space-y-2">
                <Label>Order Items</Label>
                <div className="space-y-2">
                  {orderItems.map((item) => {
                    const product = products.find((p) => p.id === item.productId)!
                    return (
                      <div key={item.productId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex-1">
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">{product.price} each</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => updateItemQuantity(item.productId, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => updateItemQuantity(item.productId, item.quantity + 1)}
                            disabled={item.quantity >= product.stock}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Payment Status</Label>
              <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional notes for this order..."
                rows={3}
              />
            </div>

            {orderItems.length > 0 && (
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total:</span>
                  <span className="text-xl font-bold">₦{calculateTotal().toLocaleString()}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={onBack} className="flex-1 bg-transparent">
            Cancel
          </Button>
          <Button type="submit" className="flex-1" disabled={!selectedCustomer || orderItems.length === 0}>
            <Save className="w-4 h-4 mr-1" />
            Create Order
          </Button>
        </div>
      </form>
    </div>
  )
}
