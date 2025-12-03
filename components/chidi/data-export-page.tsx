"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Download, FileText, Users, Package, ShoppingCart, Calendar, CheckCircle } from "lucide-react"

interface DataExportPageProps {
  onBack: () => void
  products: any[]
  customers: any[]
  orders: any[]
}

export function DataExportPage({ onBack, products, customers, orders }: DataExportPageProps) {
  const [selectedData, setSelectedData] = useState({
    products: true,
    customers: true,
    orders: true,
    analytics: false,
    templates: false,
    settings: false,
  })

  const [exportFormat, setExportFormat] = useState<"json" | "csv">("json")
  const [isExporting, setIsExporting] = useState(false)
  const [exportComplete, setExportComplete] = useState(false)

  const dataTypes = [
      const safeOrders = orders.filter(Boolean)
    {
      key: "products",
      label: "Products",
      description: "Product catalog, prices, and inventory",
      icon: Package,
      count: products.length,
    },
    {
      key: "customers",
      label: "Customers",
      description: "Customer information and contact details",
      icon: Users,
      count: customers.length,
    },
    {
      key: "orders",
      label: "Orders",
      description: "Order history and transaction data",
      icon: ShoppingCart,
        count: safeOrders.length,
    },
    {
      key: "analytics",
      label: "Analytics",
      description: "Revenue reports and business metrics",
      icon: FileText,
      count: 12,
    },
    {
      key: "templates",
      label: "Templates",
      description: "Message templates and auto-responses",
      icon: FileText,
      count: 8,
    },
    {
      key: "settings",
      label: "Settings",
      description: "Business hours and configuration",
      icon: FileText,
      count: 1,
    },
  ]

  const handleDataSelection = (key: string, checked: boolean) => {
    setSelectedData((prev) => ({ ...prev, [key]: checked }))
  }

  const generateExportData = () => {
    const exportData: any = {}

    if (selectedData.products) {
      exportData.products = products
    }

    if (selectedData.customers) {
      exportData.customers = customers
    }

    if (selectedData.orders) {
      exportData.orders = orders
    }

    if (selectedData.analytics) {
      exportData.analytics = {
        totalRevenue: 45250,
        totalOrders: orders.length,
          totalCustomers: customers.length,
          totalOrders: safeOrders.length,
        averageOrderValue: 125.5,
        topProducts: products.slice(0, 5),
        monthlyRevenue: [3200, 4100, 3800, 4500, 5200, 4800],
      }
    }

    if (selectedData.templates) {
      exportData.templates = [
        { category: "greeting", text: "Hello! How can I help you today?" },
        { category: "pricing", text: "Our prices are competitive and include free shipping!" },
        { category: "availability", text: "Let me check our current stock for you." },
      ]
    }

    if (selectedData.settings) {
      exportData.settings = {
        businessHours: {
          monday: { open: "09:00", close: "18:00", isOpen: true },
          tuesday: { open: "09:00", close: "18:00", isOpen: true },
          wednesday: { open: "09:00", close: "18:00", isOpen: true },
          thursday: { open: "09:00", close: "18:00", isOpen: true },
          friday: { open: "09:00", close: "18:00", isOpen: true },
          saturday: { open: "10:00", close: "16:00", isOpen: true },
          sunday: { open: "10:00", close: "16:00", isOpen: false },
        },
        notifications: {
          stockAlerts: true,
          newMessages: true,
          dailySummary: false,
        },
      }
    }

    return exportData
  }

  const downloadFile = (data: any, filename: string, type: string) => {
    const blob = new Blob([data], { type })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleExport = async () => {
    setIsExporting(true)

    // Simulate export process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const exportData = generateExportData()
    const timestamp = new Date().toISOString().split("T")[0]

    if (exportFormat === "json") {
      const jsonData = JSON.stringify(exportData, null, 2)
      downloadFile(jsonData, `chidi-backup-${timestamp}.json`, "application/json")
    } else {
      // Convert to CSV format for simple data
      let csvContent = ""

      if (selectedData.products) {
        csvContent += "Products\n"
        csvContent += "Name,Price,Stock,Category\n"
        products.forEach((product) => {
          csvContent += `"${product.name}","${product.price}","${product.stock}","${product.category}"\n`
        })
        csvContent += "\n"
      }

      if (selectedData.customers) {
        csvContent += "Customers\n"
        csvContent += "Name,Email,Phone,Total Orders\n"
        customers.forEach((customer) => {
          csvContent += `"${customer.name}","${customer.email}","${customer.phone}","${customer.totalOrders}"\n`
        })
        csvContent += "\n"
      }

      if (selectedData.orders) {
        csvContent += "Orders\n"
        csvContent += "ID,Customer,Total,Status,Date\n"
          safeOrders.forEach((order) => {
          csvContent += `"${order.id}","${order.customerName}","${order.total}","${order.status}","${order.date}"\n`
        })
      }

      downloadFile(csvContent, `chidi-backup-${timestamp}.csv`, "text/csv")
    }

    setIsExporting(false)
    setExportComplete(true)

    // Reset after 3 seconds
    setTimeout(() => setExportComplete(false), 3000)
  }

  const selectedCount = Object.values(selectedData).filter(Boolean).length
  const hasSelection = selectedCount > 0

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-lg font-semibold">Export Data</h2>
          <p className="text-sm text-muted-foreground">Backup your business data</p>
        </div>
      </div>

      {/* Export Format Selection */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Export Format</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Button
              variant={exportFormat === "json" ? "default" : "outline"}
              size="sm"
              onClick={() => setExportFormat("json")}
            >
              JSON
            </Button>
            <Button
              variant={exportFormat === "csv" ? "default" : "outline"}
              size="sm"
              onClick={() => setExportFormat("csv")}
            >
              CSV
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            {exportFormat === "json"
              ? "Complete data structure with all relationships preserved"
              : "Simplified format compatible with spreadsheet applications"}
          </p>
        </CardContent>
      </Card>

      {/* Data Selection */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Select Data to Export</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {dataTypes.map((dataType) => {
            const Icon = dataType.icon
            return (
              <div key={dataType.key} className="flex items-center space-x-3">
                <Checkbox
                  id={dataType.key}
                  checked={selectedData[dataType.key as keyof typeof selectedData]}
                  onCheckedChange={(checked) => handleDataSelection(dataType.key, checked as boolean)}
                />
                <div className="flex items-center gap-3 flex-1">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1">
                    <label htmlFor={dataType.key} className="text-sm font-medium cursor-pointer">
                      {dataType.label}
                    </label>
                    <p className="text-xs text-muted-foreground">{dataType.description}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{dataType.count} items</span>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Export Summary */}
      {hasSelection && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">
                  {selectedCount} data type{selectedCount !== 1 ? "s" : ""} selected
                </p>
                <p className="text-xs text-muted-foreground">Export as {exportFormat.toUpperCase()} file</p>
              </div>
              <Button onClick={handleExport} disabled={isExporting || !hasSelection} className="min-w-[120px]">
                {isExporting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Exporting...
                  </>
                ) : exportComplete ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Complete!
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Export Info */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Backup Information</span>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Exports include all data up to the current date</p>
              <p>• Files are generated locally and not stored on our servers</p>
              <p>• Regular backups help protect your business data</p>
              <p>• Exported data can be imported into other business tools</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
