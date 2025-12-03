"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Plus, X } from "lucide-react"

interface CreateOrderFlowProps {
  isOpen: boolean
  onClose: () => void
  products: any[]
  customers: any[]
  onOrderCreated: (order: any) => void
}

export function CreateOrderFlow({ isOpen, onClose, products, customers, onOrderCreated }: CreateOrderFlowProps) {
  const [step, setStep] = useState(1)
  const [selectedCustomer, setSelectedCustomer] = useState("")
  const [orderItems, setOrderItems] = useState<any[]>([])
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [deliveryFee, setDeliveryFee] = useState("0")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [notes, setNotes] = useState("")

  const addOrderItem = () => {
    setOrderItems([...orderItems, { productId: "", quantity: 1, price: 0 }])
  }

  const removeOrderItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index))
  }

  const updateOrderItem = (index: number, field: string, value: any) => {
    const updated = [...orderItems]
    updated[index] = { ...updated[index], [field]: value }

    if (field === "productId") {
      const product = products.find((p) => p.id === Number.parseInt(value))
      if (product) {
        updated[index].price = Number.parseInt(product.price.replace(/[₦,]/g, ""))
      }
    }

    setOrderItems(updated)
  }

  const calculateTotal = () => {
    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    return subtotal + Number.parseInt(deliveryFee || "0")
  }

  const handleCreateOrder = () => {
    const customer = customers.find((c) => c.id === Number.parseInt(selectedCustomer))
    const newOrder = {
      id: Date.now(),
      customer: customer?.name || "Unknown",
      amount: `₦${calculateTotal().toLocaleString()}`,
      status: "pending",
      time: "Just now",
      items: orderItems.map((item) => {
        const product = products.find((p) => p.id === Number.parseInt(item.productId))
        return {
          product: product?.name || "Unknown",
          quantity: item.quantity,
          price: item.price,
        }
      }),
      deliveryAddress,
      deliveryFee: Number.parseInt(deliveryFee || "0"),
      paymentMethod,
      notes,
    }

    onOrderCreated(newOrder)
    resetForm()
  }

  const resetForm = () => {
    setStep(1)
    setSelectedCustomer("")
    setOrderItems([])
    setDeliveryAddress("")
    setDeliveryFee("0")
    setPaymentMethod("")
    setNotes("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Order - Step {step} of 4</DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label>Select Customer</Label>
              <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id.toString()}>
                      {customer.name} - {customer.phone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={() => setStep(2)} disabled={!selectedCustomer} className="w-full">
              Next: Add Products
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-3">
              {orderItems.map((item, index) => (
                <div key={index} className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Label>Product</Label>
                    <Select
                      value={item.productId}
                      onValueChange={(value) => updateOrderItem(index, "productId", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id.toString()}>
                            {product.name} - {product.price}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-24">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateOrderItem(index, "quantity", Number.parseInt(e.target.value))}
                    />
                  </div>

                  <Button variant="ghost" size="icon" onClick={() => removeOrderItem(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Button variant="outline" onClick={addOrderItem} className="w-full bg-transparent">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>

            <Separator />

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={() => setStep(3)} disabled={orderItems.length === 0} className="flex-1">
                Next: Delivery Details
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <Label>Delivery Address</Label>
              <Input
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Enter delivery address"
              />
            </div>

            <div>
              <Label>Delivery Fee (₦)</Label>
              <Input
                type="number"
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(e.target.value)}
                placeholder="0"
              />
            </div>

            <div>
              <Label>Order Notes (Optional)</Label>
              <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any special instructions" />
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button onClick={() => setStep(4)} className="flex-1">
                Next: Payment
              </Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div>
              <Label>Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash on Delivery</SelectItem>
                  <SelectItem value="transfer">Bank Transfer</SelectItem>
                  <SelectItem value="card">Card Payment</SelectItem>
                  <SelectItem value="paystack">Send Payment Link (Paystack)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>₦{orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Delivery Fee:</span>
                <span>₦{Number.parseInt(deliveryFee || "0").toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span>₦{calculateTotal().toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(3)}>
                Back
              </Button>
              <Button onClick={handleCreateOrder} disabled={!paymentMethod} className="flex-1">
                Create Order
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
