import Cookies from "js-cookie"

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5000/api"
const TOKEN_KEY = "authToken"
const USER_KEY = "currentUser"

interface AuthResponse {
  token: string
  user: {
    id: string
    username: string // Changed from email to username based on backend user model
  }
}

export const login = async (username: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Login failed")
    }

    const data: AuthResponse = await response.json()
    Cookies.set(TOKEN_KEY, data.token, { expires: 1 }) // Token expires in 1 day
    localStorage.setItem(USER_KEY, JSON.stringify(data.user))
    return data
  } catch (error) {
    console.error("Login error:", error)
    throw error
  }
}

export const logout = () => {
  Cookies.remove(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export const getToken = (): string | undefined => {
  return Cookies.get(TOKEN_KEY)
}

export const getCurrentUser = (): { id: string; username: string } | null => {
  // Changed from email to username
  const user = localStorage.getItem(USER_KEY)
  return user ? JSON.parse(user) : null
}
