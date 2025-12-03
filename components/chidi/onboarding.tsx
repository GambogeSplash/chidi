"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Zap, Store, MessageCircle, BarChart3, ArrowRight, ArrowLeft, Check, Smartphone } from "lucide-react"
import type { User } from "@/lib/auth"

interface OnboardingProps {
  user: User
  onComplete: (userData: any) => void
}

export function Onboarding({ user, onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1)
  const [userData, setUserData] = useState({
    businessName: "",
    phone: "",
    category: "",
    whatsappNumber: "",
    instagramHandle: "",
  })

  const totalSteps = 4
  const progress = (step / totalSteps) * 100

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      onComplete({
        ...user,
        ...userData,
        ownerName: user.name,
      })
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setUserData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSkip = () => {
    onComplete({
      ...user,
      ownerName: user.name,
      businessName: userData.businessName || "My Business",
      phone: userData.phone || "",
      category: userData.category || "Other",
    })
  }

  // Step 1: Welcome
  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto">
              <Zap className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-3xl">Welcome to CHIDI, {user.name}!</CardTitle>
              <p className="text-muted-foreground mt-2">Let's set up your AI business assistant in just a few steps</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="mb-4">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Step {step} of {totalSteps}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-6 rounded-lg bg-muted/50 border border-border">
                <Store className="w-8 h-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Manage Inventory</h3>
                <p className="text-sm text-muted-foreground">Track products, stock levels, and get low-stock alerts</p>
              </div>
              <div className="text-center p-6 rounded-lg bg-muted/50 border border-border">
                <MessageCircle className="w-8 h-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">AI Customer Chat</h3>
                <p className="text-sm text-muted-foreground">Auto-respond to WhatsApp and Instagram messages</p>
              </div>
              <div className="text-center p-6 rounded-lg bg-muted/50 border border-border">
                <BarChart3 className="w-8 h-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Sales Analytics</h3>
                <p className="text-sm text-muted-foreground">Real-time insights on revenue and customer behavior</p>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Quick Setup</h4>
                  <p className="text-sm text-muted-foreground">
                    This will only take 2 minutes. You can always customize later.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleNext} className="flex-1" size="lg">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Step 2: Business Details
  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <div className="mb-4">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                Step {step} of {totalSteps}
              </p>
            </div>
            <CardTitle className="text-2xl">Tell us about your business</CardTitle>
            <p className="text-muted-foreground">This helps CHIDI personalize your experience</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name *</Label>
                <Input
                  id="businessName"
                  placeholder="e.g., Bella's Fashion Store"
                  value={userData.businessName}
                  onChange={(e) => handleInputChange("businessName", e.target.value)}
                  className="text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  placeholder="e.g., +234 801 234 5678"
                  value={userData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="text-base"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleBack} variant="outline" size="lg">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleNext}
                className="flex-1"
                size="lg"
                disabled={!userData.businessName || !userData.phone}
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Step 3: Business Category
  if (step === 3) {
    const categories = [
      { id: "fashion", label: "Fashion & Clothing", icon: "👗" },
      { id: "electronics", label: "Electronics", icon: "📱" },
      { id: "beauty", label: "Beauty & Cosmetics", icon: "💄" },
      { id: "food", label: "Food & Beverages", icon: "🍔" },
      { id: "home", label: "Home & Living", icon: "🏠" },
      { id: "other", label: "Other", icon: "📦" },
    ]

    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <div className="mb-4">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                Step {step} of {totalSteps}
              </p>
            </div>
            <CardTitle className="text-2xl">What do you sell?</CardTitle>
            <p className="text-muted-foreground">This helps CHIDI understand your products better</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={userData.category === category.label ? "default" : "outline"}
                  className="h-auto py-4 px-4 justify-start text-left"
                  onClick={() => handleInputChange("category", category.label)}
                >
                  <span className="text-2xl mr-3">{category.icon}</span>
                  <span className="font-medium">{category.label}</span>
                </Button>
              ))}
            </div>

            <div className="flex gap-3">
              <Button onClick={handleBack} variant="outline" size="lg">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button onClick={handleNext} className="flex-1" size="lg" disabled={!userData.category}>
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Step 4: Connect Channels (Optional)
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="mb-4">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Step {step} of {totalSteps}
            </p>
          </div>
          <CardTitle className="text-2xl">Connect your channels</CardTitle>
          <p className="text-muted-foreground">Link WhatsApp and Instagram to start receiving messages</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="whatsappNumber">WhatsApp Business Number (Optional)</Label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="whatsappNumber"
                  placeholder="e.g., +234 801 234 5678"
                  value={userData.whatsappNumber}
                  onChange={(e) => handleInputChange("whatsappNumber", e.target.value)}
                  className="pl-10 text-base"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagramHandle">Instagram Handle (Optional)</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-muted-foreground">@</span>
                <Input
                  id="instagramHandle"
                  placeholder="e.g., bellasfashion"
                  value={userData.instagramHandle}
                  onChange={(e) => handleInputChange("instagramHandle", e.target.value)}
                  className="pl-8 text-base"
                />
              </div>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <h4 className="font-medium mb-2 text-sm">What happens next?</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• You'll be able to connect these channels from Settings</li>
              <li>• CHIDI will start monitoring for customer messages</li>
              <li>• AI will help respond to common questions automatically</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleBack} variant="outline" size="lg">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button onClick={handleSkip} variant="ghost" size="lg">
              Skip for now
            </Button>
            <Button onClick={handleNext} className="flex-1" size="lg">
              Complete Setup
              <Check className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
