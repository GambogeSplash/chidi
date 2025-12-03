import type { Product, Order, Customer } from "./types"

// CSV parsing for bulk product import
export function parseCSV(csvText: string): Partial<Product>[] {
  const lines = csvText.trim().split("\n")
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())

  return lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim())
    const product: Partial<Product> = {}

    headers.forEach((header, idx) => {
      if (header === "name") product.name = values[idx]
      if (header === "price") product.price = values[idx]
      if (header === "stock") product.stock = Number.parseInt(values[idx])
      if (header === "category") product.category = values[idx]
      if (header === "description") product.description = values[idx]
    })

    return product
  })
}

// Smart order detection from natural language
export function detectOrderFromMessage(message: string, products: Product[]): Partial<Order> | null {
  const lowerMsg = message.toLowerCase()

  // Look for quantity patterns (e.g., "2 blues", "one dress")
  const quantities: { [key: string]: number } = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    "1": 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
  }

  let totalAmount = 0
  const items: any[] = []

  products.forEach((product) => {
    const productNameLower = product.name.toLowerCase()
    if (lowerMsg.includes(productNameLower)) {
      // Extract quantity
      const words = lowerMsg.split(" ")
      let quantity = 1

      words.forEach((word, idx) => {
        if (quantities[word] && idx < words.indexOf(productNameLower)) {
          quantity = quantities[word]
        }
      })

      items.push({
        productId: product.id,
        productName: product.name,
        quantity,
        price: Number.parseFloat(product.price.replace(/[^0-9]/g, "")),
      })

      totalAmount += quantity * Number.parseFloat(product.price.replace(/[^0-9]/g, ""))
    }
  })

  if (items.length > 0) {
    return {
      items,
      totalAmount,
      status: "pending",
      createdAt: new Date(),
    }
  }

  return null
}

// Customer auto-profiling
export function autoProfileCustomer(message: string, previousMessages: string[] = []): Partial<Customer> {
  const profile: Partial<Customer> = {
    preferences: [],
    metadata: {
      firstMessageDate: new Date(),
      messageCount: previousMessages.length + 1,
    },
  }

  // Extract preferences from message
  const lowerMsg = message.toLowerCase()
  if (lowerMsg.includes("size")) {
    const sizeMatch = message.match(/size\s+(\d+|xs|s|m|l|xl|xxl)/i)
    if (sizeMatch && profile.metadata) profile.metadata.preferredSize = sizeMatch[1]
  }

  if (lowerMsg.includes("color")) {
    const colorMatch = message.match(/color\s+(\w+)/i)
    if (colorMatch && profile.metadata) profile.metadata.preferredColor = colorMatch[1]
  }

  return profile
}

// Invoice generation
export interface Invoice {
  id: string
  orderNumber: string
  customerName: string
  items: { name: string; quantity: number; price: number }[]
  totalAmount: number
  businessName: string
  businessPhone: string
  generatedAt: Date
  dueDate?: Date
}

export function generateInvoice(order: Order, customer: Customer, businessInfo: any): Invoice {
  return {
    id: `INV-${Date.now()}`,
    orderNumber: order.id,
    customerName: customer.name,
    items: order.items.map(item => ({
      name: item.productName,
      quantity: item.quantity,
      price: item.price
    })),
    totalAmount: order.totalAmount,
    businessName: businessInfo.name,
    businessPhone: businessInfo.phone,
    generatedAt: new Date(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  }
}

export function invoiceToShareableFormat(invoice: Invoice): string {
  return `
*INVOICE*
Order: ${invoice.orderNumber}
Customer: ${invoice.customerName}

${invoice.items.map((item) => `${item.name} x${item.quantity} = ₦${item.price.toLocaleString()}`).join("\n")}

*Total: ₦${invoice.totalAmount.toLocaleString()}*

Business: ${invoice.businessName}
Phone: ${invoice.businessPhone}
Date: ${invoice.generatedAt.toLocaleDateString()}
`
}

export function formatInvoice(invoice: Invoice): string {
  return `
*INVOICE*
Order: ${invoice.orderNumber}
Customer: ${invoice.customerName}

${invoice.items.map((item) => `${item.name} x${item.quantity} = ₦${item.price.toLocaleString()}`).join("\n")}

*Total: ₦${invoice.totalAmount.toLocaleString()}*

Business: ${invoice.businessName}
Phone: ${invoice.businessPhone}
Date: ${invoice.generatedAt.toLocaleDateString()}
`
}
// Bulk Order Export
export function exportOrdersToCSV(orders: Order[]): string {
  const validOrders = orders.filter(Boolean)
  const headers = ["Order ID", "Customer ID", "Date", "Status", "Total Amount", "Items", "Payment Status"]
  const rows = validOrders.map(order => [
    order.id,
    order.customerId,
    new Date(order.createdAt).toLocaleDateString(),
    order.status,
    order.totalAmount.toString(),
    order.items.map(i => `${i.productName} (x${i.quantity})`).join("; "),
    order.paymentStatus
  ])

  return [
    headers.join(","),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
  ].join("\n")
}
