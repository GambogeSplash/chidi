// AI Conversation Engine - Simulates intelligent customer interaction
export interface CustomerIntent {
  type: "product_inquiry" | "price_check" | "availability" | "order_status" | "return_policy" | "delivery" | "general"
  confidence: number
  entities: {
    productName?: string
    location?: string
    orderNumber?: string
  }
  sentiment?: Sentiment
  classification?: MessageClassification
}

export interface AIResponse {
  message: string
  suggestedActions?: Array<{
    label: string
    action: string
  }>
  requiresHumanReview: boolean
}

export function analyzeCustomerMessage(message: string): CustomerIntent {
  const lowerMessage = message.toLowerCase()

  // Product inquiry detection
  if (lowerMessage.includes("do you have") || lowerMessage.includes("available") || lowerMessage.includes("in stock")) {
    const productMatch = extractProductName(message)
    return {
      type: "availability",
      confidence: 0.9,
      entities: { productName: productMatch },
    }
  }

  // Price check
  if (lowerMessage.includes("how much") || lowerMessage.includes("price") || lowerMessage.includes("cost")) {
    const productMatch = extractProductName(message)
    return {
      type: "price_check",
      confidence: 0.85,
      entities: { productName: productMatch },
    }
  }

  // Delivery inquiry
  if (lowerMessage.includes("delivery") || lowerMessage.includes("shipping") || lowerMessage.includes("deliver to")) {
    const locationMatch = extractLocation(message)
    return {
      type: "delivery",
      confidence: 0.9,
      entities: { location: locationMatch },
    }
  }

  // Return policy
  if (lowerMessage.includes("return") || lowerMessage.includes("refund") || lowerMessage.includes("exchange")) {
    return {
      type: "return_policy",
      confidence: 0.95,
      entities: {},
    }
  }

  // Order status
  if (lowerMessage.includes("order") || lowerMessage.includes("my purchase") || lowerMessage.includes("tracking")) {
    const orderMatch = extractOrderNumber(message)
    return {
      type: "order_status",
      confidence: 0.8,
      entities: { orderNumber: orderMatch },
    }
  }

  // Sentiment analysis
  const sentiment = analyzeSentiment(message)

  // Message classification
  const classification = classifyMessage(message, sentiment)

  return {
    type: "general",
    confidence: 0.5,
    entities: {},
    sentiment,
    classification,
  }
}

export type Sentiment = "positive" | "neutral" | "negative" | "angry" | "urgent"

export interface MessageClassification {
  category: "spam" | "inquiry" | "complaint" | "order" | "priority"
  priority: "high" | "medium" | "low"
  requiresHuman: boolean
}

export function analyzeSentiment(message: string): Sentiment {
  const lower = message.toLowerCase()

  if (lower.match(/angry|upset|stupid|idiot|useless|hate|worst|scam/)) return "angry"
  if (lower.match(/urgent|asap|now|emergency|fast|quick/)) return "urgent"
  if (lower.match(/love|great|amazing|thanks|thank you|good|best|happy/)) return "positive"
  if (lower.match(/bad|slow|wrong|broken|missing|late|disappointed/)) return "negative"

  return "neutral"
}

