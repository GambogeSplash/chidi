export interface AnalyticsMetrics {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  averageOrderValue: number
  conversionRate: number
  topProducts: any[]
  topCustomers: any[]
  orderTrend: { date: string; amount: number }[]
  customerSegments: any
}

export function calculateAnalytics(orders: any[], customers: any[], products: any[]): AnalyticsMetrics {
  const totalRevenue = orders.reduce((sum, order) => sum + (order.status === "delivered" ? order.totalAmount : 0), 0)
  const totalOrders = orders.length
  const paidOrders = orders.filter((o) => o.paymentStatus === "paid")

  const topProducts = products
    .map((p) => ({
      ...p,
      orderCount: orders.reduce((count, order) => {
        const found = order.items.find((item: any) => item.productId === p.id)
        return count + (found ? found.quantity : 0)
      }, 0),
    }))
    .sort((a, b) => b.orderCount - a.orderCount)
    .slice(0, 5)

  const orderTrend: { date: string; amount: number }[] = []
  const last30Days = new Date()
  last30Days.setDate(last30Days.getDate() - 30)

  for (let i = 0; i < 30; i++) {
    const date = new Date(last30Days)
    date.setDate(date.getDate() + i)
    const dateStr = date.toISOString().split("T")[0]

    const dayRevenue = orders
      .filter((o) => o.createdAt && o.createdAt.toISOString().startsWith(dateStr))
      .reduce((sum, o) => sum + o.totalAmount, 0)

    orderTrend.push({ date: dateStr, amount: dayRevenue })
  }

  return {
    totalRevenue,
    totalOrders,
    totalCustomers: customers.length,
    averageOrderValue: paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0,
    conversionRate: customers.length > 0 ? (paidOrders.length / customers.length) * 100 : 0,
    topProducts,
    topCustomers: customers.slice(0, 5),
    orderTrend,
    customerSegments: {
      new: customers.filter((c: any) => {
        const daysSince = (Date.now() - (c.metadata?.firstMessageDate?.getTime() || 0)) / (1000 * 60 * 60 * 24)
        return daysSince < 7
      }).length,
      repeat: customers.filter((c: any) => (c.metadata?.messageCount || 0) > 3).length,
      inactive: customers.filter((c: any) => {
        const daysSince = (Date.now() - (c.metadata?.lastOrderDate?.getTime() || 0)) / (1000 * 60 * 60 * 24)
        return daysSince > 30
      }).length,
    },
  }
}

export function generateDailyBriefing(metrics: AnalyticsMetrics, lastMetrics: AnalyticsMetrics | null): string {
  const revenueDiff = lastMetrics ? metrics.totalRevenue - lastMetrics.totalRevenue : 0
  const ordersDiff = lastMetrics ? metrics.totalOrders - lastMetrics.totalOrders : 0

  return `
📊 *Your Daily Briefing*

🛍️ Orders: ${metrics.totalOrders} (+${ordersDiff})
💰 Revenue: ₦${metrics.totalRevenue.toLocaleString()} (+₦${revenueDiff.toLocaleString()})
👥 Customers: ${metrics.totalCustomers}
📈 Avg Order Value: ₦${Math.round(metrics.averageOrderValue).toLocaleString()}

🏆 Top Sellers:
${metrics.topProducts.map((p, i) => `${i + 1}. ${p.name} (${p.orderCount} orders)`).join("\n")}

⚠️ Actions Needed:
- ${metrics.customerSegments.inactive} inactive customers need follow-up
- Low stock on: ${["Product 1", "Product 2"].join(", ")}
`
}
