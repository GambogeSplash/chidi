"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, TrendingUp, Edit3, AlertTriangle, DollarSign } from "lucide-react"

interface Product {
  id: number
  name: string
  stock: number
  price: string
  status: "good" | "low" | "out"
  category?: string
  description?: string
  image?: string
}

interface ProductDetailModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product | null
  onEditProduct: (product: Product) => void
}

export function ProductDetailModal({ isOpen, onClose, product, onEditProduct }: ProductDetailModalProps) {
  if (!product) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "bg-green-100 text-green-800 border-green-200"
      case "low":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "out":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
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

  // Mock sales data for the product
  const salesData = {
    totalSold: 45,
    revenue: "₦675,000",
    avgOrderValue: "₦15,000",
    lastSold: "2 hours ago",
    weeklyTrend: "+12%",
  }

  const recentOrders = [
    { id: 1, customer: "Jane D.", quantity: 1, date: "2 hours ago", status: "completed" },
    { id: 2, customer: "Mike O.", quantity: 2, date: "1 day ago", status: "completed" },
    { id: 3, customer: "Sarah K.", quantity: 1, date: "3 days ago", status: "completed" },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Product Details</span>
            <Button variant="ghost" size="sm" onClick={() => onEditProduct(product)}>
              <Edit3 className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Product Image */}
          <div className="aspect-square bg-muted rounded-lg overflow-hidden">
            {product.image ? (
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-12 h-12 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-3">
            <div>
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xl font-bold text-primary">{product.price}</span>
                <Badge className={`text-xs ${getStatusColor(product.status)}`}>{getStatusText(product.status)}</Badge>
              </div>
            </div>

            {/* Stock Alert */}
            {(product.status === "low" || product.status === "out") && (
              <Card className="border-amber-200 bg-amber-50">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">
                        {product.status === "out" ? "Out of Stock" : "Low Stock Alert"}
                      </p>
                      <p className="text-xs text-amber-700">
                        {product.status === "out"
                          ? "This product is currently unavailable"
                          : `Only ${product.stock} units remaining`}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <Card>
                <CardContent className="p-3 text-center">
                  <div className="text-lg font-bold">{product.stock}</div>
                  <div className="text-xs text-muted-foreground">Units in Stock</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 text-center">
                  <div className="text-lg font-bold">{salesData.totalSold}</div>
                  <div className="text-xs text-muted-foreground">Total Sold</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Tabs for detailed info */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="sales">Sales</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-3">
              {product.category && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Category</label>
                  <p className="text-sm capitalize">{product.category}</p>
                </div>
              )}

              {product.description && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <p className="text-sm">{product.description}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-muted-foreground">Stock Status</label>
                <p className="text-sm">{product.stock} units available</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                <p className="text-sm">Today at 2:30 PM</p>
              </div>
            </TabsContent>

            <TabsContent value="sales" className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Card>
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <div>
                        <div className="text-sm font-bold">{salesData.revenue}</div>
                        <div className="text-xs text-muted-foreground">Total Revenue</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <div>
                        <div className="text-sm font-bold">{salesData.weeklyTrend}</div>
                        <div className="text-xs text-muted-foreground">This Week</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Average Order Value</label>
                <p className="text-sm font-semibold">{salesData.avgOrderValue}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Last Sale</label>
                <p className="text-sm">{salesData.lastSold}</p>
              </div>
            </TabsContent>

            <TabsContent value="orders" className="space-y-3">
              <div className="space-y-2">
                {recentOrders.map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{order.customer}</p>
                          <p className="text-xs text-muted-foreground">
                            {order.quantity} unit{order.quantity > 1 ? "s" : ""} • {order.date}
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {order.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {recentOrders.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">No recent orders</p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={() => onEditProduct(product)}>
              <Edit3 className="w-4 h-4 mr-1" />
              Edit Product
            </Button>
            <Button
              variant={product.status === "out" ? "default" : "outline"}
              className="flex-1"
              onClick={() => onEditProduct(product)}
            >
              <Package className="w-4 h-4 mr-1" />
              {product.status === "out" ? "Restock" : "Update Stock"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
