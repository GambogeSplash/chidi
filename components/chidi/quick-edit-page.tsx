"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, AlertTriangle, Package, ArrowLeft } from "lucide-react"

interface Product {
  id: number
  name: string
  stock: number
  price: string
  status: string
}

interface QuickEditPageProps {
  onBack: () => void
  product: Product | null
  onUpdateProduct: (product: Product) => void
}

export function QuickEditPage({ onBack, product, onUpdateProduct }: QuickEditPageProps) {
  const [stockValue, setStockValue] = useState("")
  const [restockCost, setRestockCost] = useState("")

  const getRestockSuggestions = (product: Product | null) => {
    if (!product) return []

    const suggestions = [
      { amount: 10, reason: "Weekly average", priority: "low" },
      { amount: 20, reason: "Recommended", priority: "medium" },
      { amount: 50, reason: "Bulk discount", priority: "high" },
    ]

    return suggestions
  }

  const suggestions = getRestockSuggestions(product)

  const handleSave = () => {
    if (product && stockValue) {
      const stockNum = Number.parseInt(stockValue)
      const updatedProduct = {
        ...product,
        stock: stockNum,
        status: stockNum > 10 ? "good" : stockNum > 0 ? "low" : "out",
      }

      onUpdateProduct(updatedProduct)
      onBack()
    }
  }

  const handleSuggestionClick = (amount: number) => {
    setStockValue(amount.toString())
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-green-100 text-green-800 border-green-200"
      case "medium":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "low":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <Package className="w-5 h-5" />
        <h1 className="text-lg font-semibold">Restock Product</h1>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="space-y-6 max-w-md mx-auto">
          {/* Product Info */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{product?.name || "No product selected"}</p>
                <p className="text-sm text-muted-foreground">Current stock: {product?.stock || 0} units</p>
              </div>
              {product?.status === "out" && (
                <Badge className="bg-red-100 text-red-800 border-red-200">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Out of Stock
                </Badge>
              )}
            </div>
          </div>

          {/* Restock Suggestions */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Quick Restock Options</Label>
            <div className="grid grid-cols-3 gap-3">
              {suggestions.map((suggestion, index) => (
                <Card
                  key={index}
                  className={`cursor-pointer hover:shadow-sm transition-shadow ${getPriorityColor(suggestion.priority)}`}
                  onClick={() => handleSuggestionClick(suggestion.amount)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-lg font-bold">{suggestion.amount}</div>
                    <div className="text-xs">{suggestion.reason}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Manual Stock Input */}
          <div className="space-y-2">
            <Label htmlFor="stock" className="text-base font-medium">
              New Stock Count
            </Label>
            <Input
              id="stock"
              type="number"
              value={stockValue}
              onChange={(e) => setStockValue(e.target.value)}
              placeholder="Enter stock count"
              className="h-12 text-base"
            />
          </div>

          {/* Cost Tracking */}
          <div className="space-y-2">
            <Label htmlFor="cost" className="text-base font-medium">
              Restock Cost (Optional)
            </Label>
            <Input
              id="cost"
              type="number"
              value={restockCost}
              onChange={(e) => setRestockCost(e.target.value)}
              placeholder="Enter total cost"
              className="h-12 text-base"
            />
          </div>

          {/* Stock Level Indicator */}
          {stockValue && (
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium">New stock level: {stockValue} units</p>
                  <p className="text-sm text-muted-foreground">
                    Status will be:{" "}
                    {Number.parseInt(stockValue) > 10
                      ? "Good Stock"
                      : Number.parseInt(stockValue) > 0
                        ? "Low Stock"
                        : "Out of Stock"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onBack} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1" disabled={!product || !stockValue}>
              Update Stock
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
