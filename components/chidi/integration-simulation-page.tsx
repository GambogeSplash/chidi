"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  MessageSquare,
  Instagram,
  CreditCard,
  Truck,
  Mail,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react"

interface Integration {
  id: string
  name: string
  description: string
  icon: any
  category: "messaging" | "payment" | "shipping" | "marketing"
  status: "connected" | "available" | "simulated"
  features: string[]
  simulationData?: {
    messages?: number
    orders?: number
    revenue?: string
  }
}

interface IntegrationSimulationPageProps {
  onBack: () => void
}

export function IntegrationSimulationPage({ onBack }: IntegrationSimulationPageProps) {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "whatsapp",
      name: "WhatsApp Business",
      description: "Connect with customers via WhatsApp",
      icon: MessageSquare,
      category: "messaging",
      status: "connected",
      features: ["Auto-replies", "Message templates", "Customer support"],
      simulationData: { messages: 45, orders: 12 },
    },
    {
      id: "instagram",
      name: "Instagram Business",
      description: "Manage Instagram DMs and posts",
      icon: Instagram,
      category: "messaging",
      status: "available",
      features: ["DM management", "Story replies", "Product tagging"],
    },
    {
      id: "paystack",
      name: "Paystack",
      description: "Accept online payments",
      icon: CreditCard,
      category: "payment",
      status: "simulated",
      features: ["Card payments", "Bank transfers", "Payment links"],
      simulationData: { orders: 8, revenue: "₦125,000" },
    },
    {
      id: "flutterwave",
      name: "Flutterwave",
      description: "Payment processing platform",
      icon: CreditCard,
      category: "payment",
      status: "available",
      features: ["Multiple payment methods", "International payments", "Recurring billing"],
    },
    {
      id: "dhl",
      name: "DHL Express",
      description: "International shipping",
      icon: Truck,
      category: "shipping",
      status: "simulated",
      features: ["Package tracking", "Shipping rates", "Delivery notifications"],
      simulationData: { orders: 3 },
    },
    {
      id: "gig",
      name: "GIG Logistics",
      description: "Local delivery service",
      icon: Truck,
      category: "shipping",
      status: "available",
      features: ["Same-day delivery", "Package tracking", "Bulk shipping"],
    },
    {
      id: "mailchimp",
      name: "Mailchimp",
      description: "Email marketing automation",
      icon: Mail,
      category: "marketing",
      status: "simulated",
      features: ["Email campaigns", "Customer segmentation", "Analytics"],
      simulationData: { messages: 150 },
    },
  ])

  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const toggleIntegrationStatus = (id: string) => {
    setIntegrations((prev) =>
      prev.map((integration) => {
        if (integration.id === id) {
          let newStatus: "connected" | "available" | "simulated"

          if (integration.status === "available") {
            newStatus = "simulated"
          } else if (integration.status === "simulated") {
            newStatus = "connected"
          } else {
            newStatus = "available"
          }

          return { ...integration, status: newStatus }
        }
        return integration
      }),
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-green-100 text-green-800 border-green-200"
      case "simulated":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "available":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "simulated":
        return <Clock className="w-4 h-4 text-blue-600" />
      case "available":
        return <AlertCircle className="w-4 h-4 text-gray-600" />
      default:
        return null
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "messaging":
        return "bg-blue-100 text-blue-800"
      case "payment":
        return "bg-green-100 text-green-800"
      case "shipping":
        return "bg-purple-100 text-purple-800"
      case "marketing":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredIntegrations =
    selectedCategory === "all"
      ? integrations
      : integrations.filter((integration) => integration.category === selectedCategory)

  const connectedCount = integrations.filter((i) => i.status === "connected").length
  const simulatedCount = integrations.filter((i) => i.status === "simulated").length

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <h1 className="text-lg font-semibold">Integrations</h1>
        <div className="w-16" />
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold text-green-600">{connectedCount}</div>
            <div className="text-xs text-muted-foreground">Connected</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold text-blue-600">{simulatedCount}</div>
            <div className="text-xs text-muted-foreground">Simulated</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold text-gray-600">
              {integrations.length - connectedCount - simulatedCount}
            </div>
            <div className="text-xs text-muted-foreground">Available</div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button
          variant={selectedCategory === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory("all")}
        >
          All
        </Button>
        <Button
          variant={selectedCategory === "messaging" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory("messaging")}
        >
          Messaging
        </Button>
        <Button
          variant={selectedCategory === "payment" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory("payment")}
        >
          Payments
        </Button>
        <Button
          variant={selectedCategory === "shipping" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory("shipping")}
        >
          Shipping
        </Button>
        <Button
          variant={selectedCategory === "marketing" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory("marketing")}
        >
          Marketing
        </Button>
      </div>

      {/* Simulation Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900">Integration Simulation</h3>
              <p className="text-sm text-blue-700 mt-1">
                Test integrations with simulated data before connecting real accounts. Click "Simulate" to see how each
                integration would work with your business.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integrations List */}
      <div className="space-y-3">
        {filteredIntegrations.map((integration) => {
          const IconComponent = integration.icon
          return (
            <Card key={integration.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{integration.name}</h3>
                        <Badge className={`text-xs ${getCategoryColor(integration.category)}`}>
                          {integration.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{integration.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {integration.features.map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(integration.status)}
                    <Badge className={`text-xs ${getStatusColor(integration.status)}`}>{integration.status}</Badge>
                  </div>
                </div>

                {/* Simulation Data */}
                {integration.simulationData && integration.status === "simulated" && (
                  <div className="bg-blue-50 rounded-lg p-3 mb-3">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">Simulation Results</h4>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      {integration.simulationData.messages && (
                        <div>
                          <div className="text-lg font-bold text-blue-600">{integration.simulationData.messages}</div>
                          <div className="text-xs text-blue-700">Messages</div>
                        </div>
                      )}
                      {integration.simulationData.orders && (
                        <div>
                          <div className="text-lg font-bold text-blue-600">{integration.simulationData.orders}</div>
                          <div className="text-xs text-blue-700">Orders</div>
                        </div>
                      )}
                      {integration.simulationData.revenue && (
                        <div>
                          <div className="text-lg font-bold text-blue-600">{integration.simulationData.revenue}</div>
                          <div className="text-xs text-blue-700">Revenue</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    variant={integration.status === "connected" ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleIntegrationStatus(integration.id)}
                    className="flex-1"
                  >
                    {integration.status === "available" && "Simulate"}
                    {integration.status === "simulated" && "Connect"}
                    {integration.status === "connected" && "Disconnect"}
                  </Button>
                  <Button variant="ghost" size="sm">
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
