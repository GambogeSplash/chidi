// Mock Third-Party Integrations

// Shipping Integration (Gokada/Uber)
export interface ShippingQuote {
    provider: "gokada" | "uber_package" | "kvick"
    price: number
    estimatedTime: string
    vehicleType: "bike" | "car" | "van"
}

export async function getShippingQuotes(
    pickup: string,
    delivery: string
): Promise<ShippingQuote[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    return [
        {
            provider: "gokada",
            price: 1500,
            estimatedTime: "45 mins",
            vehicleType: "bike"
        },
        {
            provider: "uber_package",
            price: 2200,
            estimatedTime: "30 mins",
            vehicleType: "car"
        },
        {
            provider: "kvick",
            price: 1200,
            estimatedTime: "60 mins",
            vehicleType: "bike"
        }
    ]
}

// SMS Integration (Termii)
export async function sendSMS(phone: string, message: string): Promise<boolean> {
    console.log(`[Mock SMS] To: ${phone}, Message: ${message}`)
    await new Promise((resolve) => setTimeout(resolve, 800))
    return true
}

// Email Integration (SendGrid)
export async function sendEmail(email: string, subject: string, body: string): Promise<boolean> {
    console.log(`[Mock Email] To: ${email}, Subject: ${subject}`)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return true
}
