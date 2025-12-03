"use client"

import { useState } from "react"
import { Search, Filter, Plus, MoreVertical, Package, AlertTriangle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

interface CatalogTabProps {
  products: any[]
  onAddProduct: () => void
  onEditProduct: (product: any) => void
  onViewProduct: (product: any) => void
  onBulkExport: () => void
}

export function CatalogTab({ products, onAddProduct, onEditProduct, onViewProduct, onBulkExport }: CatalogTabProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])

  const categories = ["all", "electronics", "clothing", "accessories", "home"]

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    )
  }

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: "Out of Stock", color: "destructive", icon: AlertTriangle }
    if (stock <= 5) return { label: "Low Stock", color: "warning", icon: AlertTriangle }
    return { label: "In Stock", color: "success", icon: CheckCircle }
  }

  return (
    <div className="flex flex-col bg-card rounded-lg border border-border overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-border bg-card/50">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex-1 sm:flex-none">
              <Filter className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Filter</span>
            </Button>
            <Button onClick={onAddProduct} className="flex-1 sm:flex-none">
              <Plus className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Add Product</span>
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="flex gap-2 flex-wrap mt-4">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category}
              </Button>
            ))}
          </div>
        )}

        {selectedProducts.length > 0 && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
            <span className="text-sm font-medium">{selectedProducts.length} selected</span>
            <Button size="sm" variant="outline" onClick={onBulkExport} className="w-full sm:w-auto bg-transparent">
              Export Selected
            </Button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => {
            const stockStatus = getStockStatus(product.stock)
            const StockIcon = stockStatus.icon

            return (
              <div
                key={product.id}
                className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative">
                  <div className="absolute top-2 left-2 z-10">
                    <Checkbox
                      checked={selectedProducts.includes(product.id)}
                      onCheckedChange={() => toggleProductSelection(product.id)}
                      className="bg-white/80 backdrop-blur-sm"
                    />
                  </div>
                  <div className="absolute top-2 right-2 z-10">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditProduct(product)}
                      className="bg-white/80 backdrop-blur-sm h-8 w-8 p-0"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>

                  <div
                    className="aspect-square bg-muted flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => onViewProduct(product)}
                  >
                    {product.image ? (
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="w-12 h-12 text-muted-foreground" />
                    )}
                  </div>
                </div>

                <div className="p-3 sm:p-4">
                  <h3
                    className="font-medium text-sm mb-2 line-clamp-2 cursor-pointer hover:text-primary transition-colors"
                    onClick={() => onViewProduct(product)}
                  >
                    {product.name}
                  </h3>
                  <p className="text-xl font-bold text-primary mb-3">{product.price}</p>

                  {product.variants && product.variants.length > 0 ? (
                    <div className="text-sm text-muted-foreground mb-2">{product.variants.length} variant(s) available</div>
                  ) : null}

                  <div className="flex items-center justify-between">
                    <Badge variant={stockStatus.color as any} className="text-xs">
                      <StockIcon className="w-3 h-3 mr-1" />
                      {product.stock}
                    </Badge>
                    <span className="text-xs text-muted-foreground capitalize">{product.category}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-sm text-muted-foreground mb-6">
              {searchQuery ? "Try adjusting your search" : "Start by adding your first product"}
            </p>
            <Button onClick={onAddProduct} size="lg">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
