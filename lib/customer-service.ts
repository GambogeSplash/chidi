export interface CustomerProfile {
  id: string
  name: string
  phone: string
  email?: string
  preferences: string[]
  metadata: {
    preferredSize?: string
    preferredColor?: string
    firstMessageDate: Date
    messageCount: number
    totalSpent: number
    lastOrderDate?: Date
    averageOrderValue: number
    repeatPurchaseRate: number
  }
  tags: string[]
  segment: "vip" | "regular" | "dormant" | "new"
}

export function segmentCustomer(customer: any): "vip" | "regular" | "dormant" | "new" {
  const messageCount = customer.metadata?.messageCount || 0
  const totalSpent = customer.metadata?.totalSpent || 0
  const daysSinceLastOrder = customer.metadata?.lastOrderDate
    ? Math.floor((Date.now() - new Date(customer.metadata.lastOrderDate).getTime()) / (1000 * 60 * 60 * 24))
    : 999

  if (messageCount < 3) return "new"
  if (daysSinceLastOrder > 90) return "dormant"
  if (totalSpent > 100000 && messageCount > 5) return "vip"
  return "regular"
}

export function calculateCustomerLTV(orders: any[]): number {
  return (orders || []).filter(Boolean).reduce((sum, order) => sum + (order?.totalAmount || 0), 0)
}

export function identifyInactiveCustomers(customers: any[], daysSince = 30): any[] {
  return customers.filter((c) => {
    const lastOrderDate = c.metadata?.lastOrderDate
    if (!lastOrderDate) return false

    const daysSinceLastOrder = Math.floor((Date.now() - new Date(lastOrderDate).getTime()) / (1000 * 60 * 60 * 24))
    return daysSinceLastOrder > daysSince
  })
}

export function generateRecoveryMessage(customer: any, daysSince: number): string {
  const messages = {
    30: `Hi ${customer.name}! We miss you! Check out our new products and get 10% off your next order with code COMEBACK10`,
    60: `${customer.name}, it's been a while! Your favorites are back in stock. Come shop and claim your exclusive loyalty discount.`,
    90: `We haven't seen you in ages, ${customer.name}! As a valued customer, here's ₦${Math.round(calculateCustomerLTV([{ totalAmount: 10000 }]) * 0.1)} in loyalty credits waiting for you.`,
  }

  if (daysSince <= 30) return messages[30]
  if (daysSince <= 60) return messages[60]
  return messages[90]
}

export function buildCustomerTimeline(customer: any, orders: any[]): any[] {
  const timeline = []

  if (customer.metadata?.firstMessageDate) {
    timeline.push({
      date: customer.metadata.firstMessageDate,
      event: "First Contact",
      type: "contact",
    })
  }

  ;(orders || []).filter(Boolean).forEach((order, idx) => {
    timeline.push({
      date: order.orderDate,
      event: `Order #${order.id}`,
      type: "order",
      amount: order.totalAmount,
    })
  })

  return timeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}
