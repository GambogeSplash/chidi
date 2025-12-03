// Analytics and business intelligence functions
export interface BusinessMetrics {
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  growthRate: number
  topProducts: Array<{ name: string; sales: number; revenue: string }>
  customerInsights: {
    totalCustomers: number
    activeCustomers: number
    vipCustomers: number
    churnRisk: number
  }
  inventoryHealth: {
    lowStockCount: number
    outOfStockCount: number
    wellStockedCount: number
  }
}

export function calculateBusinessMetrics(orders: any[], customers: any[], products: any[]): BusinessMetrics {
  // Calculate total revenue
  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, order) => {
      const orderValue = Number.parseInt(order.total.replace(/[₦,]/g, ""))
      return sum + orderValue
    }, 0)

  // Total orders
  const totalOrders = orders.filter((o) => o.status !== "cancelled").length

  // Average order value
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  // Growth rate (simulated - would compare with previous period in production)
  const growthRate = 18

  // Top products
  const productSales = new Map<number, { name: string; count: number; revenue: number }>()

  orders
    .filter((o) => o.status !== "cancelled")
    .forEach((order) => {
      order.items.forEach((item: any) => {
        const existing = productSales.get(item.productId) || {
          name: item.productName,
          count: 0,
          revenue: 0,
        }
        const itemRevenue = Number.parseInt(item.price.replace(/[₦,]/g, "")) * item.quantity
        productSales.set(item.productId, {
          name: item.productName,
          count: existing.count + item.quantity,
          revenue: existing.revenue + itemRevenue,
        })
      })
    })

  const topProducts = Array.from(productSales.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)
    .map((p) => ({
      name: p.name,
      sales: p.count,
      revenue: `₦${p.revenue.toLocaleString()}`,
    }))

  // Customer insights
  const activeCustomers = customers.filter((c) => c.status === "active" || c.status === "vip").length
  const vipCustomers = customers.filter((c) => c.status === "vip").length
  const churnRisk = customers.filter((c) => c.status === "inactive").length

  // Inventory health
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 3).length
  const outOfStockCount = products.filter((p) => p.stock === 0).length
  const wellStockedCount = products.filter((p) => p.stock > 3).length

  return {
    totalRevenue,
    totalOrders,
    averageOrderValue,
    growthRate,
    topProducts,
    customerInsights: {
      totalCustomers: customers.length,
      activeCustomers,
      vipCustomers,
      churnRisk,
    },
    inventoryHealth: {
      lowStockCount,
      outOfStockCount,
      wellStockedCount,
    },
  }
}

export function generateInsights(
  metrics: BusinessMetrics,
  products: any[],
): Array<{
  type: "success" | "warning" | "info" | "danger"
  title: string
  message: string
  action?: string
}> {
  const insights = []

  // Revenue insights
  if (metrics.growthRate > 10) {
    insights.push({
      type: "success" as const,
      title: "Strong Growth",
      message: `Your revenue is up ${metrics.growthRate}% compared to last period. Keep up the great work!`,
    })
  }

  // Inventory warnings
  if (metrics.inventoryHealth.outOfStockCount > 0) {
    insights.push({
      type: "danger" as const,
      title: "Out of Stock Alert",
      message: `${metrics.inventoryHealth.outOfStockCount} product${metrics.inventoryHealth.outOfStockCount > 1 ? "s are" : " is"} completely out of stock. This could impact sales.`,
      action: "Restock Now",
    })
  }

  if (metrics.inventoryHealth.lowStockCount > 0) {
    insights.push({
      type: "warning" as const,
      title: "Low Stock Warning",
      message: `${metrics.inventoryHealth.lowStockCount} product${metrics.inventoryHealth.lowStockCount > 1 ? "s are" : " is"} running low. Consider restocking soon.`,
      action: "View Products",
    })
  }

  // Customer insights
  if (metrics.customerInsights.churnRisk > 0) {
    insights.push({
      type: "info" as const,
      title: "Re-engagement Opportunity",
      message: `${metrics.customerInsights.churnRisk} customer${metrics.customerInsights.churnRisk > 1 ? "s haven't" : " hasn't"} ordered recently. Consider reaching out with special offers.`,
      action: "View Customers",
    })
  }

  // Top products
  if (metrics.topProducts.length > 0) {
    const topProduct = metrics.topProducts[0]
    insights.push({
      type: "success" as const,
      title: "Best Seller",
      message: `${topProduct.name} is your top performer with ${topProduct.sales} sales and ${topProduct.revenue} revenue.`,
    })
  }

  return insights
}

export function predictReorderNeeds(
  products: any[],
  orders: any[],
): Array<{
  product: any
  daysUntilStockout: number
  recommendedReorderQuantity: number
}> {
  // Calculate average daily sales for each product
  const productSalesRate = new Map<number, number>()

  // Simulate 30 days of data
  const daysInPeriod = 30

  orders.forEach((order) => {
    order.items.forEach((item: any) => {
      const current = productSalesRate.get(item.productId) || 0
      productSalesRate.set(item.productId, current + item.quantity)
    })
  })

  const predictions = products
    .map((product) => {
      const totalSales = productSalesRate.get(product.id) || 0
      const dailySalesRate = totalSales / daysInPeriod

      if (dailySalesRate === 0) {
        return null
      }

      const daysUntilStockout = product.stock / dailySalesRate
      const recommendedReorderQuantity = Math.ceil(dailySalesRate * 30) // 30 days worth

      return {
        product,
        daysUntilStockout: Math.round(daysUntilStockout),
        recommendedReorderQuantity,
      }
    })
    .filter((p) => p !== null && p.daysUntilStockout <= 14) // Alert if less than 2 weeks
    .sort((a, b) => a!.daysUntilStockout - b!.daysUntilStockout)

  return predictions as Array<{
    product: any
    daysUntilStockout: number
    recommendedReorderQuantity: number
  }>
}
