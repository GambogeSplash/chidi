"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Send, Sparkles, Package, AlertCircle, ImageIcon, Zap, TrendingUp, Users, ShoppingBag } from "lucide-react"
import { VoiceInput } from "@/components/chidi/voice-input"
import {
  analyzeCustomerMessage,
  generateAIResponse,
  getSmartSuggestions,
  getNigerianResponse,
  detectBusinessCommand,
} from "@/lib/ai-engine"

interface HomeTabProps {
  products: any[]
  orders: any[]
  customers: any[]
}

interface Message {
  id: string
  content: string
  sender: "user" | "chidi"
  timestamp: Date
  type?: "text" | "insight" | "action"
  metadata?: any
}

export function HomeTab({ products, orders, customers }: HomeTabProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Good morning! I'm CHIDI, your AI business assistant. I've analyzed your business and I'm ready to help. Here's what I can do for you:",
      sender: "chidi",
      timestamp: new Date(),
      type: "text",
    },
    {
      id: "2",
      content: "capabilities",
      sender: "chidi",
      timestamp: new Date(),
      type: "insight",
      metadata: {
        capabilities: [
          { icon: "📦", label: "Monitor inventory and alert on low stock" },
          { icon: "💬", label: "Auto-respond to customer messages" },
          { icon: "📊", label: "Analyze sales trends and insights" },
          { icon: "🎯", label: "Create orders from conversations" },
        ],
      },
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [personality, setPersonality] = useState<"professional" | "nigerian_genz">("nigerian_genz")

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const timer = setTimeout(() => {
      const lowStockProducts = products.filter((p) => p.stock <= 3)
      if (lowStockProducts.length > 0) {
        const alertMessage: Message = {
          id: `alert-${Date.now()}`,
          content: `I noticed you have ${lowStockProducts.length} product${lowStockProducts.length > 1 ? "s" : ""} running low on stock. Would you like me to show you?`,
          sender: "chidi",
          timestamp: new Date(),
          type: "action",
          metadata: { products: lowStockProducts },
        }
        setMessages((prev) => [...prev, alertMessage])
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [products])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    setTimeout(() => {
      const command = detectBusinessCommand(inputValue)

      if (command.action !== "unknown") {
        handleBusinessCommand(command)
      } else {
        const intent = analyzeCustomerMessage(inputValue)
        const aiResponse = generateAIResponse(intent, { products, businessName: "Your Business" })

        let responseText = aiResponse.message
        if (personality === "nigerian_genz" && intent.type === "availability") {
          const product = products.find((p) => inputValue.toLowerCase().includes(p.name.toLowerCase()))
          if (product && product.stock <= 3) {
            responseText = getNigerianResponse("low_stock", { product: product.name, count: product.stock })
              .replace("{product}", product.name)
              .replace("{count}", product.stock.toString())
          }
        }

        const chidiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: responseText,
          sender: "chidi",
          timestamp: new Date(),
          type: aiResponse.suggestedActions ? "action" : "text",
          metadata: aiResponse.suggestedActions ? { actions: aiResponse.suggestedActions } : undefined,
        }

        setMessages((prev) => [...prev, chidiMessage])
      }

      setIsTyping(false)
    }, 1500)
  }

  const handleBusinessCommand = (command: any) => {
    switch (command.action) {
      case "show_orders": {
        const filteredOrders = filterOrders(orders, command.params)
        const response = generateOrdersResponse(filteredOrders, command.params, personality)

        const chidiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: response.message,
          sender: "chidi",
          timestamp: new Date(),
          type: "action",
          metadata: {
            type: "orders_list",
            orders: filteredOrders.filter(Boolean),
            stats: response.stats,
          },
        }

        setMessages((prev) => [...prev, chidiMessage])
        break
      }

      case "show_customers": {
        const sortedCustomers = sortCustomers(customers, command.params)
        const response = generateCustomersResponse(sortedCustomers, command.params, personality)

        const chidiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: response.message,
          sender: "chidi",
          timestamp: new Date(),
          type: "action",
          metadata: {
            type: "customers_list",
            customers: sortedCustomers,
          },
        }

        setMessages((prev) => [...prev, chidiMessage])
        break
      }

      case "add_product": {
        const response =
          personality === "nigerian_genz"
            ? "Oya boss! Make we add new product. Fill these details sharp sharp!"
            : "I'll help you add a new product. Please provide the following details:"

        const chidiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: response,
          sender: "chidi",
          timestamp: new Date(),
          type: "action",
          metadata: {
            type: "add_product_form",
          },
        }

        setMessages((prev) => [...prev, chidiMessage])
        break
      }

      case "create_order": {
        const response =
          personality === "nigerian_genz"
            ? `Oya let's create order${command.params.customerName ? ` for ${command.params.customerName}` : ""}! Who we dey create order for?`
            : `I'll help you create an order${command.params.customerName ? ` for ${command.params.customerName}` : ""}. Let's get the details:`

        const chidiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: response,
          sender: "chidi",
          timestamp: new Date(),
          type: "action",
          metadata: {
            type: "create_order_form",
            customerName: command.params.customerName,
          },
        }

        setMessages((prev) => [...prev, chidiMessage])
        break
      }

      case "show_analytics": {
        const stats = calculateBusinessStats(orders, products, customers)
        const response =
          personality === "nigerian_genz"
            ? `Boss see your business performance! You don make ₦${stats.totalRevenue.toLocaleString()} 🔥`
            : `Here's your business performance overview. Total revenue: ₦${stats.totalRevenue.toLocaleString()}`

        const chidiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: response,
          sender: "chidi",
          timestamp: new Date(),
          type: "action",
          metadata: {
            type: "analytics",
            stats,
          },
        }

        setMessages((prev) => [...prev, chidiMessage])
        break
      }

      default: {
        const chidiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "I'm not sure what you want me to do. Can you rephrase that?",
          sender: "chidi",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, chidiMessage])
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const smartSuggestions = getSmartSuggestions(messages, products)

  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 p-4 sm:p-6 border-b border-border bg-card flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium">CHIDI AI Assistant</span>
        </div>
        <div className="flex gap-2">
          <Button
            variant={personality === "professional" ? "default" : "outline"}
            size="sm"
            onClick={() => setPersonality("professional")}
          >
            Professional
          </Button>
          <Button
            variant={personality === "nigerian_genz" ? "default" : "outline"}
            size="sm"
            onClick={() => setPersonality("nigerian_genz")}
          >
            Nigerian 🇳🇬
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
            {message.type === "action" && message.metadata?.type === "orders_list" ? (
              <div className="max-w-full space-y-3">
                <div className="rounded-2xl px-4 py-3 bg-muted max-w-md">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-primary-foreground" />
                    </div>
                    <span className="text-xs font-medium">CHIDI</span>
                  </div>
                  <p className="text-sm">{message.content}</p>
                </div>

                <div className="grid gap-3">
                  {message.metadata.stats && (
                    <div className="grid grid-cols-3 gap-2">
                      <Card className="p-3 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                        <div className="text-xs text-muted-foreground">Total</div>
                        <div className="text-lg font-bold text-green-600">{message.metadata.stats.total}</div>
                      </Card>
                      <Card className="p-3 bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800">
                        <div className="text-xs text-muted-foreground">Pending</div>
                        <div className="text-lg font-bold text-yellow-600">{message.metadata.stats.pending}</div>
                      </Card>
                      <Card className="p-3 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                        <div className="text-xs text-muted-foreground">Revenue</div>
                        <div className="text-lg font-bold text-blue-600">₦{message.metadata.stats.revenue}</div>
                      </Card>
                    </div>
                  )}

                  {message.metadata.orders?.slice(0, 5).filter(Boolean).map((order: any) => (
                    <Card key={order.id} className="p-4 hover:border-primary transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium text-sm">{order.orderId}</span>
                        </div>
                        <Badge
                          variant={
                            order.status === "completed"
                              ? "default"
                              : order.status === "pending"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {order.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mb-1">{order.customer}</div>
                      <div className="text-sm font-semibold">{order.total}</div>
                    </Card>
                  ))}
                </div>
              </div>
            ) : message.type === "action" && message.metadata?.type === "customers_list" ? (
              <div className="max-w-full space-y-3">
                <div className="rounded-2xl px-4 py-3 bg-muted max-w-md">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-primary-foreground" />
                    </div>
                    <span className="text-xs font-medium">CHIDI</span>
                  </div>
                  <p className="text-sm">{message.content}</p>
                </div>

                <div className="grid gap-3">
                  {message.metadata.customers?.slice(0, 5).map((customer: any) => (
                    <Card key={customer.id} className="p-4 hover:border-primary transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{customer.name}</div>
                          <div className="text-xs text-muted-foreground">{customer.email}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold">{customer.totalOrders} orders</div>
                          <div className="text-xs text-muted-foreground">{customer.totalSpent}</div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ) : message.type === "action" && message.metadata?.type === "analytics" ? (
              <div className="max-w-full space-y-3">
                <div className="rounded-2xl px-4 py-3 bg-muted max-w-md">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-primary-foreground" />
                    </div>
                    <span className="text-xs font-medium">CHIDI</span>
                  </div>
                  <p className="text-sm">{message.content}</p>
                </div>

                <div className="grid gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <div className="text-xs text-muted-foreground">Total Revenue</div>
                      </div>
                      <div className="text-2xl font-bold text-green-600">
                        ₦{message.metadata.stats.totalRevenue.toLocaleString()}
                      </div>
                    </Card>
                    <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-800">
                      <div className="flex items-center gap-2 mb-2">
                        <ShoppingBag className="w-4 h-4 text-blue-600" />
                        <div className="text-xs text-muted-foreground">Total Orders</div>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">{message.metadata.stats.totalOrders}</div>
                    </Card>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-purple-600" />
                        <div className="text-xs text-muted-foreground">Customers</div>
                      </div>
                      <div className="text-2xl font-bold text-purple-600">{message.metadata.stats.totalCustomers}</div>
                    </Card>
                    <Card className="p-4 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-orange-200 dark:border-orange-800">
                      <div className="flex items-center gap-2 mb-2">
                        <Package className="w-4 h-4 text-orange-600" />
                        <div className="text-xs text-muted-foreground">Products</div>
                      </div>
                      <div className="text-2xl font-bold text-orange-600">{message.metadata.stats.totalProducts}</div>
                    </Card>
                  </div>
                </div>
              </div>
            ) : message.type === "action" && message.metadata?.type === "add_product_form" ? (
              <div className="max-w-md space-y-3">
                <div className="rounded-2xl px-4 py-3 bg-muted">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-primary-foreground" />
                    </div>
                    <span className="text-xs font-medium">CHIDI</span>
                  </div>
                  <p className="text-sm">{message.content}</p>
                </div>

                <Card className="p-4">
                  <div className="space-y-3">
                    <Input placeholder="Product name" />
                    <Input placeholder="Price (e.g., ₦5000)" />
                    <Input placeholder="Stock quantity" type="number" />
                    <Input placeholder="Category" />
                    <Button className="w-full">Add Product</Button>
                  </div>
                </Card>
              </div>
            ) : message.type === "action" && message.metadata?.type === "create_order_form" ? (
              <div className="max-w-md space-y-3">
                <div className="rounded-2xl px-4 py-3 bg-muted">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-primary-foreground" />
                    </div>
                    <span className="text-xs font-medium">CHIDI</span>
                  </div>
                  <p className="text-sm">{message.content}</p>
                </div>

                <Card className="p-4">
                  <div className="space-y-3">
                    {message.metadata.customerName && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Customer:</span> {message.metadata.customerName}
                      </div>
                    )}
                    {!message.metadata.customerName && <Input placeholder="Customer name" />}
                    <Input placeholder="Select product" />
                    <Input placeholder="Quantity" type="number" defaultValue="1" />
                    <Button className="w-full">Create Order</Button>
                  </div>
                </Card>
              </div>
            ) : message.type === "insight" && message.metadata?.briefing ? (
              <div className="max-w-full rounded-2xl p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5 text-blue-600" />
                  <span className="text-lg font-bold">Good morning!</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-background/50 rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-1">Sales Today</div>
                    <div className="text-xl font-bold text-green-600">{message.metadata.summary.sales}</div>
                  </div>
                  <div className="bg-background/50 rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-1">Orders</div>
                    <div className="text-xl font-bold">{message.metadata.summary.orders}</div>
                  </div>
                </div>

                {message.metadata.summary.alerts.length > 0 && (
                  <div className="mb-4 space-y-2">
                    {message.metadata.summary.alerts.map((alert: string, idx: number) => (
                      <div
                        key={idx}
                        className="bg-orange-100 dark:bg-orange-950/20 text-orange-800 dark:text-orange-200 rounded-lg p-3 flex items-center gap-2"
                      >
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">{alert}</span>
                      </div>
                    ))}
                  </div>
                )}

                {message.metadata.topActions.length > 0 && (
                  <div>
                    <div className="text-sm font-medium mb-2">What to do today:</div>
                    <div className="space-y-2">
                      {message.metadata.topActions.map((action: any, idx: number) => (
                        <Button key={idx} variant="outline" size="sm" className="w-full justify-start bg-transparent">
                          <span
                            className={`w-2 h-2 rounded-full mr-2 ${
                              action.priority === "high"
                                ? "bg-red-500"
                                : action.priority === "medium"
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                            }`}
                          />
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : message.type === "insight" && message.metadata?.capabilities ? (
              <div className="max-w-full rounded-2xl p-4 bg-muted border border-border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {message.metadata.capabilities.map((cap: any, idx: number) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-background">
                      <span className="text-2xl">{cap.icon}</span>
                      <p className="text-sm flex-1">{cap.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : message.type === "action" && message.metadata?.actions ? (
              <div className="max-w-[85%] sm:max-w-[80%] space-y-3">
                <div className="rounded-2xl px-4 py-2 bg-muted">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-primary-foreground" />
                    </div>
                    <span className="text-xs font-medium">CHIDI</span>
                  </div>
                  <p className="text-sm">{message.content}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {message.metadata.actions.map((action: any, idx: number) => (
                    <Button key={idx} size="sm" variant="outline">
                      {action.label}
                    </Button>
                  ))}
                </div>
              </div>
            ) : message.type === "action" && message.metadata?.products ? (
              <div className="max-w-[85%] sm:max-w-[80%] space-y-3">
                <div className="rounded-2xl px-4 py-2 bg-muted">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-primary-foreground" />
                    </div>
                    <span className="text-xs font-medium">CHIDI</span>
                  </div>
                  <p className="text-sm">{message.content}</p>
                </div>

                <div className="space-y-2">
                  {message.metadata.products.slice(0, 3).map((product: any) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted border border-border"
                    >
                      <Package className="w-8 h-8 text-orange-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Only {product.stock} unit{product.stock !== 1 ? "s" : ""} left
                        </p>
                      </div>
                      <Button size="sm" variant="outline">
                        Restock
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-4 py-2 ${
                  message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                {message.sender === "chidi" && (
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-primary-foreground" />
                    </div>
                    <span className="text-xs font-medium">CHIDI</span>
                    {message.metadata?.confidence && (
                      <Badge variant="secondary" className="text-xs">
                        {Math.round(message.metadata.confidence * 100)}% confident
                      </Badge>
                    )}
                  </div>
                )}
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-2xl px-4 py-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-primary-foreground" />
                </div>
                <span className="text-xs font-medium">CHIDI</span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex-shrink-0 p-4 sm:p-6 border-t border-border bg-card">
        <div className="mb-3 sm:mb-4">
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">Quick Actions</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {smartSuggestions.slice(0, 4).map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="whitespace-nowrap flex-shrink-0 text-xs sm:text-sm bg-transparent"
                onClick={() => setInputValue(suggestion.message)}
              >
                {suggestion.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 sm:gap-3">
          <div className="w-10">
            <VoiceInput
              onTranscribe={(text) => {
                setInputValue(text)
                setTimeout(() => {
                  handleSendMessage()
                }, 500)
              }}
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 flex-shrink-0 bg-transparent"
            title="Add product by photo (coming soon)"
          >
            <ImageIcon className="w-4 h-4" />
          </Button>
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask CHIDI anything..."
            className="flex-1 text-sm"
          />
          <Button
            onClick={handleSendMessage}
            size="icon"
            disabled={!inputValue.trim()}
            className="h-10 w-10 flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function filterOrders(orders: any[], params: any) {
  let filtered = [...orders]

  if (params.timeframe === "today") {
    const today = new Date().toDateString()
    filtered = filtered.filter((o) => new Date(o.date).toDateString() === today)
  } else if (params.timeframe === "week") {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    filtered = filtered.filter((o) => new Date(o.date) >= weekAgo)
  }

  if (params.status) {
    filtered = filtered.filter((o) => o.status === params.status)
  }

  return filtered
}

function generateOrdersResponse(orders: any[], params: any, personality: string) {
  const total = orders.length
  const pending = orders.filter((o) => o.status === "pending").length
  const revenue = orders
    .reduce((sum, o) => sum + Number.parseFloat(o.total?.replace(/[₦,]/g, "") || "0"), 0)
    .toLocaleString()

  const isNigerian = personality === "nigerian_genz"

  let message = ""
  if (params.timeframe === "today") {
    message = isNigerian
      ? `Boss see your orders for today! You get ${total} orders. ${pending > 0 ? `${pending} still dey wait o!` : "All don complete!"}`
      : `Here are today's orders. You have ${total} orders total${pending > 0 ? `, ${pending} pending` : ""}.`
  } else if (params.timeframe === "week") {
    message = isNigerian
      ? `Omo see as you dey work this week! ${total} orders don enter. Money dey come! 🔥`
      : `This week you've received ${total} orders. Great work!`
  } else {
    message = isNigerian
      ? `Boss you get ${total} orders${params.status === "pending" ? " wey dey wait" : ""}. Make we see them!`
      : `You have ${total} orders${params.status === "pending" ? " pending" : ""}.`
  }

  return {
    message,
    stats: { total, pending, revenue },
  }
}

function sortCustomers(customers: any[], params: any) {
  let sorted = [...customers]

  if (params.sort === "top") {
    sorted = sorted.sort((a, b) => b.totalOrders - a.totalOrders)
  } else if (params.sort === "recent") {
    sorted = sorted.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
  }

  return sorted
}

function generateCustomersResponse(customers: any[], params: any, personality: string) {
  const isNigerian = personality === "nigerian_genz"
  const count = customers.length

  let message = ""
  if (params.sort === "top") {
    message = isNigerian
      ? `Boss see your top ${count} customers wey dey buy pass! These ones dey loyal o! 💪`
      : `Here are your top ${count} customers by order volume. These are your most valuable customers!`
  } else if (params.sort === "recent") {
    message = isNigerian
      ? `See your latest ${count} customers! Fresh customers don land o!`
      : `Here are your ${count} most recent customers. Welcome them!`
  } else {
    message = isNigerian
      ? `Boss you get ${count} customers total. See some of them here!`
      : `You have ${count} customers total. Here's a preview:`
  }

  return { message }
}

function calculateBusinessStats(orders: any[], products: any[], customers: any[]) {
  const totalRevenue = orders.reduce((sum, o) => sum + Number.parseFloat(o.total?.replace(/[₦,]/g, "") || "0"), 0)
  const totalOrders = orders.length
  const totalCustomers = customers.length
  const totalProducts = products.length

  return {
    totalRevenue,
    totalOrders,
    totalCustomers,
    totalProducts,
  }
}
