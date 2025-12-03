"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Brain, Sparkles, TrendingUp, AlertTriangle, Lightbulb, Copy } from "lucide-react"

interface WhisperModePanelProps {
  customerMessage: string
  conversationHistory: any[]
  products: any[]
  customerProfile: any
  onUseResponse: (response: string) => void
}

export function WhisperModePanel({
  customerMessage,
  conversationHistory,
  products,
  customerProfile,
  onUseResponse,
}: WhisperModePanelProps) {
  // Simulate AI coaching analysis
  const coaching = {
    customerContext: `Customer has ${conversationHistory.length} messages. ${customerProfile?.orders || 0} previous orders.`,
    suggestedResponse:
      "Yes! We have that item in stock. I can prepare it for you right away. Would you also like to see our matching accessories?",
    upsellOpportunity: {
      product: "Matching Leather Belt",
      reason: "Customer buying shoes - perfect for cross-sell!",
    },
    warnings: [] as string[],
    tips: [
      "Be warm and friendly - customers love personal touch",
      "Ask follow-up questions to understand their needs",
      "Mention delivery times and payment options",
    ],
  }

  if (customerProfile?.lastOrder) {
    coaching.tips.push(`This customer ordered ${customerProfile.lastOrder} before - reference it!`)
  }

  return (
    <Card className="border-purple-200 bg-purple-50/50 dark:bg-purple-950/20">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-sm">Whisper Mode - AI Coaching</h3>
          <Badge variant="secondary" className="ml-auto text-xs">
            Live
          </Badge>
        </div>

        {/* Customer Context */}
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">Customer Context:</div>
          <div className="text-xs bg-background rounded p-2">{coaching.customerContext}</div>
        </div>

        {/* Suggested Response */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <div className="text-xs font-medium">Suggested Response:</div>
          </div>
          <div className="bg-background rounded-lg p-3 space-y-2">
            <p className="text-sm">{coaching.suggestedResponse}</p>
            <Button
              size="sm"
              variant="outline"
              className="w-full bg-transparent"
              onClick={() => onUseResponse(coaching.suggestedResponse)}
            >
              <Copy className="w-3 h-3 mr-2" />
              Use This Response
            </Button>
          </div>
        </div>

        {/* Upsell Opportunity */}
        {coaching.upsellOpportunity && (
          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <div className="text-xs font-medium text-green-800 dark:text-green-200">Upsell Opportunity!</div>
            </div>
            <div className="text-xs text-green-700 dark:text-green-300">
              <strong>{coaching.upsellOpportunity.product}</strong>
              <br />
              {coaching.upsellOpportunity.reason}
            </div>
          </div>
        )}

        {/* Warnings */}
        {coaching.warnings.length > 0 && (
          <div className="space-y-2">
            {coaching.warnings.map((warning, idx) => (
              <div
                key={idx}
                className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 rounded-lg p-2 flex items-start gap-2"
              >
                <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5" />
                <p className="text-xs text-orange-800 dark:text-orange-200">{warning}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tips */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-yellow-600" />
            <div className="text-xs font-medium">Pro Tips:</div>
          </div>
          <ul className="space-y-1">
            {coaching.tips.map((tip, idx) => (
              <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                <span className="text-yellow-600">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
