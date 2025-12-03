export interface PaystackConfig {
  publicKey: string
  secretKey: string
}

export interface PaymentInitRequest {
  email: string
  amount: number // in kobo (amount * 100)
  reference?: string
  metadata?: Record<string, any>
}

export interface PaymentResponse {
  status: boolean
  message: string
  data?: {
    authorization_url: string
    access_code: string
    reference: string
  }
}

export class PaystackService {
  private config: PaystackConfig

  constructor(config: PaystackConfig) {
    this.config = config
  }

  async initializePayment(request: PaymentInitRequest): Promise<string> {
    const amount = Math.round(request.amount * 100) // Convert to kobo
    const reference = request.reference || `CHIDI-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    try {
      const response = await fetch("https://api.paystack.co/transaction/initialize", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.config.secretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: request.email,
          amount,
          reference,
          metadata: request.metadata || {},
        }),
      })

      const data: PaymentResponse = await response.json()

      if (!data.status) {
        throw new Error(data.message || "Payment initialization failed")
      }

      return data.data?.authorization_url || ""
    } catch (error) {
      console.error("Paystack initialization error:", error)
      throw error
    }
  }

  async verifyPayment(reference: string): Promise<boolean> {
    try {
      const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
        headers: {
          Authorization: `Bearer ${this.config.secretKey}`,
        },
      })

      const data = await response.json()
      return data.data?.status === "success"
    } catch (error) {
      console.error("Paystack verification error:", error)
      return false
    }
  }

  async getPaymentStatus(reference: string): Promise<any> {
    try {
      const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
        headers: {
          Authorization: `Bearer ${this.config.secretKey}`,
        },
      })

      return await response.json()
    } catch (error) {
      console.error("Payment status fetch error:", error)
      return null
    }
  }
}

export function generatePaymentReference(orderId: string): string {
  return `CHIDI-${orderId}-${Date.now()}`
}

export function formatPaymentMetadata(order: any, customer: any) {
  return {
    orderId: order?.id ?? null,
    customerId: customer?.id ?? null,
    customerName: customer?.name ?? null,
    customerPhone: customer?.phone ?? null,
    totalAmount: order?.totalAmount ?? 0,
    itemCount: Array.isArray(order?.items) ? order.items.length : 0,
  }
}
