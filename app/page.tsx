"use client"

import { useState, useEffect } from "react"
import { DesktopSidebar } from "@/components/chidi/desktop-sidebar"
import { DesktopHeader } from "@/components/chidi/desktop-header"
import { HomeTab } from "@/components/chidi/home-tab"
import { Onboarding } from "@/components/chidi/onboarding"
import { CatalogTab } from "@/components/chidi/catalog-tab"
import { OrdersTab } from "@/components/chidi/orders-tab"
import { SettingsTab } from "@/components/chidi/settings-tab"
import { AuthScreen } from "@/components/auth/auth-screen"
import { loadAuthState, saveAuthState, clearAuthState, updateUserProfile, type User } from "@/lib/auth"
import { loadUserData, saveUserData } from "@/lib/storage"
import { AddProductModal } from "@/components/chidi/add-product-modal"
import { QuickEditModal } from "@/components/chidi/quick-edit-modal"
import { CustomerDetailPage } from "@/components/chidi/customer-detail-page"
import { ProductDetailPage } from "@/components/chidi/product-detail-page"
import { ProfileEditModal } from "@/components/chidi/profile-edit-modal"
import { ProductDetailModal } from "@/components/chidi/product-detail-modal"
import { CustomerRecovery } from "@/components/chidi/customer-recovery"
import { PaymentCheckout } from "@/components/chidi/payment-checkout"
import { WhisperModePanel } from "@/components/chidi/whisper-mode-panel"
import { VoiceInput } from "@/components/chidi/voice-input"
import { CreateOrderFlow } from "@/components/chidi/create-order-flow"
import { NotificationDropdown } from "@/components/chidi/notification-dropdown"
import { OrderDetailPage } from "@/components/chidi/order-detail-page"
import { BulkCSVImport } from "@/components/chidi/bulk-csv-import"
import { InvoiceGenerator } from "@/components/chidi/invoice-generator"
import { PaymentLinkGenerator } from "@/components/chidi/payment-link-generator"
import { calculateBusinessMetrics } from "@/lib/analytics"
import { detectOrderFromMessage, autoProfileCustomer } from "@/lib/chidi-core"
import { AnalyticsDashboard } from "@/components/chidi/analytics-dashboard"

const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: "Blue Ankara Dress",
    stock: 2,
    price: "₦15,000",
    status: "low",
    category: "clothing",
    image: "/blue-ankara-dress.jpg",
  },
  {
    id: 2,
    name: "Casual Sneakers",
    stock: 15,
    price: "₦25,000",
    status: "good",
    category: "accessories",
    image: "/casual-sneakers.png",
  },
  {
    id: 3,
    name: "Leather Handbag",
    stock: 8,
    price: "₦35,000",
    status: "good",
    category: "accessories",
    image: "/leather-handbag.png",
  },
  {
    id: 4,
    name: "Wireless Earbuds",
    stock: 0,
    price: "₦18,000",
    status: "out",
    category: "electronics",
    image: "/wireless-earbuds.png",
  },
]

