"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
  Phone,
  User,
  Bot,
  Sparkles,
  ShoppingCart,
} from "lucide-react"
import { analyzeCustomerMessage } from "@/lib/ai-engine"

interface Conversation {
  id: number
  customer: string
  message: string
  reply: string
  timestamp: string
  status?: "new" | "replied" | "resolved"
  platform?: "whatsapp" | "instagram"
  customerInfo?: {
    phone?: string
    orders?: number
    lastOrder?: string
  }
}

interface ConversationsPageProps {
  conversations: Conversation[]
  customers: any[]
  products: any[]
  onCreateOrder: () => void
  onUpdateConversations: (conversations: Conversation[]) => void
}

export function ConversationsPage({
  conversations,
  customers,
  products,
  onCreateOrder,
  onUpdateConversations,
}: ConversationsPageProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [replyText, setReplyText] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")
  const [aiAnalysis, setAiAnalysis] = useState<any>(null)
  const [showAiSuggestion, setShowAiSuggestion] = useState(false)

  const enhancedConversations = conversations.map((conv) => ({
    ...conv,
    status: conv.status || (conv.reply ? "replied" : "new"),
    platform: conv.platform || "whatsapp",
    customerInfo: conv.customerInfo || {
      phone: "+234 801 234 5678",
      orders: Math.floor(Math.random() * 10) + 1,
      lastOrder: "2 days ago",
    },
  }))

  const filteredConversations = enhancedConversations.filter((conv) => {
    const matchesSearch =
      conv.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.message.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = activeFilter === "all" || conv.status === activeFilter
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-red-100 text-red-800 border-red-200"
      case "replied":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new":
        return <AlertCircle className="w-3 h-3" />
      case "replied":
        return <MessageSquare className="w-3 h-3" />
      case "resolved":
        return <CheckCircle className="w-3 h-3" />
      default:
        return <Clock className="w-3 h-3" />
    }
  }

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "whatsapp":
        return "bg-green-500"
      case "instagram":
        return "bg-pink-500"
      default:
        return "bg-gray-500"
    }
  }

  const handleSelectConversation = (conv: Conversation) => {
    setSelectedConversation(conv)
    // Analyze the customer message with AI
    const analysis = analyzeCustomerMessage(conv.message, products)
    setAiAnalysis(analysis)

    // Auto-generate suggested reply if AI detected intent
    if (analysis.intent !== "general_inquiry" && analysis.suggestedResponse) {
      setReplyText(analysis.suggestedResponse)
      setShowAiSuggestion(true)
    }
  }

  const handleSendReply = () => {
    if (replyText.trim() && selectedConversation) {
      // Update conversation with reply
      const updatedConversations = conversations.map((conv) =>
        conv.id === selectedConversation.id ? { ...conv, reply: replyText, status: "replied" as const } : conv,
      )
      onUpdateConversations(updatedConversations)

      setReplyText("")
      setShowAiSuggestion(false)
      setSelectedConversation({ ...selectedConversation, reply: replyText, status: "replied" })
    }
  }

  const handleCreateOrderFromConversation = () => {
    if (aiAnalysis?.detectedProducts && aiAnalysis.detectedProducts.length > 0) {
      // This would trigger the order creation flow with pre-filled product data
      onCreateOrder()

      // Mark conversation as resolved
      const updatedConversations = conversations.map((conv) =>
        conv.id === selectedConversation?.id ? { ...conv, status: "resolved" as const } : conv,
      )
      onUpdateConversations(updatedConversations)
    }
  }

  const quickReplies = [
    "Thank you for your message! I'll get back to you shortly.",
    "Yes, we have that item in stock. Would you like to place an order?",
    "Our delivery takes 1-2 business days within Lagos.",
    "We offer a 7-day return policy for all items.",
    "Let me check our current stock and get back to you.",
  ]

  if (selectedConversation) {
    return (
      <div className="h-full bg-background flex flex-col">
        {/* Header */}
        <div className="bg-background border-b px-6 py-4 flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="text-sm">{selectedConversation.customer[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{selectedConversation.customer}</span>
              <div className={`w-3 h-3 rounded-full ${getPlatformColor(selectedConversation.platform)}`} />
            </div>
            <Badge className={`text-xs ${getStatusColor(selectedConversation.status)}`}>
              {getStatusIcon(selectedConversation.status)}
              <span className="ml-1 capitalize">{selectedConversation.status}</span>
            </Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setSelectedConversation(null)}>
            Back to List
          </Button>
        </div>

        {/* Content Area */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 overflow-hidden">
          {/* Left: Conversation Thread */}
          <div className="lg:col-span-2 flex flex-col">
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-6">
                {/* Customer Message */}
                <div className="flex gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="text-sm">{selectedConversation.customer[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-muted rounded-lg p-4">
                      <p className="text-sm">{selectedConversation.message}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">{selectedConversation.timestamp}</p>
                  </div>
                </div>

                {/* CHIDI Reply */}
                {selectedConversation.reply && (
                  <div className="flex gap-3 flex-row-reverse">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-primary/10 rounded-lg p-4">
                        <p className="text-sm">{selectedConversation.reply}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 text-right">Sent by CHIDI</p>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Reply Interface */}
            <div className="border-t pt-4 mt-4 space-y-3">
              {showAiSuggestion && (
                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600 mt-0.5" />
                  <p className="text-xs text-blue-800 dark:text-blue-200">
                    AI suggested this response based on the customer's inquiry
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <Textarea
                  value={replyText}
                  onChange={(e) => {
                    setReplyText(e.target.value)
                    setShowAiSuggestion(false)
                  }}
                  placeholder="Type your reply..."
                  className="flex-1 min-h-[80px]"
                />
                <Button onClick={handleSendReply} disabled={!replyText.trim()} size="lg">
                  <Send className="w-4 h-4" />
                </Button>
              </div>

              {/* Quick Replies */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Quick Replies:</p>
                <div className="flex flex-wrap gap-2">
                  {quickReplies.slice(0, 3).map((reply, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs bg-transparent"
                      onClick={() => {
                        setReplyText(reply)
                        setShowAiSuggestion(false)
                      }}
                    >
                      {reply.substring(0, 30)}...
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: AI Analysis & Customer Info */}
          <div className="space-y-4">
            {/* AI Analysis Card */}
            {aiAnalysis && (
              <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-sm">AI Analysis</h3>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Intent Detected:</p>
                      <Badge variant="secondary" className="mt-1 capitalize">
                        {aiAnalysis.intent.replace(/_/g, " ")}
                      </Badge>
                    </div>

                    {aiAnalysis.detectedProducts && aiAnalysis.detectedProducts.length > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Products Mentioned:</p>
                        {aiAnalysis.detectedProducts.map((product: any, idx: number) => (
                          <div key={idx} className="text-xs bg-background rounded p-2 mb-1">
                            {product.name} - {product.price}
                          </div>
                        ))}
                      </div>
                    )}

                    {aiAnalysis.confidence && (
                      <div>
                        <p className="text-xs text-muted-foreground">Confidence:</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-2 bg-background rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600" style={{ width: `${aiAnalysis.confidence * 100}%` }} />
                          </div>
                          <span className="text-xs font-medium">{Math.round(aiAnalysis.confidence * 100)}%</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {aiAnalysis.intent === "product_inquiry" && aiAnalysis.detectedProducts.length > 0 && (
                    <Button size="sm" className="w-full" onClick={handleCreateOrderFromConversation}>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Create Order
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Customer Info Card */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback>{selectedConversation.customer[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{selectedConversation.customer}</h3>
                    <p className="text-xs text-muted-foreground">Customer</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{selectedConversation.customerInfo?.phone}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-xl font-bold">{selectedConversation.customerInfo?.orders}</div>
                      <div className="text-xs text-muted-foreground">Total Orders</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-sm font-semibold">{selectedConversation.customerInfo?.lastOrder}</div>
                      <div className="text-xs text-muted-foreground">Last Order</div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 bg-transparent" size="sm">
                    <User className="w-4 h-4 mr-1" />
                    View Profile
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent" size="sm">
                    <Phone className="w-4 h-4 mr-1" />
                    Call
                  </Button>
                </div>

                <Button
                  variant="secondary"
                  className="w-full"
                  size="sm"
                  onClick={() => {
                    const updatedConversations = conversations.map((conv) =>
                      conv.id === selectedConversation.id ? { ...conv, status: "resolved" as const } : conv,
                    )
                    onUpdateConversations(updatedConversations)
                    setSelectedConversation(null)
                  }}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Resolved
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Customer Conversations</h1>
          <p className="text-muted-foreground text-sm">Manage all customer inquiries from WhatsApp and Instagram</p>
        </div>

        {/* Search and Filter */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            {["all", "new", "replied", "resolved"].map((filter) => (
              <Button
                key={filter}
                variant={activeFilter === filter ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(filter)}
                className="capitalize"
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>

        {/* Conversations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredConversations.map((conv) => (
            <Card
              key={conv.id}
              className="cursor-pointer hover:shadow-md transition-all"
              onClick={() => handleSelectConversation(conv)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback>{conv.customer[0]}</AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${getPlatformColor(conv.platform)}`}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold truncate">{conv.customer}</h3>
                      <Badge className={`text-xs ${getStatusColor(conv.status)}`}>{getStatusIcon(conv.status)}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate mb-2">{conv.message}</p>
                    {conv.reply && (
                      <div className="flex items-center gap-1 text-xs text-primary">
                        <Bot className="w-3 h-3" />
                        <span className="truncate">CHIDI: {conv.reply}</span>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">{conv.timestamp}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredConversations.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No conversations found</p>
          </div>
        )}
      </div>
    </div>
  )
}
