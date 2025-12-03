"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Clock, Save } from "lucide-react"

interface BusinessHoursConfigProps {
  currentHours: any
  onSave: (hours: any) => void
}

export function BusinessHoursConfig({ currentHours, onSave }: BusinessHoursConfigProps) {
  const [hours, setHours] = useState(currentHours)
  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]

  const handleDayChange = (day: string, field: "open" | "close" | "closed", value: any) => {
    setHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }))
  }

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5" />
        <h3 className="font-semibold">Business Hours</h3>
      </div>

      <div className="space-y-4">
        {days.map((day) => (
          <div key={day} className="flex items-center gap-4 p-3 border border-border rounded-lg">
            <div className="w-20">
              <Label className="text-sm font-medium capitalize">{day}</Label>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                checked={!hours[day].closed}
                onCheckedChange={(checked) => handleDayChange(day, "closed", !checked)}
              />
              <span className="text-sm">Open</span>
            </div>

            {!hours[day].closed && (
              <>
                <Input
                  type="time"
                  value={hours[day].open}
                  onChange={(e) => handleDayChange(day, "open", e.target.value)}
                  className="w-24"
                />
                <span className="text-xs text-muted-foreground">to</span>
                <Input
                  type="time"
                  value={hours[day].close}
                  onChange={(e) => handleDayChange(day, "close", e.target.value)}
                  className="w-24"
                />
              </>
            )}
          </div>
        ))}
      </div>

      <Button onClick={() => onSave(hours)} className="w-full">
        <Save className="w-4 h-4 mr-2" />
        Save Hours
      </Button>
    </Card>
  )
}
