export interface BusinessConfig {
  id: string
  name: string
  phone: string
  email: string
  website?: string
  logo?: string
  description?: string
  location?: string

  // Operation hours
  hours: {
    monday: { open: string; close: string; closed: boolean }
    tuesday: { open: string; close: string; closed: boolean }
    wednesday: { open: string; close: string; closed: boolean }
    thursday: { open: string; close: string; closed: boolean }
    friday: { open: string; close: string; closed: boolean }
    saturday: { open: string; close: string; closed: boolean }
    sunday: { open: string; close: string; closed: boolean }
  }

  // Policies
  deliveryPolicy: string
  returnPolicy: string
  refundPolicy: string
  warrantyPolicy?: string

  // Communication
  tone: "professional" | "casual" | "nigerian-gen-z"
  language: "english" | "yoruba" | "igbo" | "hausa"
  autoResponses: {
    greeting: string
    unavailable: string
    thankyou: string
  }

  // Integrations
  integrations: {
    whatsapp: { enabled: boolean; businessPhone?: string }
    instagram: { enabled: boolean; handle?: string }
    email: { enabled: boolean; provider?: string }
    sms: { enabled: boolean; provider?: string }
  }

  // Security
  security: {
    twoFactorEnabled: boolean
    dataEncryption: boolean
    automaticBackup: boolean
  }
}

export const DEFAULT_BUSINESS_CONFIG: BusinessConfig = {
  id: "",
  name: "",
  phone: "",
  email: "",
  hours: {
    monday: { open: "09:00", close: "18:00", closed: false },
    tuesday: { open: "09:00", close: "18:00", closed: false },
    wednesday: { open: "09:00", close: "18:00", closed: false },
    thursday: { open: "09:00", close: "18:00", closed: false },
    friday: { open: "09:00", close: "18:00", closed: false },
    saturday: { open: "10:00", close: "16:00", closed: false },
    sunday: { open: "00:00", close: "00:00", closed: true },
  },
  deliveryPolicy: "We deliver nationwide within 2-3 business days",
  returnPolicy: "Returns accepted within 14 days of purchase in original condition",
  refundPolicy: "Full refund upon successful return verification",
  tone: "nigerian-gen-z",
  language: "english",
  autoResponses: {
    greeting: "Hello! Welcome to CHIDI. How can I help you today?",
    unavailable: "We're currently unavailable. Please leave a message and we'll get back to you soon.",
    thankyou: "Thank you for your purchase! Your order is being processed.",
  },
  integrations: {
    whatsapp: { enabled: false },
    instagram: { enabled: false },
    email: { enabled: false },
    sms: { enabled: false },
  },
  security: {
    twoFactorEnabled: true,
    dataEncryption: true,
    automaticBackup: true,
  },
}

export function isBusinessOpen(config: BusinessConfig, date: Date = new Date()): boolean {
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
  const dayName = days[date.getDay()] as keyof typeof config.hours
  const dayConfig = config.hours[dayName]

  if (dayConfig.closed) return false

  const currentTime = `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`
  return currentTime >= dayConfig.open && currentTime <= dayConfig.close
}

export function getNextOpenTime(config: BusinessConfig): Date {
  const now = new Date()
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]

  for (let i = 0; i < 7; i++) {
    const checkDate = new Date(now)
    checkDate.setDate(checkDate.getDate() + i)

    const dayName = days[checkDate.getDay()] as keyof typeof config.hours
    const dayConfig = config.hours[dayName]

    if (!dayConfig.closed) {
      const [hour, minute] = dayConfig.open.split(":").map(Number)
      checkDate.setHours(hour, minute, 0, 0)
      return checkDate
    }
  }

  return new Date()
}
