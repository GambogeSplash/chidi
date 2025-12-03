export interface PaystackConfig {
  publicKey: string
  secretKey: string
  businessEmail: string
}

export async function generatePaystackLink(invoice: any, config: PaystackConfig, callbackUrl: string): Promise<string> {
  const amount = Math.round(invoice.totalAmount * 100) // Convert to kobo

  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: config.businessEmail,
      amount,
      metadata: {
        orderId: invoice.orderNumber,
        customerName: invoice.customerName,
      },
      callback_url: callbackUrl,
    }),
  })

  if (!response.ok) throw new Error("Failed to generate payment link")

  const data = await response.json()
  return data.data.authorization_url
}

export async function verifyPaystackPayment(reference: string, secretKey: string): Promise<boolean> {
  const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    headers: { Authorization: `Bearer ${secretKey}` },
  })

  const data = await response.json()
  return data.data.status === "success"
}
