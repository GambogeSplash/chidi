"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Copy, Send, Loader2 } from "lucide-react"

interface PaymentLinkGeneratorProps {
  order: any
  customer: any
  isOpen: boolean
  onClose: () => void
}

export function PaymentLinkGenerator({ order, customer, isOpen, onClose }: PaymentLinkGeneratorProps) {
  const [paymentLink, setPaymentLink] = useState("")
  const [loading, setLoading] = useState(false)

  if (!isOpen || !order || !customer) {
    return null
  }

  const generateLink = async () => {
    setLoading(true)
    try {
      // Simulate Paystack integration
      const mockLink = `https://paystack.co/${Math.random().toString(36).substr(2, 9)}`
      setPaymentLink(mockLink)
    } catch (err) {
      console.error("Failed to generate payment link")
    } finally {
      setLoading(false)
    }
  }

  const handleShare = () => {
    const message = `Hi ${customer.name}, here's your payment link for order #${order.id}:\n\n${paymentLink}\n\nTotal: ₦${order.totalAmount.toLocaleString()}`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(paymentLink)
    alert("Payment link copied!")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Generate Payment Link</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">Order Total:</p>
            <p className="text-2xl font-bold">₦{order.totalAmount.toLocaleString()}</p>
          </div>

          {!paymentLink ? (
            <Button onClick={generateLink} disabled={loading} className="w-full">
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Generate Paystack Link
            </Button>
          ) : (
            <div className="space-y-2">
              <Label>Payment Link</Label>
              <div className="flex gap-2">
                <Input value={paymentLink} readOnly className="bg-muted/50" />
                <Button variant="outline" onClick={handleCopy} size="sm">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>

              <Button onClick={handleShare} className="w-full">
                <Send className="w-4 h-4 mr-2" />
                Send via WhatsApp
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
