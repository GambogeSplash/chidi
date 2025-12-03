"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CreditCard, Loader2, CheckCircle, AlertCircle } from "lucide-react"

interface PaymentCheckoutProps {
  order: any
  customer: any
  isOpen: boolean
  onClose: () => void
  onPaymentSuccess: (reference: string) => void
}

export function PaymentCheckout({ order, customer, isOpen, onClose, onPaymentSuccess }: PaymentCheckoutProps) {
  if (!isOpen || !order || !customer) return null

  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentLink, setPaymentLink] = useState("")
  const [status, setStatus] = useState<"ready" | "processing" | "success" | "error">("ready")

  const handleInitiatePayment = async () => {
    setIsProcessing(true)
    setStatus("processing")

    try {
      // Simulate Paystack payment link generation
      const mockLink = `https://checkout.paystack.com/${Math.random().toString(36).substr(2, 20)}`
      setPaymentLink(mockLink)
      setStatus("success")

      // In real implementation, would redirect to Paystack
      // window.location.href = mockLink

      onPaymentSuccess(`REF-${Date.now()}`)
    } catch (error) {
      setStatus("error")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Payment Checkout</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Summary */}
          <Card className="p-4 bg-muted/50">
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Order Number</p>
                <p className="font-semibold">{order.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Customer</p>
                <p className="font-semibold">{customer.name}</p>
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-muted-foreground">Items</p>
                  <p className="font-medium">{order.items?.length || 0}</p>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <p className="text-sm text-muted-foreground">Subtotal</p>
                  <p className="font-medium">₦{order.totalAmount?.toLocaleString() || "0"}</p>
                </div>
                <div className="flex justify-between items-center border-t border-border pt-3">
                  <p className="font-semibold">Total</p>
                  <p className="text-xl font-bold">₦{order.totalAmount?.toLocaleString() || "0"}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Payment Status */}
          {status === "success" && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-green-900">Payment Initiated</p>
                <p className="text-sm text-green-700">You'll be redirected to Paystack to complete payment</p>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-900">Payment Failed</p>
                <p className="text-sm text-red-700">Please try again</p>
              </div>
            </div>
          )}

          {/* Payment Button */}
          <Button
            onClick={handleInitiatePayment}
            disabled={isProcessing || status === "success"}
            className="w-full"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : status === "success" ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Payment Initiated
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4 mr-2" />
                Pay ₦{order.totalAmount?.toLocaleString() || "0"}
              </>
            )}
          </Button>

          {/* Payment Methods Info */}
          <div className="text-sm text-muted-foreground space-y-2">
            <p className="font-medium">Accepted Payment Methods:</p>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="outline">Card</Badge>
              <Badge variant="outline">Bank Transfer</Badge>
              <Badge variant="outline">Mobile Money</Badge>
              <Badge variant="outline">USSD</Badge>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
