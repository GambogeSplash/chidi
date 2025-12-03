"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Lightbulb, AlertTriangle, Volume2, X } from "lucide-react"

interface WhisperModeProps {
  customerMessage: string
  customerHistory?: any[]
  products?: any[]
  onClose: () => void
}

export function WhisperMode({ customerMessage, customerHistory = [], products = [], onClose }: WhisperModeProps) {
  const [isMinimized, setIsMinimized] = useState(false)

  // AI coaching suggestions based on message
  const suggestions = {
    upsell: products.slice(0, 2).map((p) => `Suggest ${p.name} (₦${p.price})`),
    concern:
      customerMessage.includes("problem") || customerMessage.includes("issue")
        ? ["Listen carefully", "Offer immediate solution", "Ask for details"]
        : [],
    tone: ["Keep it warm", "Add emoji", "Use their name"],
  }

  if (isMinimized) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-4 right-4 gap-2"
      >
        <Volume2 className="w-4 h-4" />
        Whisper Mode
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 p-4 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-primary" />
          <span className="font-semibold text-sm">AI Coach</span>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => setIsMinimized(true)} className="h-6 w-6 p-0">
            <Volume2 className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {/* Smart Suggestions */}
        {suggestions.upsell.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-primary">💰 Upsell Opportunity:</p>
            {suggestions.upsell.map((item, i) => (
              <p key={i} className="text-xs text-muted-foreground">
                {item}
              </p>
            ))}
          </div>
        )}

        {/* Concern Detection */}
        {suggestions.concern.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-destructive flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Concern Detected
            </p>
            {suggestions.concern.map((item, i) => (
              <p key={i} className="text-xs text-muted-foreground">
                {item}
              </p>
            ))}
          </div>
        )}

        {/* Tone Tips */}
        <div className="space-y-1 border-t border-border pt-2">
          <p className="text-xs font-medium text-muted-foreground">📝 Tone Tips:</p>
          <div className="flex gap-1 flex-wrap">
            {suggestions.tone.map((tip, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                {tip}
              </Badge>
            ))}
          </div>
        </div>

        {/* Customer Context */}
        {customerHistory && customerHistory.length > 0 && (
          <div className="text-xs text-muted-foreground bg-background/50 p-2 rounded">
            <span className="font-medium">Context:</span> Customer's {customerHistory.length} previous messages
          </div>
        )}
      </div>
    </Card>
  )
}
