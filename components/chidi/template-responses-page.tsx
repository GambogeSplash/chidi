"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Plus, Edit, Trash2, MessageSquare, Clock, Package, DollarSign } from "lucide-react"

interface TemplateResponse {
  id: number
  title: string
  message: string
  category: "greeting" | "pricing" | "availability" | "delivery" | "returns" | "custom"
  isActive: boolean
}

interface BusinessRule {
  id: number
  name: string
  condition: string
  response: string
  isActive: boolean
  type: "stock" | "hours" | "customer" | "payment"
}

interface TemplateResponsesPageProps {
  onBack: () => void
}

export function TemplateResponsesPage({ onBack }: TemplateResponsesPageProps) {
  const [activeTab, setActiveTab] = useState<"templates" | "rules">("templates")
  const [templates, setTemplates] = useState<TemplateResponse[]>([
    {
      id: 1,
      title: "Welcome Message",
      message: "Hi! Welcome to our store. How can I help you today?",
      category: "greeting",
      isActive: true,
    },
    {
      id: 2,
      title: "Price Inquiry",
      message: "The price for this item is [PRICE]. Would you like to place an order?",
      category: "pricing",
      isActive: true,
    },
    {
      id: 3,
      title: "Stock Check",
      message: "Let me check our current stock for you. We have [STOCK] units available.",
      category: "availability",
      isActive: true,
    },
    {
      id: 4,
      title: "Delivery Info",
      message: "We deliver within Lagos for ₦2,000. Delivery takes 1-2 business days.",
      category: "delivery",
      isActive: true,
    },
    {
      id: 5,
      title: "Return Policy",
      message: "We offer a 7-day return policy for all items in original condition.",
      category: "returns",
      isActive: true,
    },
  ])

  const [businessRules, setBusinessRules] = useState<BusinessRule[]>([
    {
      id: 1,
      name: "Out of Stock Auto-Reply",
      condition: "When product stock = 0",
      response: "Sorry, this item is currently out of stock. We'll restock soon!",
      isActive: true,
      type: "stock",
    },
    {
      id: 2,
      name: "After Hours Response",
      condition: "Outside business hours (9 AM - 6 PM)",
      response: "Thanks for your message! We're currently closed but will respond first thing tomorrow.",
      isActive: true,
      type: "hours",
    },
    {
      id: 3,
      name: "VIP Customer Greeting",
      condition: "Customer status = VIP",
      response: "Hello valued customer! Thanks for choosing us again. How can we assist you today?",
      isActive: true,
      type: "customer",
    },
    {
      id: 4,
      name: "Payment Reminder",
      condition: "Order unpaid for 24 hours",
      response: "Hi! Just a friendly reminder about your pending order. Would you like to complete payment?",
      isActive: false,
      type: "payment",
    },
  ])

  const [showAddTemplate, setShowAddTemplate] = useState(false)
  const [showAddRule, setShowAddRule] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<TemplateResponse | null>(null)
  const [editingRule, setEditingRule] = useState<BusinessRule | null>(null)

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "greeting":
        return "bg-blue-100 text-blue-800"
      case "pricing":
        return "bg-green-100 text-green-800"
      case "availability":
        return "bg-yellow-100 text-yellow-800"
      case "delivery":
        return "bg-purple-100 text-purple-800"
      case "returns":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRuleTypeIcon = (type: string) => {
    switch (type) {
      case "stock":
        return <Package className="w-4 h-4" />
      case "hours":
        return <Clock className="w-4 h-4" />
      case "customer":
        return <MessageSquare className="w-4 h-4" />
      case "payment":
        return <DollarSign className="w-4 h-4" />
      default:
        return <MessageSquare className="w-4 h-4" />
    }
  }

  const toggleTemplateStatus = (id: number) => {
    setTemplates((prev) => prev.map((t) => (t.id === id ? { ...t, isActive: !t.isActive } : t)))
  }

  const toggleRuleStatus = (id: number) => {
    setBusinessRules((prev) => prev.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r)))
  }

  const deleteTemplate = (id: number) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id))
  }

  const deleteRule = (id: number) => {
    setBusinessRules((prev) => prev.filter((r) => r.id !== id))
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <h1 className="text-lg font-semibold">Templates & Rules</h1>
        <div className="w-16" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <Button
          variant={activeTab === "templates" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("templates")}
        >
          Templates
        </Button>
        <Button variant={activeTab === "rules" ? "default" : "outline"} size="sm" onClick={() => setActiveTab("rules")}>
          Business Rules
        </Button>
      </div>

      {/* Templates Tab */}
      {activeTab === "templates" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Quick replies for common customer questions</p>
            <Button size="sm" onClick={() => setShowAddTemplate(true)}>
              <Plus className="w-4 h-4 mr-1" />
              Add Template
            </Button>
          </div>

          <div className="space-y-3">
            {templates.map((template) => (
              <Card key={template.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{template.title}</h3>
                      <Badge className={`text-xs ${getCategoryColor(template.category)}`}>{template.category}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked={template.isActive} onCheckedChange={() => toggleTemplateStatus(template.id)} />
                      <Button variant="ghost" size="sm" onClick={() => setEditingTemplate(template)}>
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => deleteTemplate(template.id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{template.message}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Business Rules Tab */}
      {activeTab === "rules" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Automated responses based on conditions</p>
            <Button size="sm" onClick={() => setShowAddRule(true)}>
              <Plus className="w-4 h-4 mr-1" />
              Add Rule
            </Button>
          </div>

          <div className="space-y-3">
            {businessRules.map((rule) => (
              <Card key={rule.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getRuleTypeIcon(rule.type)}
                      <h3 className="font-medium">{rule.name}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked={rule.isActive} onCheckedChange={() => toggleRuleStatus(rule.id)} />
                      <Button variant="ghost" size="sm" onClick={() => setEditingRule(rule)}>
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => deleteRule(rule.id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">When:</span> {rule.condition}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Reply:</span> {rule.response}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Add/Edit Template Form */}
      {(showAddTemplate || editingTemplate) && (
        <Card className="fixed inset-4 z-50 bg-background border shadow-lg">
          <CardHeader>
            <CardTitle className="text-base">{editingTemplate ? "Edit Template" : "Add Template"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input placeholder="Template title" />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <select className="w-full p-2 border rounded">
                <option value="greeting">Greeting</option>
                <option value="pricing">Pricing</option>
                <option value="availability">Availability</option>
                <option value="delivery">Delivery</option>
                <option value="returns">Returns</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea placeholder="Template message..." rows={3} />
              <p className="text-xs text-muted-foreground">Use [PRICE], [STOCK], [CUSTOMER_NAME] for dynamic values</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddTemplate(false)
                  setEditingTemplate(null)
                }}
                className="flex-1 bg-transparent"
              >
                Cancel
              </Button>
              <Button className="flex-1">Save Template</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Rule Form */}
      {(showAddRule || editingRule) && (
        <Card className="fixed inset-4 z-50 bg-background border shadow-lg">
          <CardHeader>
            <CardTitle className="text-base">{editingRule ? "Edit Rule" : "Add Business Rule"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Rule Name</Label>
              <Input placeholder="Rule name" />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <select className="w-full p-2 border rounded">
                <option value="stock">Stock Level</option>
                <option value="hours">Business Hours</option>
                <option value="customer">Customer Type</option>
                <option value="payment">Payment Status</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Condition</Label>
              <Input placeholder="When this condition is met..." />
            </div>
            <div className="space-y-2">
              <Label>Auto Response</Label>
              <Textarea placeholder="Send this message..." rows={3} />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddRule(false)
                  setEditingRule(null)
                }}
                className="flex-1 bg-transparent"
              >
                Cancel
              </Button>
              <Button className="flex-1">Save Rule</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
