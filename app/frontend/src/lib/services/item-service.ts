import { getToken } from "./auth-service"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api"

interface Item {
  _id: string
  name: string
  description: string
  quantity: number
  price: number
}

export const getItems = async (): Promise<Item[]> => {
  const token = getToken()
  if (!token) {
    throw new Error("No authentication token found. Please log in.")
  }

  try {
    const response = await fetch(`${API_BASE_URL}/items`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to fetch items")
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching items:", error)
    throw error
  }
}

export const createItem = async (item: Omit<Item, "_id">): Promise<Item> => {
  const token = getToken()
  if (!token) {
    throw new Error("No authentication token found. Please log in.")
  }

  try {
    const response = await fetch(`${API_BASE_URL}/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(item),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to create item")
    }

    return response.json()
  } catch (error) {
    console.error("Error creating item:", error)
    throw error
  }
}

export const updateItem = async (id: string, item: Omit<Item, "_id">): Promise<Item> => {
  const token = getToken()
  if (!token) {
    throw new Error("No authentication token found. Please log in.")
  }

  try {
    const response = await fetch(`${API_BASE_URL}/items/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(item),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to update item")
    }

    return response.json()
  } catch (error) {
    console.error("Error updating item:", error)
    throw error
  }
}

export const deleteItem = async (id: string): Promise<{ message: string }> => {
  const token = getToken()
  if (!token) {
    throw new Error("No authentication token found. Please log in.")
  }

  try {
    const response = await fetch(`${API_BASE_URL}/items/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to delete item")
    }

    return response.json()
  } catch (error) {
    console.error("Error deleting item:", error)
    throw error
  }
}