export function classifyMessage(message: string, sentiment: Sentiment): MessageClassification {
  const lower = message.toLowerCase()

  // Spam detection
  if (lower.match(/winner|lottery|prize|click here|subscribe|promo code|investment/)) {
    return { category: "spam", priority: "low", requiresHuman: false }
  }

  // Priority detection
  if (sentiment === "angry" || sentiment === "urgent" || lower.includes("refund") || lower.includes("complaint")) {
    return { category: "priority", priority: "high", requiresHuman: true }
  }

  // Order related
  if (lower.match(/order|buy|purchase|price|cost|how much|stock|available/)) {
    return { category: "order", priority: "medium", requiresHuman: false }
  }

  // Complaint
  if (sentiment === "negative" || lower.match(/issue|problem|error|fail|didn't get/)) {
    return { category: "complaint", priority: "high", requiresHuman: true }
  }

  return { category: "inquiry", priority: "medium", requiresHuman: false }
}

export function generateAIResponse(
  intent: CustomerIntent,
  businessData: {
    products: any[]
    businessName?: string
    returnPolicy?: string
  },
): AIResponse {
  const { type, entities } = intent

  switch (type) {
    case "availability":
      if (entities.productName) {
        const product = findProduct(entities.productName, businessData.products)
        if (product) {
          if (product.stock > 0) {
            return {
              message: `Yes! We have ${product.name} in stock. We currently have ${product.stock} units available at ${product.price}. Would you like to place an order?`,
              suggestedActions: [
                { label: "Create Order", action: "create_order" },
                { label: "View Product", action: "view_product" },
              ],
              requiresHumanReview: false,
            }
          } else {
            return {
              message: `I'm sorry, ${product.name} is currently out of stock. We're expecting new inventory soon. Would you like me to notify you when it's back in stock?`,
              suggestedActions: [{ label: "Notify When Available", action: "set_notification" }],
              requiresHumanReview: false,
            }
          }
        }
      }
      return {
        message:
          "I'd be happy to help you check our inventory! Could you please tell me which specific product you're looking for?",
        requiresHumanReview: false,
      }

    case "price_check":
      if (entities.productName) {
        const product = findProduct(entities.productName, businessData.products)
        if (product) {
          return {
            message: `${product.name} is priced at ${product.price}. ${product.stock > 0 ? "It's currently in stock!" : "Unfortunately it's out of stock right now."}`,
            suggestedActions: product.stock > 0 ? [{ label: "Create Order", action: "create_order" }] : [],
            requiresHumanReview: false,
          }
        }
      }
      return {
        message: "I'd be happy to help you with pricing! Which product are you interested in?",
        requiresHumanReview: false,
      }

    case "delivery":
      const location = entities.location || "your location"
      return {
        message: `We deliver to ${location}! Delivery within Lagos takes 1-2 business days (₦2,000). Outside Lagos takes 2-3 business days (₦3,500). Orders above ₦50,000 get free delivery!`,
        suggestedActions: [{ label: "Create Order", action: "create_order" }],
        requiresHumanReview: false,
      }

    case "return_policy":
      return {
        message: `We offer a 7-day return policy for all items in original condition with receipt. Electronics come with a 14-day return window. Returns are hassle-free - just contact us and we'll arrange pickup.`,
        requiresHumanReview: false,
      }

    case "order_status":
      if (entities.orderNumber) {
        return {
          message: `Let me check the status of order ${entities.orderNumber} for you. One moment please...`,
          suggestedActions: [{ label: "View Order Details", action: "view_order" }],
          requiresHumanReview: true,
        }
      }
      return {
        message: `I'd be happy to check your order status! Could you please provide your order number? It starts with "ORD-"`,
        requiresHumanReview: false,
      }

    case "general":
    default:
      return {
        message: `Thank you for reaching out to ${businessData.businessName || "us"}! I'm CHIDI, your AI assistant. I can help you with product inquiries, orders, delivery information, and more. How can I assist you today?`,
        requiresHumanReview: false,
      }
  }
}

function findProduct(query: string, products: any[]): any | null {
  const lowerQuery = query.toLowerCase()
  return (
    products.find((p) => p.name.toLowerCase().includes(lowerQuery)) ||
    products.find((p) => lowerQuery.includes(p.name.toLowerCase()))
  )
}

function extractProductName(message: string): string | undefined {
  // Simple extraction - in production, would use NER
  const words = message.split(" ")
  const productKeywords = ["dress", "sneakers", "handbag", "earbuds", "shoe", "bag"]
  const found = words.find((word) => productKeywords.some((kw) => word.toLowerCase().includes(kw)))
  return found
}

function extractLocation(message: string): string | undefined {
  // Extract Nigerian cities
  const cities = ["lagos", "abuja", "port harcourt", "kano", "ibadan", "enugu", "kaduna", "owerri"]
  const lowerMessage = message.toLowerCase()
  const found = cities.find((city) => lowerMessage.includes(city))
  return found ? found.charAt(0).toUpperCase() + found.slice(1) : undefined
}

function extractOrderNumber(message: string): string | undefined {
  const orderMatch = message.match(/ORD-\d+/i)
  return orderMatch ? orderMatch[0].toUpperCase() : undefined
}

// Simulate AI learning from past conversations
export function getSmartSuggestions(
  conversationHistory: any[],
  products: any[],
): Array<{ label: string; message: string }> {
  const suggestions = [
    {
      label: "Check Stock Status",
      message: "Can you show me which products are running low on stock?",
    },
    {
      label: "Popular Products",
      message: "What are my best-selling products this week?",
    },
    {
      label: "Pending Orders",
      message: "Show me orders that need my attention",
    },
    {
      label: "Customer Insights",
      message: "Give me insights about my recent customers",
    },
    {
      label: "Revenue Report",
      message: "How much revenue did I make today?",
    },
  ]

  return suggestions
}

// Auto-response scheduler
export interface AutoResponse {
  trigger: string
  response: string
  active: boolean
}

export const DEFAULT_AUTO_RESPONSES: AutoResponse[] = [
  {
    trigger: "hello|hi|hey",
    response: "Hello! Thank you for contacting us. How can I help you today?",
    active: true,
  },
  {
    trigger: "thank you|thanks",
    response: "You're welcome! Feel free to reach out if you need anything else.",
    active: true,
  },
  {
    trigger: "hours|open|close",
    response: "We're open Monday-Saturday, 9AM-8PM, and Sunday 12PM-6PM. How can I assist you?",
    active: true,
  },
]

export interface ChidiPersonality {
  mode: "professional" | "nigerian_genz" | "whisper"
  tone: string
}

export interface DailyBriefing {
  greeting: string
  summary: {
    sales: string
    orders: string
    customers: string
    alerts: string[]
  }
  topActions: Array<{
    label: string
    action: string
    priority: "high" | "medium" | "low"
  }>
  insights: string[]
  mood: "positive" | "neutral" | "urgent"
}

export interface WhisperModeCoaching {
  customerContext: string
  suggestedResponse: string
  upsellOpportunity?: {
    product: string
    reason: string
  }
  warnings?: string[]
  tips: string[]
}

// Nigerian Gen-Z personality responses
export function getNigerianResponse(intent: string, data: any): string {
  const responses: Record<string, string[]> = {
    greeting: [
      "Oya boss! Welcome back o. How far? Ready to make that money today? 💰",
      "E don tey wey you show! Your customers don dey wait for you o.",
      "Boss of life! Another day to secure the bag. Make we gum body!",
    ],
    low_stock: [
      "Omo, your {product} don almost finish o! Just {count} left. You need restock sharp sharp!",
      "Abeg boss, see as your stock low reach. Na time to order more before customers go vex!",
      "Your {product} don dey finish o. E remain {count}. You no wan order more?",
    ],
    good_sales: [
      "Omo see as money dey enter today! You don make {amount} already. God when? 🔥",
      "Boss you're doing well o! {amount} in the bag. More money dey come!",
      "Chaii! {amount} don land. You sha sabi this business thing!",
    ],
    order_pending: [
      "Boss you get {count} orders wey dey wait. Make we no keep customers waiting o!",
      "Abeg check these orders na, customers don dey ask questions!",
      "You get work to do o! {count} people wan buy from you.",
    ],
  }

  return responses[intent]?.[Math.floor(Math.random() * responses[intent].length)] || ""
}

export function generateDailyBriefing(data: {
  products: any[]
  orders: any[]
  customers: any[]
  revenue: number
  personality: ChidiPersonality
}): DailyBriefing {
  const { products, orders, customers, revenue, personality } = data

  const hour = new Date().getHours()
  const isNigerian = personality.mode === "nigerian_genz"

  const greetings = isNigerian
    ? ["Oya boss! Welcome back o!", "E don tey! How market?", "Boss of bosses! Ready to make money?"]
    : [
      "Good morning! Ready to start your day?",
      "Hello! Let's review your business.",
      "Welcome back! Here's your update.",
    ]

  const lowStock = products.filter((p) => p.stock <= 3)
  const pendingOrders = orders.filter((o) => o.status === "pending")
  const newCustomers = customers.filter((c) => {
    const created = new Date(c.createdAt || Date.now())
    const dayAgo = new Date()
    dayAgo.setDate(dayAgo.getDate() - 1)
    return created > dayAgo
  })

  const alerts: string[] = []
  if (lowStock.length > 0) {
    alerts.push(
      isNigerian
        ? `Omo! ${lowStock.length} products don dey finish o. You need restock sharp!`
        : `${lowStock.length} products are running low on stock`,
    )
  }
  if (pendingOrders.length > 5) {
    alerts.push(
      isNigerian
        ? `Boss you get ${pendingOrders.length} orders wey dey wait. Make we no keep customers waiting!`
        : `You have ${pendingOrders.length} pending orders that need attention`,
    )
  }

  const topActions: Array<{ label: string; action: string; priority: "high" | "medium" | "low" }> = []

  if (lowStock.length > 0) {
    topActions.push({
      label: isNigerian ? "Restock Products Sharp Sharp" : "Restock Low Inventory",
      action: "restock",
      priority: "high",
    })
  }

  if (pendingOrders.length > 0) {
    topActions.push({
      label: isNigerian ? "Process Waiting Orders" : "Process Pending Orders",
      action: "process_orders",
      priority: "high",
    })
  }

  if (newCustomers.length > 0) {
    topActions.push({
      label: isNigerian ? "Greet Your New Customers" : "Welcome New Customers",
      action: "greet_customers",
      priority: "medium",
    })
  }

  const insights = []
  if (revenue > 0) {
    insights.push(
      isNigerian
        ? `Omo see as money dey enter! You don make ₦${revenue.toLocaleString()} already today. More blessings! 🔥`
        : `You've generated ₦${revenue.toLocaleString()} in revenue today. Great work!`,
    )
  }

  if (pendingOrders.length > 0) {
    insights.push(
      isNigerian
        ? `You get ${pendingOrders.length} customers wey wan buy. Make money dey enter!`
        : `${pendingOrders.length} customers are waiting for their orders`,
    )
  }

  return {
    greeting: greetings[Math.floor(Math.random() * greetings.length)],
    summary: {
      sales: isNigerian ? `₦${revenue.toLocaleString()} don land!` : `₦${revenue.toLocaleString()} in sales`,
      orders: isNigerian
        ? `${orders.length} orders (${pendingOrders.length} dey wait)`
        : `${orders.length} orders (${pendingOrders.length} pending)`,
      customers: isNigerian ? `${newCustomers.length} new customers join!` : `${newCustomers.length} new customers`,
      alerts: alerts,
    },
    topActions,
    insights,
    mood: pendingOrders.length > 5 || lowStock.length > 3 ? "urgent" : revenue > 50000 ? "positive" : "neutral",
  }
}

export function generateWhisperModeCoaching(
  customerMessage: string,
  conversationHistory: any[],
  products: any[],
  customerProfile: any,
): WhisperModeCoaching {
  const intent = analyzeCustomerMessage(customerMessage)
  const mentionedProducts = products.filter((p) => customerMessage.toLowerCase().includes(p.name.toLowerCase()))

  const suggestedResponse = generateAIResponse(intent, { products, businessName: "Your Business" }).message

  const upsellOpportunity =
    mentionedProducts.length > 0
      ? {
        product: mentionedProducts[0].name,
        reason: "Customer showed interest. Suggest complementary items!",
      }
      : undefined

  const tips = [
    "Be warm and friendly - customers love personal touch",
    "Ask follow-up questions to understand their needs better",
    "Mention delivery times and payment options",
  ]

  if (customerProfile?.lastOrder) {
    tips.push(`This customer ordered ${customerProfile.lastOrder} before - reference it!`)
  }

  const warnings = []
  if (mentionedProducts.some((p) => p.stock === 0)) {
    warnings.push("⚠️ Product is out of stock - set expectations and offer alternatives")
  }

  return {
    customerContext: `Customer has ${conversationHistory.length} messages. ${customerProfile?.orders || 0} previous orders.`,
    suggestedResponse,
    upsellOpportunity,
    warnings,
    tips,
  }
}

// Auto-catalog from conversation history
export function extractProductsFromConversations(conversations: any[]): Array<{
  name: string
  price?: string
  mentioned: number
  confidence: number
}> {
  const productMentions: Record<string, { count: number; prices: string[] }> = {}

  conversations.forEach((conv) => {
    const message = (conv.message + " " + conv.reply).toLowerCase()

    // Extract product names (simple pattern matching)
    const productPatterns = [
      /(?:do you have|selling|available|in stock)\s+([a-z\s]+?)(?:\?|for|\s+at)/gi,
      /([a-z\s]+?)\s+(?:for|at|is)\s+₦\d{1,3}(?:,\d{3})*/gi,
    ]

    productPatterns.forEach((pattern) => {
      const matches = message.matchAll(pattern)
      for (const match of matches) {
        const productName = match[1]?.trim()
        if (productName && productName.length > 3) {
          if (!productMentions[productName]) {
            productMentions[productName] = { count: 0, prices: [] }
          }
          productMentions[productName].count++
        }
      }
    })

    // Extract prices
    const priceMatches = message.matchAll(/₦\d{1,3}(?:,\d{3})*/g)
    for (const match of priceMatches) {
      // Associate with nearby product names
      Object.keys(productMentions).forEach((product) => {
        if (message.includes(product)) {
          productMentions[product].prices.push(match[0])
        }
      })
    }
  })

  return Object.entries(productMentions)
    .map(([name, data]) => ({
      name,
      price: data.prices[0],
      mentioned: data.count,
      confidence: Math.min(data.count / 5, 1),
    }))
    .filter((p) => p.confidence > 0.3)
    .sort((a, b) => b.mentioned - a.mentioned)
}

// Customer memory system
export interface CustomerMemory {
  customerId: string
  preferences: {
    favoriteProducts: string[]
    priceRange: string
    deliveryLocation: string
    sizes?: string[]
  }
  interactions: {
    lastMessage: string
    lastOrder: string
    totalSpent: number
    orderCount: number
  }
  notes: string[]
}

export function buildCustomerMemory(customer: any, orders: any[], conversations: any[]): CustomerMemory {
  const customerOrders = orders.filter((o) => o.customer === customer.name)
  const customerConvos = conversations.filter((c) => c.customer === customer.name)

  const productsPurchased = customerOrders.flatMap((o) => o.items || []).map((item) => item.product)
  const favoriteProducts = [...new Set(productsPurchased)]

  const totalSpent = customerOrders.reduce((sum, o) => sum + (Number.parseFloat(o.total?.replace(/[₦,]/g, "")) || 0), 0)

  const notes = []
  if (customerOrders.length > 5) {
    notes.push("VIP customer - give priority treatment!")
  }
  if (customerConvos.some((c) => c.message.toLowerCase().includes("urgent"))) {
    notes.push("Prefers fast responses")
  }

  return {
    customerId: customer.id,
    preferences: {
      favoriteProducts,
      priceRange: totalSpent > 100000 ? "premium" : totalSpent > 50000 ? "mid-range" : "budget",
      deliveryLocation: "Lagos", // Could be extracted from conversations
      sizes: [],
    },
    interactions: {
      lastMessage: customerConvos[customerConvos.length - 1]?.message || "",
      lastOrder: customerOrders[customerOrders.length - 1]?.items?.[0]?.product || "",
      totalSpent,
      orderCount: customerOrders.length,
    },
    notes,
  }
}

// Business command detection for natural language actions
export interface BusinessCommand {
  action: "show_orders" | "show_customers" | "add_product" | "create_order" | "show_analytics" | "unknown"
  confidence: number
  params: Record<string, any>
}

export function detectBusinessCommand(message: string): BusinessCommand {
  const lowerMessage = message.toLowerCase()

  // Show orders patterns
  if (
    lowerMessage.match(
      /show|display|view|list|get|what are|how many|find|see.*(?:order|orders|sale|sales|today|this week|pending|recent)/i,
    )
  ) {
    const params: Record<string, any> = {}

    if (lowerMessage.includes("today")) params.timeframe = "today"
    if (lowerMessage.includes("this week")) params.timeframe = "week"
    if (lowerMessage.includes("pending")) params.status = "pending"
    if (lowerMessage.includes("completed")) params.status = "completed"

    return {
      action: "show_orders",
      confidence: 0.9,
      params,
    }
  }

  // Show customers patterns
  if (lowerMessage.match(/show|display|view|list|who are|top|best.*(?:customer|customers|client|clients|buyer)/i)) {
    const params: Record<string, any> = {}

    if (lowerMessage.includes("top") || lowerMessage.includes("best")) params.sort = "top"
    if (lowerMessage.includes("new") || lowerMessage.includes("recent")) params.sort = "recent"

    return {
      action: "show_customers",
      confidence: 0.9,
      params,
    }
  }

  // Add product patterns
  if (
    lowerMessage.match(/add|create|new|register|upload.*(?:product|item|inventory|stock)/i) ||
    lowerMessage.includes("i want to add") ||
    lowerMessage.includes("let me add")
  ) {
    return {
      action: "add_product",
      confidence: 0.85,
      params: {},
    }
  }

  // Create order patterns
  if (
    lowerMessage.match(/create|make|new|place.*(?:order)/i) ||
    lowerMessage.includes("order for") ||
    lowerMessage.includes("customer wants to order")
  ) {
    // Extract customer name if mentioned
    const customerMatch = lowerMessage.match(/(?:for|from)\s+([a-z]+)/i)
    const params: Record<string, any> = {}

    if (customerMatch) {
      params.customerName = customerMatch[1].charAt(0).toUpperCase() + customerMatch[1].slice(1)
    }

    return {
      action: "create_order",
      confidence: 0.9,
      params,
    }
  }

  // Show analytics patterns
  if (
    lowerMessage.match(/show|display|what is|how much.*(?:revenue|sales|profit|analytics|insights|performance|report)/i)
  ) {
    return {
      action: "show_analytics",
      confidence: 0.85,
      params: {},
    }
  }

  return {
    action: "unknown",
    confidence: 0,
    params: {},
  }
}
