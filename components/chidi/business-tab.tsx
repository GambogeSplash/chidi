"use client"

import { useState } from "react"
import { Package, ShoppingCart, BarChart3, Users } from "lucide-react"
import { ProductsTab } from "./products-tab"
import { OrdersTab } from "./orders-tab"
import { CustomersTab } from "./customers-tab"
import { RevenueDashboardPage } from "./revenue-dashboard-page"

interface BusinessTabProps {
  products: any[]
  customers: any[]
  orders: any[]
  onAddProduct: () => void
  onEditProduct: (product: any) => void
  onViewProduct: (product: any) => void
  onAddCustomer: () => void
  onViewCustomer: (customer: any) => void
  onCreateOrder: () => void
  onViewOrder: (order: any) => void
  onUpdateProduct: (productId: string, updates: any) => void
  onUpdateOrder: (orderId: string, updates: any) => void
}

export function BusinessTab({
  products,
  customers,
  orders,
  onAddProduct,
  onEditProduct,
  onViewProduct,
  onAddCustomer,
  onViewCustomer,
  onCreateOrder,
  onViewOrder,
  onUpdateProduct,
  onUpdateOrder,
}: BusinessTabProps) {
  const [activeBusinessTab, setActiveBusinessTab] = useState("products")

  return (
    <div className="flex flex-col h-full">
      <div className="bg-card border-b border-border">
        <div className="flex items-center justify-around py-2 px-4">
          <button
            onClick={() => setActiveBusinessTab("products")}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
              activeBusinessTab === "products" ? "text-primary bg-primary/10" : "text-muted-foreground"
            }`}
          >
            <Package className="w-4 h-4" />
            <span className="text-xs font-medium">Products</span>
          </button>
          <button
            onClick={() => setActiveBusinessTab("orders")}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
              activeBusinessTab === "orders" ? "text-primary bg-primary/10" : "text-muted-foreground"
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="text-xs font-medium">Orders</span>
          </button>
          <button
            onClick={() => setActiveBusinessTab("customers")}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
              activeBusinessTab === "customers" ? "text-primary bg-primary/10" : "text-muted-foreground"
            }`}
          >
            <Users className="w-4 h-4" />
            <span className="text-xs font-medium">Customers</span>
          </button>
          <button
            onClick={() => setActiveBusinessTab("revenue")}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
              activeBusinessTab === "revenue" ? "text-primary bg-primary/10" : "text-muted-foreground"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span className="text-xs font-medium">Revenue</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeBusinessTab === "products" && (
          <ProductsTab
            products={products}
            onAddProduct={onAddProduct}
            onEditProduct={onEditProduct}
            onViewProduct={onViewProduct}
            onUpdateProduct={onUpdateProduct}
          />
        )}
        {activeBusinessTab === "orders" && (
          <OrdersTab
            orders={orders}
            customers={customers}
            products={products}
            onCreateOrder={onCreateOrder}
            onViewOrder={onViewOrder}
            onUpdateOrder={onUpdateOrder}
          />
        )}
        {activeBusinessTab === "customers" && (
          <CustomersTab customers={customers} onAddCustomer={onAddCustomer} onViewCustomer={onViewCustomer} />
        )}
        {activeBusinessTab === "revenue" && (
          <RevenueDashboardPage orders={orders} products={products} customers={customers} />
        )}
      </div>
    </div>
  )
}