const INITIAL_CUSTOMERS = [
  {
    id: 1,
    name: "Jane Adebayo",
    phone: "+234 801 234 5678",
    email: "jane.adebayo@email.com",
    location: "Lagos, Nigeria",
    totalOrders: 12,
    totalSpent: "₦285,000",
    lastOrder: "2 days ago",
    status: "vip" as const,
    notes: "Prefers WhatsApp communication. Regular customer. Loves Ankara styles.",
    joinDate: "Oct 2023",
  },
  {
    id: 2,
    name: "Mike Johnson",
    phone: "+234 802 345 6789",
    email: "mike.j@email.com",
    location: "Abuja, Nigeria",
    totalOrders: 7,
    totalSpent: "₦175,000",
    lastOrder: "1 week ago",
    status: "active" as const,
    notes: "Interested in sneakers and electronics. Corporate buyer.",
    joinDate: "Nov 2023",
  },
  {
    id: 3,
    name: "Sarah Okafor",
    phone: "+234 803 456 7890",
    email: "sarah.okafor@email.com",
    location: "Port Harcourt, Nigeria",
    totalOrders: 4,
    totalSpent: "₦95,000",
    lastOrder: "3 days ago",
    status: "active" as const,
    notes: "Fashion enthusiast. Prefers Instagram communication.",
    joinDate: "Dec 2023",
  },
  {
    id: 4,
    name: "David Emeka",
    phone: "+234 804 567 8901",
    email: "david.emeka@email.com",
    location: "Enugu, Nigeria",
    totalOrders: 15,
    totalSpent: "₦420,000",
    lastOrder: "3 months ago",
    status: "inactive" as const,
    notes: "High-value customer but hasn't ordered recently. Bulk buyer.",
    joinDate: "Aug 2023",
  },
  {
    id: 5,
    name: "Blessing Okoro",
    phone: "+234 805 678 9012",
    email: "blessing.okoro@email.com",
    location: "Kano, Nigeria",
    totalOrders: 3,
    totalSpent: "₦65,000",
    lastOrder: "5 days ago",
    status: "active" as const,
    notes: "New customer. Interested in accessories.",
    joinDate: "Jan 2024",
  },
  {
    id: 6,
    name: "Chidi Okonkwo",
    phone: "+234 806 789 0123",
    location: "Owerri, Nigeria",
    totalOrders: 8,
    totalSpent: "₦190,000",
    lastOrder: "1 week ago",
    status: "active" as const,
    notes: "Repeat customer. Prefers phone calls for orders.",
    joinDate: "Sep 2023",
  },
  {
    id: 7,
    name: "Fatima Aliyu",
    phone: "+234 807 890 1234",
    email: "fatima.aliyu@email.com",
    location: "Kaduna, Nigeria",
    totalOrders: 6,
    totalSpent: "₦145,000",
    lastOrder: "4 days ago",
    status: "active" as const,
    notes: "Fashion blogger. Often orders for content creation.",
    joinDate: "Nov 2023",
  },
  {
    id: 8,
    name: "Tunde Adeyemi",
    phone: "+234 808 901 2345",
    location: "Ibadan, Nigeria",
    totalOrders: 2,
    totalSpent: "₦45,000",
    lastOrder: "2 months ago",
    status: "inactive" as const,
    notes: "Occasional buyer. Price-sensitive customer.",
    joinDate: "Dec 2023",
  },
]

