// Authentication utilities with localStorage persistence
export interface User {
  id: string
  email: string
  name: string
  businessName: string
  phone: string
  category: string
  createdAt: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

const AUTH_STORAGE_KEY = "chidi_auth_state"
const USER_DATA_KEY = "chidi_user_data"

export function saveAuthState(user: User): void {
  if (typeof window === "undefined") return

  const authState: AuthState = {
    user,
    isAuthenticated: true,
  }

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState))
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(user))
}

export function loadAuthState(): AuthState {
  if (typeof window === "undefined") {
    return { user: null, isAuthenticated: false }
  }

  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!stored) {
      return { user: null, isAuthenticated: false }
    }

    return JSON.parse(stored)
  } catch {
    return { user: null, isAuthenticated: false }
  }
}

export function clearAuthState(): void {
  if (typeof window === "undefined") return

  localStorage.removeItem(AUTH_STORAGE_KEY)
  localStorage.removeItem(USER_DATA_KEY)
}

export async function signUp(
  email: string,
  password: string,
  name: string,
): Promise<{ user: User | null; error: string | null }> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Check if user already exists
  const existingUsers = getStoredUsers()
  if (existingUsers.find((u) => u.email === email)) {
    return { user: null, error: "Email already registered" }
  }

  // Create new user
  const newUser: User = {
    id: `user_${Date.now()}`,
    email,
    name,
    businessName: "",
    phone: "",
    category: "",
    createdAt: new Date().toISOString(),
  }

  // Store user
  const users = [...existingUsers, newUser]
  localStorage.setItem("chidi_users", JSON.stringify(users))

  return { user: newUser, error: null }
}

export async function signIn(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  const users = getStoredUsers()
  const user = users.find((u) => u.email === email)

  if (!user) {
    return { user: null, error: "Invalid credentials" }
  }

  // In a real app, we'd verify the password here
  // For now, we'll just check if the password is not empty
  if (!password) {
    return { user: null, error: "Invalid credentials" }
  }

  return { user, error: null }
}

export async function signInWithMagicLink(email: string): Promise<{ success: boolean; error: string | null }> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // In a real app, this would send an email with a magic link
  // For demo purposes, we'll just check if the email exists
  const users = getStoredUsers()
  const userExists = users.some((u) => u.email === email)

  if (!userExists) {
    // Auto-create user for demo
    const newUser: User = {
      id: `user_${Date.now()}`,
      email,
      name: email.split("@")[0],
      businessName: "",
      phone: "",
      category: "",
      createdAt: new Date().toISOString(),
    }

    const updatedUsers = [...users, newUser]
    localStorage.setItem("chidi_users", JSON.stringify(updatedUsers))
  }

  return { success: true, error: null }
}

function getStoredUsers(): User[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem("chidi_users")
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function updateUserProfile(userId: string, updates: Partial<User>): User | null {
  const users = getStoredUsers()
  const userIndex = users.findIndex((u) => u.id === userId)

  if (userIndex === -1) return null

  const updatedUser = { ...users[userIndex], ...updates }
  users[userIndex] = updatedUser

  localStorage.setItem("chidi_users", JSON.stringify(users))
  saveAuthState(updatedUser)

  return updatedUser
}
