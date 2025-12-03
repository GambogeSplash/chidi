"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Edit, Package, TrendingUp, ShoppingCart, Calendar } from "lucide-react"

interface ProductDetailPageProps {
  product: any
  onBack: () => void
  onEditProduct: (product: any) => void
}

export function ProductDetailPage({ product, onBack, onEditProduct }: ProductDetailPageProps) {
  if (!product) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "bg-green-100 text-green-800"
      case "low":
        return "bg-amber-100 text-amber-800"
      case "out":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "good":
        return "In Stock"
      case "low":
        return "Low Stock"
      case "out":
        return "Out of Stock"
      default:
        return "Unknown"
    }
  }

  // Mock data for demonstration
  const salesData = {
    thisWeek: { sales: 8, revenue: "₦120,000" },
    thisMonth: { sales: 32, revenue: "₦480,000" },
    totalSold: 156,
  }

  const recentOrders = [
    { id: 1, customer: "Jane Doe", date: "2024-01-15", quantity: 2, total: "₦30,000" },
    { id: 2, customer: "Mike Johnson", date: "2024-01-14", quantity: 1, total: "₦15,000" },
    { id: 3, customer: "Sarah Wilson", date: "2024-01-13", quantity: 3, total: "₦45,000" },
  ]

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-lg font-semibold">Product Details</h2>
      </div>

      {/* Product Overview */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg font-bold text-primary">{product.price}</span>
                <Badge className={`text-xs ${getStatusColor(product.status)}`}>{getStatusText(product.status)}</Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Package className="w-4 h-4" />
                  <span>{product.stock} units in stock</span>
                </div>
              </div>
              {product.variants && product.variants.length > 0 ? (
                <div className="mt-3">
                  <h4 className="text-sm font-medium mb-2">Variants</h4>
                  <div className="flex flex-col gap-2">
                    {product.variants.map((v: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-3 text-sm">
                        <div className="font-medium w-28">{v.name}</div>
                        <div className="flex flex-wrap gap-2">
                          {Array.isArray(v.options) && v.options.length > 0
                            ? v.options.map((opt: string, i: number) => (
                                <span key={i} className="px-2 py-1 bg-muted rounded text-xs">
                                  {opt}
                                </span>
                              ))
                            : <span className="text-muted-foreground">No options</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
            <Button size="sm" onClick={() => onEditProduct(product)}>
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </div>

          {/* Product Image Placeholder */}
          <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center mb-4">
            <Package className="w-12 h-12 text-muted-foreground" />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-lg font-bold">{salesData.totalSold}</div>
              <div className="text-xs text-muted-foreground">Total Sold</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">{salesData.thisWeek.sales}</div>
              <div className="text-xs text-muted-foreground">This Week</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">{salesData.thisMonth.sales}</div>
              <div className="text-xs text-muted-foreground">This Month</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Information */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Category</span>
                <span className="text-sm">Fashion</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">SKU</span>
                <span className="text-sm">PRD-{product.id.toString().padStart(3, "0")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Added</span>
                <span className="text-sm">Jan 10, 2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Last Updated</span>
                <span className="text-sm">2 days ago</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Sales Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-lg font-bold">{salesData.thisWeek.revenue}</div>
                  <div className="text-xs text-muted-foreground">This Week Revenue</div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-lg font-bold">{salesData.thisMonth.revenue}</div>
                  <div className="text-xs text-muted-foreground">This Month Revenue</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Average Order Value</span>
                  <span className="font-medium">₦15,000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Conversion Rate</span>
                  <span className="font-medium">12.5%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Recent Orders
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                  <div>
                    <div className="text-sm font-medium">{order.customer}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {order.date}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{order.total}</div>
                    <div className="text-xs text-muted-foreground">{order.quantity} units</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