const INITIAL_ORDERS = [
  {
    id: 1,
    orderNumber: "ORD-001234",
    customerId: 1,
    customerName: "Jane Adebayo",
    customerPhone: "+234 801 234 5678",
    items: [
      { productId: 1, productName: "Blue Ankara Dress", quantity: 1, price: "₦15,000" },
      { productId: 3, productName: "Leather Handbag", quantity: 1, price: "₦35,000" },
    ],
    total: "₦52,000",
    status: "delivered" as const,
    paymentStatus: "paid" as const,
    orderDate: "2024-01-15",
    notes: "Customer requested express delivery",
  },
  {
    id: 2,
    orderNumber: "ORD-001235",
    customerId: 2,
    customerName: "Mike Johnson",
    customerPhone: "+234 802 345 6789",
    items: [{ productId: 2, productName: "Casual Sneakers", quantity: 1, price: "₦25,000" }],
    total: "₦27,000",
    status: "shipped" as const,
    paymentStatus: "paid" as const,
    orderDate: "2024-01-18",
    notes: "Delivery to office address",
  },
  {
    id: 3,
    orderNumber: "ORD-001236",
    customerId: 3,
    customerName: "Sarah Okafor",
    customerPhone: "+234 803 456 7890",
    items: [{ productId: 3, productName: "Leather Handbag", quantity: 1, price: "₦35,000" }],
    total: "₦37,000",
    status: "pending" as const,
    paymentStatus: "unpaid" as const,
    orderDate: "2024-01-20",
    notes: "Waiting for payment confirmation",
  },
  {
    id: 4,
    orderNumber: "ORD-001237",
    customerId: 1,
    customerName: "Jane Adebayo",
    customerPhone: "+234 801 234 5678",
    items: [
      { productId: 2, productName: "Casual Sneakers", quantity: 2, price: "₦25,000" },
      { productId: 4, productName: "Wireless Earbuds", quantity: 1, price: "₦18,000" },
    ],
    total: "₦70,000",
    status: "delivered" as const,
    paymentStatus: "paid" as const,
    orderDate: "2024-01-10",
    notes: "Bulk order for family",
  },
  {
    id: 5,
    orderNumber: "ORD-001238",
    customerId: 5,
    customerName: "Blessing Okoro",
    customerPhone: "+234 805 678 9012",
    items: [{ productId: 3, productName: "Leather Handbag", quantity: 1, price: "₦35,000" }],
    total: "₦37,000",
    status: "confirmed" as const,
    paymentStatus: "paid" as const,
    orderDate: "2024-01-19",
    notes: "First-time customer",
  },
  {
    id: 6,
    orderNumber: "ORD-001239",
    customerId: 6,
    customerName: "Chidi Okonkwo",
    customerPhone: "+234 806 789 0123",
    items: [
      { productId: 1, productName: "Blue Ankara Dress", quantity: 1, price: "₦15,000" },
      { productId: 2, productName: "Casual Sneakers", quantity: 1, price: "₦25,000" },
    ],
    total: "₦42,000",
    status: "shipped" as const,
    paymentStatus: "paid" as const,
    orderDate: "2024-01-17",
    notes: "Gift for wife",
  },
  {
    id: 7,
    orderNumber: "ORD-001240",
    customerId: 7,
    customerName: "Fatima Aliyu",
    customerPhone: "+234 807 890 1234",
    items: [{ productId: 1, productName: "Blue Ankara Dress", quantity: 2, price: "₦15,000" }],
    total: "₦32,000",
    status: "delivered" as const,
    paymentStatus: "paid" as const,
    orderDate: "2024-01-12",
    notes: "For fashion blog content",
  },
  {
    id: 8,
    orderNumber: "ORD-001241",
    customerId: 4,
    customerName: "David Emeka",
    customerPhone: "+234 804 567 8901",
    items: [
      { productId: 2, productName: "Casual Sneakers", quantity: 3, price: "₦25,000" },
      { productId: 4, productName: "Wireless Earbuds", quantity: 2, price: "₦18,000" },
    ],
    total: "₦113,000",
    status: "cancelled" as const,
    paymentStatus: "refunded" as const,
    orderDate: "2024-01-08",
    notes: "Customer requested cancellation",
  },
  {
    id: 9,
    orderNumber: "ORD-001242",
    customerId: 2,
    customerName: "Mike Johnson",
    customerPhone: "+234 802 345 6789",
    items: [{ productId: 4, productName: "Wireless Earbuds", quantity: 1, price: "₦18,000" }],
    total: "₦20,000",
    status: "processing" as const,
    paymentStatus: "paid" as const,
    orderDate: "2024-01-21",
    notes: "Rush order for business meeting",
  },
  {
    id: 10,
    orderNumber: "ORD-001243",
    customerId: 3,
    customerName: "Sarah Okafor",
    customerPhone: "+234 803 456 7890",
    items: [
      { productId: 1, productName: "Blue Ankara Dress", quantity: 1, price: "₦15,000" },
      { productId: 3, productName: "Leather Handbag", quantity: 1, price: "₦35,000" },
    ],
    total: "₦52,000",
    status: "confirmed" as const,
    paymentStatus: "paid" as const,
    orderDate: "2024-01-16",
    notes: "Special occasion outfit",
  },
]

const INITIAL_CONVERSATIONS = [
  {
    id: 1,
    customer: "Jane Adebayo",
    message: "Do you have the blue dress in size L?",
    reply: "Yes! We have the Blue Ankara Dress in size L. It's ₦15,000. Would you like to place an order?",
    timestamp: "5 min ago",
    status: "replied",
  },
  {
    id: 2,
    customer: "Mike Johnson",
    message: "What's your return policy for electronics?",
    reply: "We offer a 7-day return policy for electronics in original condition with receipt. No questions asked!",
    timestamp: "1 hour ago",
    status: "replied",
  },
  {
    id: 3,
    customer: "Sarah Okafor",
    message: "Is delivery available to Port Harcourt?",
    reply: "Yes, we deliver nationwide! Port Harcourt delivery is ₦3,500 and takes 2-3 business days.",
    timestamp: "3 hours ago",
    status: "replied",
  },
  {
    id: 4,
    customer: "Blessing Okoro",
    message: "Can I get a discount for bulk orders?",
    reply: "We offer 10% off for orders above ₦50,000 and 15% off for orders above ₦100,000.",
    timestamp: "6 hours ago",
    status: "replied",
  },
  {
    id: 5,
    customer: "Unknown Customer",
    message: "Hello, I saw your products on Instagram. Are they original?",
    reply: "",
    timestamp: "3 hours ago",
    status: "new",
  },
]

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: "system",
    title: "Welcome",
    message: "Welcome to CHIDI! Your AI business assistant is ready to help you manage your business.",
    timestamp: "Just now",
    read: false,
  },
]

