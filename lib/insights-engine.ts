export interface BusinessInsight {
  id: string
  title: string
  description: string
  priority: "high" | "medium" | "low"
  action?: string
  metric?: number
  trend?: "up" | "down" | "stable"
}

export function generateInsights(orders: any[], customers: any[], products: any[]): BusinessInsight[] {
  const insights: BusinessInsight[] = []

  // Low stock analysis
  const lowStockProducts = products.filter((p) => p.stock <= 5)
  if (lowStockProducts.length > 0) {
    insights.push({
      id: "low-stock",
      title: "Low Stock Alert",
      description: `${lowStockProducts.length} products have low inventory levels. Consider restocking soon.`,
      priority: "high",
      action: "Restock now",
      metric: lowStockProducts.length,
    })
  }

  // Inactive customers
  const inactiveCustomers = customers.filter((c) => {
    const daysSince = c.metadata?.lastOrderDate
      ? Math.floor((Date.now() - new Date(c.metadata.lastOrderDate).getTime()) / (1000 * 60 * 60 * 24))
      : 999
    return daysSince > 30
  })

  if (inactiveCustomers.length > 0) {
    insights.push({
      id: "inactive-customers",
      title: "Customer Re-engagement Opportunity",
      description: `${inactiveCustomers.length} customers haven't purchased in over 30 days. Send them a special offer.`,
      priority: "medium",
      action: "Start campaign",
      metric: inactiveCustomers.length,
    })
  }

  // Top performer
  const topProduct = products.reduce(
    (max, p) => {
      const orderCount = orders.reduce((count, o) => {
        const found = o.items?.find((item: any) => item.productId === p.id)
        return count + (found ? found.quantity : 0)
      }, 0)
      return orderCount > (max.orderCount || 0) ? { ...p, orderCount } : max
    },
    { orderCount: 0 },
  )

  if (topProduct.orderCount > 0) {
    insights.push({
      id: "top-product",
      title: "Top Performing Product",
      description: `"${topProduct.name}" is your best seller! Consider creating bundle deals with this product.`,
      priority: "low",
      metric: topProduct.orderCount,
      trend: "up",
    })
  }

  // Revenue trend
  const recentOrders = orders.filter((o) => {
    const date = new Date(o.orderDate)
    const daysSince = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24))
    return daysSince <= 7
  })

  const lastWeekRevenue = recentOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)
  insights.push({
    id: "weekly-revenue",
    title: "Weekly Revenue",
    description: `You made ₦${lastWeekRevenue.toLocaleString()} in the last 7 days.`,
    priority: "low",
    metric: lastWeekRevenue,
    trend: "stable",
  })

  return insights
}

export function generateGrowthRecommendations(orders: any[], customers: any[]): string[] {
  const recommendations: string[] = []

  if (orders.length < 10) {
    recommendations.push("You're just starting! Focus on customer satisfaction to build word-of-mouth")
  }

  if (customers.length > 0) {
    const repeatCustomers = customers.filter((c) => (c.metadata?.messageCount || 0) > 3).length
    const repeatRate = (repeatCustomers / customers.length) * 100

    if (repeatRate < 30) {
      recommendations.push("Implement a loyalty program to increase repeat purchases")
    }
  }

  if (orders.length > 0) {
    const avgOrderValue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0) / orders.length
    if (avgOrderValue < 20000) {
      recommendations.push("Bundle products or create combo offers to increase average order value")
    }
  }

  recommendations.push("Enable WhatsApp and Instagram integrations for wider reach")
  recommendations.push("Share customer testimonials on your social media")

  return recommendations
}
