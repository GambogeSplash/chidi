"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { AnalyticsDashboard } from "@/components/chidi/analytics-dashboard"
import { TeamManagement } from "@/components/chidi/team-management"
import { WebhookAdmin } from "@/components/chidi/webhook-admin"
import {
  User,
  CreditCard,
  Package,
  Users,
  TrendingUp,
  MessageSquare,
  Clock,
  Instagram,
  ChevronRight,
} from "lucide-react"

interface SettingsTabProps {
  user: any
  customers: any[]
  orders: any[]
  products: any[]
  onUpdateProfile: (profile: any) => void
  onUpdateSettings: (settings: any) => void
}

export function SettingsTab({
  user,
  customers,
  orders,
  products,
  onUpdateProfile,
  onUpdateSettings,
}: SettingsTabProps) {
  const [activeTab, setActiveTab] = useState("profile")
  const [showTemplatesModal, setShowTemplatesModal] = useState(false)
  const [showBusinessHoursModal, setShowBusinessHoursModal] = useState(false)
  const [showWebhooksModal, setShowWebhooksModal] = useState(false)

  // Profile editing state
  const [profileData, setProfileData] = useState({
    businessName: user?.business?.name || "",
    email: user?.email || "",
    phone: user?.business?.phone || "",
    address: user?.business?.address || "",
    description: user?.business?.description || "",
  })

  const [templates, setTemplates] = useState([
    { id: 1, name: "Greeting", message: "Hello! Thank you for contacting us. How can I help you today?" },
    { id: 2, name: "Availability", message: "Yes, this item is currently in stock! Would you like to place an order?" },
    { id: 3, name: "Pricing", message: "The price is [PRICE]. We also offer discounts for bulk orders!" },
    { id: 4, name: "Delivery", message: "Delivery takes 2-3 business days within Lagos. We ship nationwide!" },
  ])
  const [newTemplate, setNewTemplate] = useState({ name: "", message: "" })

  const [businessHours, setBusinessHours] = useState({
    monday: { open: "09:00", close: "18:00", enabled: true },
    tuesday: { open: "09:00", close: "18:00", enabled: true },
    wednesday: { open: "09:00", close: "18:00", enabled: true },
    thursday: { open: "09:00", close: "18:00", enabled: true },
    friday: { open: "09:00", close: "18:00", enabled: true },
    saturday: { open: "10:00", close: "16:00", enabled: true },
    sunday: { open: "10:00", close: "16:00", enabled: false },
  })

  const handleSaveProfile = () => {
    onUpdateProfile(profileData)
    alert("Profile updated successfully!")
  }

  const handleAddTemplate = () => {
    if (newTemplate.name && newTemplate.message) {
      setTemplates([...templates, { ...newTemplate, id: Date.now() }])
      setNewTemplate({ name: "", message: "" })
      alert("Template added!")
    }
  }

  const handleSaveBusinessHours = () => {
    onUpdateSettings({ businessHours })
    setShowBusinessHoursModal(false)
    alert("Business hours updated!")
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold">Settings</h2>
        <p className="text-sm text-muted-foreground">Manage your account and business settings</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-5 mb-4 sm:mb-6">
          <TabsTrigger value="profile" className="text-xs sm:text-sm">
            <User className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="customers" className="text-xs sm:text-sm">
            <Users className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
            <span className="hidden sm:inline">Customers</span>
          </TabsTrigger>
          <TabsTrigger value="team" className="text-xs sm:text-sm">
            <Users className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
            <span className="hidden sm:inline">Team</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs sm:text-sm">
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="text-xs sm:text-sm">
            <Package className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
            <span className="hidden sm:inline">Integrations</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Business Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  value={profileData.businessName}
                  onChange={(e) => setProfileData({ ...profileData, businessName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={profileData.address}
                  onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Business Description</Label>
                <Textarea
                  id="description"
                  value={profileData.description}
                  onChange={(e) => setProfileData({ ...profileData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <Button onClick={handleSaveProfile} className="w-full">
                Save Changes
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Template Responses</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setShowTemplatesModal(true)} variant="outline" className="w-full">
                <MessageSquare className="w-4 h-4 mr-2" />
                Manage Templates ({templates.length})
                <ChevronRight className="w-4 h-4 ml-auto" />
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Business Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setShowBusinessHoursModal(true)} variant="outline" className="w-full">
                <Clock className="w-4 h-4 mr-2" />
                Set Operating Hours
                <ChevronRight className="w-4 h-4 ml-auto" />
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Order Notifications</p>
                  <p className="text-xs text-muted-foreground">Get notified for new orders</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Low Stock Alerts</p>
                  <p className="text-xs text-muted-foreground">Alerts when products run low</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Customer Messages</p>
                  <p className="text-xs text-muted-foreground">Notifications for new messages</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customers Tab */}
        <TabsContent value="customers" className="space-y-4 sm:space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-1">Customer Management</h3>
            <p className="text-sm text-muted-foreground">{customers.length} total customers</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {customers.slice(0, 6).map((customer) => (
              <Card key={customer.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{customer.name}</h4>
                      <p className="text-xs text-muted-foreground truncate">{customer.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-muted rounded p-2">
                      <div className="text-lg font-bold text-primary">{customer.totalOrders}</div>
                      <div className="text-xs text-muted-foreground">Orders</div>
                    </div>
                    <div className="bg-muted rounded p-2">
                      <div className="text-lg font-bold text-primary">{customer.totalSpent}</div>
                      <div className="text-xs text-muted-foreground">Spent</div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="w-full mt-2 justify-center capitalize">
                    {customer.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          {customers.length > 6 && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Showing 6 of {customers.length} customers</p>
            </div>
          )}
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="space-y-4 sm:space-y-6">
          <TeamManagement user={user} />
        </TabsContent>

        {/* Analytics Tab with Charts */}
        <TabsContent value="analytics" className="space-y-4 sm:space-y-6">
          <AnalyticsDashboard orders={orders} customers={customers} products={products} />
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-4 sm:space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-1">Integrations</h3>
            <p className="text-sm text-muted-foreground">Connect your business tools</p>
          </div>

          <div className="grid gap-4">
            <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">WhatsApp Business</h4>
                      <p className="text-xs text-muted-foreground">Auto-respond to customers</p>
                    </div>
                  </div>
                  <Badge className="bg-green-600">Connected</Badge>
                </div>
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  Configure
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center">
                      <Instagram className="w-5 h-5 text-pink-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Instagram</h4>
                      <p className="text-xs text-muted-foreground">Sync DMs and comments</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Not Connected</Badge>
                </div>
                <Button size="sm" className="w-full">
                  Connect Instagram
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Paystack</h4>
                      <p className="text-xs text-muted-foreground">Accept online payments</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Not Connected</Badge>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="w-full">
                    Connect Paystack
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setShowWebhooksModal(true)}>
                    View Webhooks
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={showTemplatesModal} onOpenChange={setShowTemplatesModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Template Responses</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {templates.map((template) => (
              <Card key={template.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium">{template.name}</h4>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">{template.message}</p>
                </CardContent>
              </Card>
            ))}

            <Card className="border-dashed">
              <CardContent className="p-4 space-y-3">
                <h4 className="font-medium">Add New Template</h4>
                <Input
                  placeholder="Template name (e.g., Greeting)"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                />
                <Textarea
                  placeholder="Template message"
                  value={newTemplate.message}
                  onChange={(e) => setNewTemplate({ ...newTemplate, message: e.target.value })}
                  rows={3}
                />
                <Button onClick={handleAddTemplate} className="w-full">
                  Add Template
                </Button>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showBusinessHoursModal} onOpenChange={setShowBusinessHoursModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Business Hours</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {Object.entries(businessHours).map(([day, hours]) => (
              <div key={day} className="flex items-center gap-3 p-3 border rounded-lg">
                <Switch
                  checked={hours.enabled}
                  onCheckedChange={(checked) =>
                    setBusinessHours({ ...businessHours, [day]: { ...hours, enabled: checked } })
                  }
                />
                <div className="flex-1">
                  <p className="font-medium capitalize">{day}</p>
                  {hours.enabled && (
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        type="time"
                        value={hours.open}
                        onChange={(e) =>
                          setBusinessHours({ ...businessHours, [day]: { ...hours, open: e.target.value } })
                        }
                        className="h-8 text-xs"
                      />
                      <span className="text-xs">to</span>
                      <Input
                        type="time"
                        value={hours.close}
                        onChange={(e) =>
                          setBusinessHours({ ...businessHours, [day]: { ...hours, close: e.target.value } })
                        }
                        className="h-8 text-xs"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
            <Button onClick={handleSaveBusinessHours} className="w-full">
              Save Business Hours
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <WebhookAdmin isOpen={showWebhooksModal} onClose={() => setShowWebhooksModal(false)} />
    </div>
  )
}
