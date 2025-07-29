import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5000/api/items"

const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}")
  if (user && user.token) {
    return { Authorization: `Bearer ${user.token}` }
  }
  return {}
}

export const createItem = async (itemData: { name: string; description: string; quantity: number; price: number }) => {
  try {
    const response = await axios.post(API_URL, itemData, { headers: getAuthHeaders() })
    return response.data
  } catch (error: any) {
    throw error.response?.data?.message || error.message
  }
}

export const getItems = async () => {
  try {
    const response = await axios.get(API_URL, { headers: getAuthHeaders() })
    return response.data
  } catch (error: any) {
    throw error.response?.data?.message || error.message
  }
}

export const getItemById = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, { headers: getAuthHeaders() })
    return response.data
  } catch (error: any) {
    throw error.response?.data?.message || error.message
  }
}

export const updateItem = async (
  id: string,
  itemData: { name?: string; description?: string; quantity?: number; price?: number },
) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, itemData, { headers: getAuthHeaders() })
    return response.data
  } catch (error: any) {
    throw error.response?.data?.message || error.message
  }
}

export const deleteItem = async (id: string) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() })
    return response.data
  } catch (error: any) {
    throw error.response?.data?.message || error.message
  }
}
