"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, Plus, Calendar, Globe, AlertCircle } from "lucide-react"

interface BusinessHour {
  day: string
  isOpen: boolean
  openTime: string
  closeTime: string
}

interface Holiday {
  id: number
  name: string
  date: string
  isRecurring: boolean
}

interface BusinessHoursPageProps {
  onBack: () => void
}

export function BusinessHoursPage({ onBack }: BusinessHoursPageProps) {
  const [businessHours, setBusinessHours] = useState<BusinessHour[]>([
    { day: "Monday", isOpen: true, openTime: "09:00", closeTime: "18:00" },
    { day: "Tuesday", isOpen: true, openTime: "09:00", closeTime: "18:00" },
    { day: "Wednesday", isOpen: true, openTime: "09:00", closeTime: "18:00" },
    { day: "Thursday", isOpen: true, openTime: "09:00", closeTime: "18:00" },
    { day: "Friday", isOpen: true, openTime: "09:00", closeTime: "18:00" },
    { day: "Saturday", isOpen: true, openTime: "10:00", closeTime: "16:00" },
    { day: "Sunday", isOpen: false, openTime: "10:00", closeTime: "16:00" },
  ])

  const [holidays, setHolidays] = useState<Holiday[]>([
    { id: 1, name: "New Year's Day", date: "2024-01-01", isRecurring: true },
    { id: 2, name: "Independence Day", date: "2024-10-01", isRecurring: true },
    { id: 3, name: "Christmas Day", date: "2024-12-25", isRecurring: true },
    { id: 4, name: "Eid al-Fitr", date: "2024-04-10", isRecurring: false },
  ])

  const [autoReply, setAutoReply] = useState({
    enabled: true,
    message: "Thanks for your message! We're currently closed but will respond first thing when we're back.",
    holidayMessage: "We're closed for the holiday. We'll be back on our next business day!",
  })

  const [timezone, setTimezone] = useState("Africa/Lagos")
  const [showAddHoliday, setShowAddHoliday] = useState(false)
  const [activeTab, setActiveTab] = useState<"hours" | "holidays" | "settings">("hours")

  const toggleDayStatus = (index: number) => {
    setBusinessHours((prev) => prev.map((hour, i) => (i === index ? { ...hour, isOpen: !hour.isOpen } : hour)))
  }

  const updateTime = (index: number, field: "openTime" | "closeTime", value: string) => {
    setBusinessHours((prev) => prev.map((hour, i) => (i === index ? { ...hour, [field]: value } : hour)))
  }

  const addHoliday = (holiday: Omit<Holiday, "id">) => {
    setHolidays((prev) => [...prev, { ...holiday, id: Date.now() }])
    setShowAddHoliday(false)
  }

  const removeHoliday = (id: number) => {
    setHolidays((prev) => prev.filter((h) => h.id !== id))
  }

  const getCurrentStatus = () => {
    const now = new Date()
    const currentDay = now.toLocaleDateString("en-US", { weekday: "long" })
    const currentTime = now.toTimeString().slice(0, 5)

    const todayHours = businessHours.find((h) => h.day === currentDay)
    if (!todayHours?.isOpen) return { isOpen: false, message: "Closed today" }

    const isWithinHours = currentTime >= todayHours.openTime && currentTime <= todayHours.closeTime
    return {
      isOpen: isWithinHours,
      message: isWithinHours ? `Open until ${todayHours.closeTime}` : `Closed • Opens at ${todayHours.openTime}`,
    }
  }

  const status = getCurrentStatus()

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <h1 className="text-lg font-semibold">Business Hours</h1>
        <div className="w-16" />
      </div>

      {/* Current Status */}
      <Card className={`${status.isOpen ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${status.isOpen ? "bg-green-500" : "bg-red-500"}`} />
            <div>
              <div className={`font-medium ${status.isOpen ? "text-green-900" : "text-red-900"}`}>
                {status.isOpen ? "Currently Open" : "Currently Closed"}
              </div>
              <div className={`text-sm ${status.isOpen ? "text-green-700" : "text-red-700"}`}>{status.message}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2">
        <Button variant={activeTab === "hours" ? "default" : "outline"} size="sm" onClick={() => setActiveTab("hours")}>
          <Clock className="w-4 h-4 mr-1" />
          Hours
        </Button>
        <Button
          variant={activeTab === "holidays" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("holidays")}
        >
          <Calendar className="w-4 h-4 mr-1" />
          Holidays
        </Button>
        <Button
          variant={activeTab === "settings" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("settings")}
        >
          Settings
        </Button>
      </div>

      {/* Business Hours Tab */}
      {activeTab === "hours" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Weekly Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {businessHours.map((hour, index) => (
              <div key={hour.day} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Switch checked={hour.isOpen} onCheckedChange={() => toggleDayStatus(index)} />
                  <span className="font-medium w-20">{hour.day}</span>
                </div>
                {hour.isOpen ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={hour.openTime}
                      onChange={(e) => updateTime(index, "openTime", e.target.value)}
                      className="px-2 py-1 border rounded text-sm"
                    />
                    <span className="text-muted-foreground">to</span>
                    <input
                      type="time"
                      value={hour.closeTime}
                      onChange={(e) => updateTime(index, "closeTime", e.target.value)}
                      className="px-2 py-1 border rounded text-sm"
                    />
                  </div>
                ) : (
                  <span className="text-muted-foreground">Closed</span>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Holidays Tab */}
      {activeTab === "holidays" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Manage holidays and special closures</p>
            <Button size="sm" onClick={() => setShowAddHoliday(true)}>
              <Plus className="w-4 h-4 mr-1" />
              Add Holiday
            </Button>
          </div>

          <div className="space-y-3">
            {holidays.map((holiday) => (
              <Card key={holiday.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{holiday.name}</h3>
                        {holiday.isRecurring && (
                          <Badge variant="outline" className="text-xs">
                            Recurring
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(holiday.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeHoliday(holiday.id)}>
                      Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Add Holiday Form */}
          {showAddHoliday && (
            <Card className="border-2 border-dashed">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <input type="text" placeholder="Holiday name" className="w-full p-2 border rounded" />
                  <input type="date" className="w-full p-2 border rounded" />
                  <div className="flex items-center gap-2">
                    <Switch />
                    <span className="text-sm">Recurring annually</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      Add Holiday
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setShowAddHoliday(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <div className="space-y-4">
          {/* Timezone */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Timezone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="Africa/Lagos">Lagos (WAT)</option>
                <option value="Africa/Cairo">Cairo (EET)</option>
                <option value="Europe/London">London (GMT)</option>
                <option value="America/New_York">New York (EST)</option>
                <option value="Asia/Dubai">Dubai (GST)</option>
              </select>
            </CardContent>
          </Card>

          {/* Auto Reply Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Auto-Reply Messages</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Enable Auto-Reply</p>
                  <p className="text-sm text-muted-foreground">Send automatic responses when closed</p>
                </div>
                <Switch
                  checked={autoReply.enabled}
                  onCheckedChange={(checked) => setAutoReply((prev) => ({ ...prev, enabled: checked }))}
                />
              </div>

              {autoReply.enabled && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">After Hours Message</label>
                    <textarea
                      value={autoReply.message}
                      onChange={(e) => setAutoReply((prev) => ({ ...prev, message: e.target.value }))}
                      className="w-full p-2 border rounded text-sm"
                      rows={3}
                      placeholder="Message to send when business is closed..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Holiday Message</label>
                    <textarea
                      value={autoReply.holidayMessage}
                      onChange={(e) => setAutoReply((prev) => ({ ...prev, holidayMessage: e.target.value }))}
                      className="w-full p-2 border rounded text-sm"
                      rows={3}
                      placeholder="Message to send during holidays..."
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Advanced Features */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-900">Smart Business Hours</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    CHIDI automatically adjusts responses based on your business hours, holidays, and timezone.
                    Customers receive appropriate messages when you're unavailable.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Button className="w-full">Save Changes</Button>
    </div>
  )
}
