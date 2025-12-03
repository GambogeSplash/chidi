// Local storage utilities for data persistence
export interface StorageData {
  products: any[]
  customers: any[]
  orders: any[]
  notifications: any[]
  conversations: any[]
  templates: any[]
  businessHours: any[]
  integrations: any[]
}

const STORAGE_PREFIX = "chidi_data_"

export function saveUserData(userId: string, key: keyof StorageData, data: any): void {
  if (typeof window === "undefined") return

  const storageKey = `${STORAGE_PREFIX}${userId}_${key}`
  localStorage.setItem(storageKey, JSON.stringify(data))
}

export function loadUserData<T>(userId: string, key: keyof StorageData, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue

  try {
    const storageKey = `${STORAGE_PREFIX}${userId}_${key}`
    const stored = localStorage.getItem(storageKey)
    return stored ? JSON.parse(stored) : defaultValue
  } catch {
    return defaultValue
  }
}

export function clearUserData(userId: string): void {
  if (typeof window === "undefined") return

  const keys = Object.keys(localStorage)
  const userPrefix = `${STORAGE_PREFIX}${userId}_`

  keys.forEach((key) => {
    if (key.startsWith(userPrefix)) {
      localStorage.removeItem(key)
    }
  })
}