export default function ChidiApp() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("home")
  const [products, setProducts] = useState(INITIAL_PRODUCTS)
  const [orders, setOrders] = useState(INITIAL_ORDERS)
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS)
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS)
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [currentView, setCurrentView] = useState("main")
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [showAddProductModal, setShowAddProductModal] = useState(false)
  const [showQuickEditModal, setShowQuickEditModal] = useState(false)
  const [showCreateOrderFlow, setShowCreateOrderFlow] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showProfileEditModal, setShowProfileEditModal] = useState(false)
  const [showTemplateManager, setShowTemplateManager] = useState(false)
  const [showBusinessHours, setShowBusinessHours] = useState(false)
  const [showIntegrations, setShowIntegrations] = useState(false)
  const [showDataExport, setShowDataExport] = useState(false)
  const [showProductDetailModal, setShowProductDetailModal] = useState(false)
  const [showCustomerRecovery, setShowCustomerRecovery] = useState(false)
  const [showPaymentCheckout, setShowPaymentCheckout] = useState(false)
  const [showVoiceInput, setShowVoiceInput] = useState(false)
  const [teamMembers, setTeamMembers] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null) // Declare setSelectedCustomer
  const [showBulkImport, setShowBulkImport] = useState(false)
  const [showInvoiceGenerator, setShowInvoiceGenerator] = useState(false)
  const [showPaymentLink, setShowPaymentLink] = useState(false)
  const [showWhisperMode, setShowWhisperMode] = useState(false)
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<any>(null)
  const [selectedOrderForPayment, setSelectedOrderForPayment] = useState<any>(null)
  const [analytics, setAnalytics] = useState<any>(null)

  // Close sidebar overlay with Escape key (helpful on small screens)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !sidebarCollapsed) {
        setSidebarCollapsed(true)
      }
    }

    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [sidebarCollapsed])

  useEffect(() => {
    const loadedAuthState = loadAuthState()
    setUser(loadedAuthState.user)
    setIsLoading(false)
    setIsAuthenticated(loadedAuthState.isAuthenticated)

    if (loadedAuthState.isAuthenticated && loadedAuthState.user) {
      const userId = loadedAuthState.user.id

      if (loadedAuthState.user.businessName) {
        setShowOnboarding(false)

        const loadedProducts = loadUserData(userId, "products", INITIAL_PRODUCTS)
        const loadedCustomers = loadUserData(userId, "customers", INITIAL_CUSTOMERS)
        const loadedOrders = loadUserData(userId, "orders", INITIAL_ORDERS)
        const loadedConversations = loadUserData(userId, "conversations", INITIAL_CONVERSATIONS)
        const loadedNotifications = loadUserData(userId, "notifications", INITIAL_NOTIFICATIONS)

        setProducts(loadedProducts.filter(Boolean))
        setCustomers(loadedCustomers.filter(Boolean))
        setOrders(loadedOrders.filter(Boolean))
        setConversations(loadedConversations.filter(Boolean))
        setNotifications(loadedNotifications.filter(Boolean))
      } else {
        setShowOnboarding(true)
      }
    }
  }, [])

  useEffect(() => {
    if (user && !showOnboarding) {
      saveUserData(user.id, "products", products)
    }
  }, [products, user, showOnboarding])

  useEffect(() => {
    if (user && !showOnboarding) {
      saveUserData(user.id, "customers", customers)
    }
  }, [customers, user, showOnboarding])

  useEffect(() => {
    if (user && !showOnboarding) {
      saveUserData(user.id, "orders", orders)
    }
  }, [orders, user, showOnboarding])

  useEffect(() => {
    if (user && !showOnboarding) {
      saveUserData(user.id, "conversations", conversations)
    }
  }, [conversations, user, showOnboarding])

  useEffect(() => {
    if (user && !showOnboarding) {
      saveUserData(user.id, "notifications", notifications)
    }
  }, [notifications, user, showOnboarding])

  useEffect(() => {
    const newAnalytics = calculateBusinessMetrics(orders, customers, products) // updated function call
    setAnalytics(newAnalytics)
  }, [orders, customers, products])

  // Fetch Paystack webhook events (dev) and apply payment status updates to orders
  useEffect(() => {
    const applyWebhookEvents = async () => {
      if (!user || showOnboarding) return
      try {
        const res = await fetch('/api/paystack/webhook')
        if (!res.ok) return
        const data = await res.json()
        const events = data?.events || []
        if (!events.length) return

        // Iterate events and try to update matching orders
        setOrders((prevOrders) => {
          let updated = [...prevOrders]
          events.forEach((ev: any) => {
            const body = ev.body && typeof ev.body === 'string' ? (() => { try { return JSON.parse(ev.body) } catch { return ev.body } })() : ev.body
            const payData = body?.data || body
            const ref = payData?.reference || payData?.metadata?.orderNumber || payData?.metadata?.orderId || null
            const status = payData?.status || payData?.gateway_response || payData?.payment_status || null
            if (!ref || !status) return

            updated = updated.map((o) => {
              // Match by orderNumber or id
              if (o.orderNumber === ref || o.id === ref || String(o.id) === String(ref) || (payData?.metadata?.orderNumber && o.orderNumber === payData.metadata.orderNumber)) {
                const paymentStatus = /success|paid|completed/i.test(status) ? 'paid' : /failed|error/i.test(status) ? 'failed' : status
                return { ...o, paymentStatus }
              }
              return o
            })
          })

          // persist updated orders
          try { saveUserData(user.id, 'orders', updated) } catch (e) { /* ignore */ }
          return updated
        })
      } catch (e) {
        // ignore
      }
    }

    applyWebhookEvents()
    // run once on mount when user is present
  }, [user, showOnboarding])

  const handleAuthSuccess = (user: User) => {
    saveAuthState(user)
    setUser(user)
    setIsLoading(false)
    setIsAuthenticated(true)

    if (!user.businessName) {
      setShowOnboarding(true)
    } else {
      setShowOnboarding(false)
    }
  }

  const handleOnboardingComplete = (userData: any) => {
    const updatedUser = updateUserProfile(user!.id, userData)
    if (updatedUser) {
      setUser(updatedUser)
      saveAuthState(updatedUser)
      setShowOnboarding(false)

      const welcomeNotification = {
        id: `welcome-${Date.now()}`,
        type: "system" as const,
        title: "Welcome to CHIDI!",
        message: `Hi ${userData.ownerName}! Your AI business assistant is ready to help you manage ${userData.businessName}.`,
        timestamp: "Just now",
        read: false,
        priority: "low" as const,
      }
      setNotifications((prev) => [welcomeNotification, ...prev])
    }
  }

  const handleLogout = () => {
    if (user) {
      clearAuthState()
    }
    setUser(null)
    setIsAuthenticated(false)
    setShowOnboarding(false)
    setNotifications([])
    setProducts(INITIAL_PRODUCTS)
    setCustomers(INITIAL_CUSTOMERS)
    setOrders(INITIAL_ORDERS)
    setConversations(INITIAL_CONVERSATIONS)
  }

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications)
  }

  const handleMarkNotificationAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const handleCreateOrderFlow = () => {
    setShowCreateOrderFlow(true)
  }

  const handleOrderCreated = (order: any) => {
    setOrders([order, ...orders])
    setShowCreateOrderFlow(false)
    setNotifications([
      {
        id: Date.now(),
        type: "order",
        message: `New order #${order.id} created for ${order.customer}`,
        time: "Just now",
        read: false,
      },
      ...notifications,
    ])
  }

  const handleUpdateOrderStatus = (orderId: number, status: string) => {
    setOrders((prev) => prev.map((order) => (order && order.id === orderId ? { ...order, status } : order)))
  }

  const handleAddProduct = (newProduct: any) => {
    const productWithId = {
      ...newProduct,
      id: Math.max(...products.map((p) => p.id), 0) + 1,
    }
    setProducts((prev) => [...prev, productWithId])

    const newNotification = {
      id: Date.now().toString(),
      type: "activity" as const,
      title: "Product Added",
      message: `${newProduct.name} has been added to your inventory with ${newProduct.stock} units`,
      timestamp: "Just now",
      read: false,
      priority: "low" as const,
    }
    setNotifications((prev) => [newNotification, ...prev])
    setShowAddProductModal(false)
  }

  const handleEditProduct = (product: any) => {
    setSelectedProduct(product)
    setShowQuickEditModal(true)
  }

  const handleUpdateProduct = (updatedProduct: any) => {
    setProducts((prev) => prev.map((product) => (product.id === updatedProduct.id ? updatedProduct : product)))

    const originalProduct = products.find((p) => p.id === updatedProduct.id)
    if (originalProduct && updatedProduct.stock > originalProduct.stock) {
      const newNotification = {
        id: Date.now().toString(),
        type: "activity" as const,
        title: "Product Restocked",
        message: `${updatedProduct.name} restocked from ${originalProduct.stock} to ${updatedProduct.stock} units`,
        timestamp: "Just now",
        read: false,
        priority: "medium" as const,
      }
      setNotifications((prev) => [newNotification, ...prev])
    }
    setShowQuickEditModal(false)
    setSelectedProduct(null)
  }

  const handleBulkExport = () => {
    // Implement bulk export functionality here
  }

  const handleViewProduct = (product: any) => {
    setSelectedProduct(product)
    setCurrentView("product-detail")
  }

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order)
    setCurrentView("order-detail")
  }

  const handleViewCustomer = (customerId: number) => {
    setSelectedCustomerId(customerId)
    const customer = customers.find((c) => c.id === customerId)
    setSelectedCustomer(customer) // Set selectedCustomer state
    setCurrentView("customer-detail")
  }

  const handleEditProfile = () => {
    setShowEditProfile(true)
  }

  const handleManageTemplates = () => {
    setShowTemplateManager(true)
  }

  const handleManageBusinessHours = () => {
    setShowBusinessHours(true)
  }

  const handleManageIntegrations = () => {
    setShowIntegrations(true)
  }

  const handleDataExport = () => {
    setShowDataExport(true)
  }

  const handleAddTeamMember = (member: any) => {
    setTeamMembers((prev) => [...prev, member])
  }

  const handleBulkImport = (importedProducts: any[]) => {
    setProducts((prev) => [...prev, ...importedProducts])
    saveUserData(user?.id || "", "products", [...products, ...importedProducts])
  }

  const handleOpenProductModal = (product: any) => {
    setSelectedProduct(product)
    setShowProductDetailModal(true)
  }

  const handleSendRecoveryMessage = (customer: any) => {
    // simple demo action for recovery
    setNotifications((prev) => [
      { id: Date.now(), type: "message", title: "Recovery Sent", message: `Re-engagement message sent to ${customer.name}`, timestamp: "Just now", read: false },
      ...prev,
    ])
  }

  const handleChatMessage = (message: string) => {
    const detectedOrder = detectOrderFromMessage(message, products)
    if (detectedOrder) {
      const newOrder = {
        id: `ORD-${Date.now()}`,
        ...detectedOrder,
        customerId: selectedCustomer?.id || "new",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      setOrders((prev) => [...prev, newOrder])
      saveUserData(user?.id || "", "orders", [...orders, newOrder])

      // Auto-profile customer
      const updatedCustomer = {
        ...selectedCustomer,
        ...autoProfileCustomer(message),
        id: selectedCustomer?.id || `CUST-${Date.now()}`,
        name: selectedCustomer?.name || "New Customer",
        phone: selectedCustomer?.phone || "",
      }

      if (!selectedCustomer) {
        setCustomers((prev) => [...prev, updatedCustomer])
        saveUserData(user?.id || "", "customers", [...customers, updatedCustomer])
      }
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return <AuthScreen onAuthSuccess={handleAuthSuccess} />
  }

  if (showOnboarding) {
    return <Onboarding user={user!} onComplete={handleOnboardingComplete} />
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <DesktopSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        user={user}
        onProfileClick={() => setShowProfile(true)}
        onNotificationClick={handleNotificationClick}
        onSignOut={handleLogout}
        notificationCount={notifications.length}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Backdrop for mobile */}
      {!sidebarCollapsed && (
        <>
          <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarCollapsed(true)} />
          <button
            aria-label="Close sidebar"
            onClick={() => setSidebarCollapsed(true)}
            className="lg:hidden fixed top-4 right-4 z-40 inline-flex items-center justify-center rounded-md bg-white/90 px-3 py-2 text-sm shadow-md"
          >
            Close
          </button>
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <DesktopHeader
          user={user}
          activeTab={activeTab}
          onProfileClick={() => setShowProfile(true)}
          notificationDropdown={
            <NotificationDropdown notifications={notifications} onMarkAsRead={handleMarkNotificationAsRead} />
          }
          onActionClick={() => {
            if (activeTab === "catalog") setShowAddProductModal(true)
            if (activeTab === "orders") handleCreateOrderFlow()
          }}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          extraActions={[
            { label: "Bulk Import", onClick: () => setShowBulkImport(true) },
            { label: "Invoice", onClick: () => setShowInvoiceGenerator(true) },
            { label: "Payment", onClick: () => { setSelectedOrderForPayment(orders[0]); setShowPaymentCheckout(true) } },
            { label: "Whisper", onClick: () => setShowWhisperMode((s) => !s) },
            { label: "Recovery", onClick: () => setShowCustomerRecovery((s) => !s) },
            { label: "Profile Edit", onClick: () => setShowProfileEditModal(true) },
          ]}
        />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-background">
          {activeTab === "home" ? (
            <div className="h-full p-3 sm:p-4 md:p-6">
              <HomeTab products={products} orders={orders} customers={customers} />
            </div>
          ) : (
            <div className="mx-auto max-w-7xl p-3 sm:p-4 md:p-6 lg:p-8 w-full">
              {currentView === "main" && (
                <>
                  {activeTab === "catalog" && (
                    <CatalogTab
                      products={products}
                      onAddProduct={() => setShowAddProductModal(true)}
                      onEditProduct={handleEditProduct}
                      onViewProduct={handleViewProduct}
                      onBulkExport={handleBulkExport}
                      onBulkImport={() => setShowBulkImport(true)}
                    />
                  )}
                  {activeTab === "orders" && (
                    <OrdersTab
                      orders={orders}
                      customers={customers}
                      products={products}
                      onAddOrder={handleCreateOrderFlow}
                      onViewOrder={handleViewOrder}
                      onUpdateOrderStatus={handleUpdateOrderStatus}
                      onGeneratePayment={(order) => {
                        setSelectedOrderForPayment(order)
                        setShowPaymentLink(true)
                      }}
                      onGenerateInvoice={(order) => {
                        setSelectedOrderForInvoice(order)
                        setShowInvoiceGenerator(true)
                      }}
                    />
                  )}
                  {activeTab === "settings" && (
                    <SettingsTab
                      user={user}
                      customers={customers}
                      products={products}
                      orders={orders}
                      onSaveProfile={() => {
                        alert("Profile saved!")
                      }}
                      onViewAnalytics={() => setCurrentView("analytics")}
                      onManageCustomers={() => setCurrentView("customers")}
                      onManageTeam={() => setCurrentView("team")}
                    />
                  )}
                </>
              )}

              {currentView === "analytics" && (
                <div className="space-y-6">
                  <button onClick={() => setCurrentView("main")} className="text-sm text-primary hover:underline mb-4">
                    ← Back
                  </button>
                  <AnalyticsDashboard orders={orders} customers={customers} products={products} />
                </div>
              )}

              {currentView === "product-detail" && selectedProduct && (
                <ProductDetailPage
                  product={selectedProduct}
                  onBack={() => {
                    setCurrentView("main")
                    setSelectedProduct(null)
                  }}
                  onEdit={(product) => {
                    setSelectedProduct(product)
                    setShowQuickEditModal(true)
                  }}
                />
              )}

              {currentView === "order-detail" && selectedOrder && (
                <OrderDetailPage
                  order={selectedOrder}
                  onBack={() => {
                    setCurrentView("main")
                    setSelectedOrder(null)
                  }}
                  onUpdateStatus={handleUpdateOrderStatus}
                />
              )}

              {currentView === "customer-detail" && selectedCustomer && (
                <CustomerDetailPage
                  customer={selectedCustomer}
                  orders={orders.filter((o) => o.customerId === selectedCustomer.id)}
                  onBack={() => {
                    setCurrentView("main")
                    setSelectedCustomer(null)
                  }}
                />
              )}
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      {/* Remove temporary dev-surface (features wired to header via `extraActions`) */}
      {showCustomerRecovery && (
        <div className="fixed left-4 bottom-20 z-40 w-80">
          <CustomerRecovery inactiveCustomers={customers.filter((c) => c.status === "inactive")} onSendMessage={handleSendRecoveryMessage} />
        </div>
      )}

      <AddProductModal
        isOpen={showAddProductModal}
        onClose={() => setShowAddProductModal(false)}
        onAddProduct={handleAddProduct}
      />
      <QuickEditModal
        isOpen={showQuickEditModal}
        onClose={() => setShowQuickEditModal(false)}
        product={selectedProduct}
        onUpdateProduct={handleUpdateProduct}
      />
      <CreateOrderFlow
        isOpen={showCreateOrderFlow}
        onClose={() => setShowCreateOrderFlow(false)}
        products={products}
        customers={customers}
        onOrderCreated={handleOrderCreated}
      />
      <BulkCSVImport isOpen={showBulkImport} onClose={() => setShowBulkImport(false)} onImport={handleBulkImport} />

      <InvoiceGenerator
        isOpen={showInvoiceGenerator}
        onClose={() => setShowInvoiceGenerator(false)}
        order={selectedOrderForInvoice}
        customer={selectedOrderForInvoice && customers.find((c) => c.id === selectedOrderForInvoice.customerId)}
        businessInfo={user}
      />

      <PaymentLinkGenerator
        isOpen={showPaymentLink}
        onClose={() => setShowPaymentLink(false)}
        order={selectedOrderForPayment}
        customer={selectedOrderForPayment && customers.find((c) => c.id === selectedOrderForPayment.customerId)}
      />

      {/* Newly wired modals / panels */}
      <ProfileEditModal
        isOpen={showProfileEditModal}
        onClose={() => setShowProfileEditModal(false)}
        userProfile={user}
        onUpdateProfile={(profile) => {
          if (user) {
            const updated = updateUserProfile(user.id, profile)
            if (updated) {
              setUser(updated)
              saveAuthState(updated)
            }
          }
          setShowProfileEditModal(false)
        }}
      />

      <ProductDetailModal
        isOpen={showProductDetailModal}
        onClose={() => setShowProductDetailModal(false)}
        product={selectedProduct}
        onEditProduct={(p) => {
          setSelectedProduct(p)
          setShowQuickEditModal(true)
          setShowProductDetailModal(false)
        }}
      />

      <PaymentCheckout
        isOpen={showPaymentCheckout}
        onClose={() => setShowPaymentCheckout(false)}
        order={selectedOrderForPayment}
        customer={selectedOrderForPayment && customers.find((c) => c.id === selectedOrderForPayment.customerId)}
        onPaymentSuccess={(ref) => {
          setNotifications((prev) => [
            { id: Date.now(), type: "payment", title: "Payment Success", message: `Payment ${ref} recorded`, timestamp: "Just now", read: false },
            ...prev,
          ])
          setShowPaymentCheckout(false)
        }}
      />

      {showWhisperMode && (
        <div className="fixed right-4 bottom-8 z-40 w-96">
          <WhisperModePanel
            customerMessage={conversations[0]?.message || ""}
            conversationHistory={conversations}
            products={products}
            customerProfile={selectedCustomer || customers[0]}
            onUseResponse={(resp) => handleChatMessage(resp)}
          />
        </div>
      )}
    </div>
  )
}
