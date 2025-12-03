export function generateProductDescription(productName: string, category: string): string {
  const descriptions: { [key: string]: string } = {
    clothing: `Premium ${productName} - Stylish, comfortable, and perfect for any occasion. Crafted with quality materials.`,
    accessories: `Beautiful ${productName} - The perfect complement to your wardrobe. Durable and fashionable.`,
    electronics: `Latest ${productName} - High-quality tech with great features. Best value for money.`,
  }

  return descriptions[category] || `Check out this amazing ${productName}!`
}

export function generateInstagramCaption(productName: string, price: string): string {
  const captions = [
    `✨ NEW ARRIVAL ✨\n${productName}\n🛍️ Available now\n💬 DM to order\n${price}`,
    `Loving this ${productName}!\n👉 Link in bio\n📦 Fast delivery\n✅ Quality guaranteed`,
    `Your style just got an upgrade 💅\n${productName}\n📲 DM us now\n${price}`,
  ]

  return captions[Math.floor(Math.random() * captions.length)]
}

export function generateCampaignMessage(customerName: string, lastOrderDate: Date): string {
  const daysSince = Math.floor((Date.now() - lastOrderDate.getTime()) / (1000 * 60 * 60 * 24))

  if (daysSince > 30) {
    return `Hey ${customerName}! 👋 We miss you! Check out our new collection. Use code COMEBACK10 for 10% off 🎉`
  } else if (daysSince > 14) {
    return `${customerName}, your favorites are back in stock! 🔥 Shop now before they're gone`
  } else {
    return `Thanks for your recent purchase, ${customerName}! 🙌 Here's something new you might like...`
  }
}
