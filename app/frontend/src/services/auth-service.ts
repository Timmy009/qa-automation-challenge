import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5000/api/auth"

export const login = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { username, password })
    if (response.data.token) {
      localStorage.setItem("user", JSON.stringify(response.data))
    }
    return response.data
  } catch (error: any) {
    throw error.response?.data?.message || error.message
  }
}

export const register = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/register`, { username, password })
    return response.data
  } catch (error: any) {
    throw error.response?.data?.message || error.message
  }
}

export const logout = () => {
  localStorage.removeItem("user")
}

export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user")
  if (userStr) return JSON.parse(userStr)
  return null
}
