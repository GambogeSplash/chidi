"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { generateInvoice, invoiceToShareableFormat } from "@/lib/chidi-core"
import { FileDown, Copy, Send } from "lucide-react"

interface InvoiceGeneratorProps {
  order: any
  customer: any
  businessInfo: any
  isOpen: boolean
  onClose: () => void
}

export function InvoiceGenerator({ order, customer, businessInfo, isOpen, onClose }: InvoiceGeneratorProps) {
  if (!order || !customer) return null

  const invoice = generateInvoice(order, customer, businessInfo)
  const shareableText = invoiceToShareableFormat(invoice)

  const handleShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareableText)}`
    window.open(whatsappUrl, "_blank")
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(shareableText)
    alert("Invoice copied to clipboard!")
  }

  const handleDownload = () => {
    const element = document.createElement("a")
    const file = new Blob([shareableText], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `invoice-${invoice.id}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Invoice for {customer.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-card border border-border rounded-lg p-6 font-mono text-sm whitespace-pre-wrap break-words max-h-96 overflow-auto">
            {shareableText}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCopy} className="flex-1 bg-transparent">
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
            <Button variant="outline" onClick={handleDownload} className="flex-1 bg-transparent">
              <FileDown className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button onClick={handleShare} className="flex-1">
              <Send className="w-4 h-4 mr-2" />
              Send via WhatsApp
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
