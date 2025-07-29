export const validateUsername = (username: string): string | undefined => {
  if (!username) {
    return "Username is required"
  }
  if (username.length < 3) {
    return "Username must be at least 3 characters long"
  }
  return undefined
}
export const validatePassword = (password: string): { isValid: boolean; message: string } => {
  const trimmed = password.trim()

  if (!trimmed) {
    return { isValid: false, message: "Password is required" }
  }

  if (trimmed.length < 8) {
    return { isValid: false, message: "Password must be at least 8 characters" }
  }

  const hasUppercase = /[A-Z]/.test(trimmed)
  const hasLowercase = /[a-z]/.test(trimmed)
  const hasNumber = /[0-9]/.test(trimmed)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(trimmed)

  if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecialChar) {
    return {
      isValid: false,
      message: "Password must include uppercase, lowercase, number, and special character",
    }
  }

  return { isValid: true, message: "" }
}

export const validateEmail = (email: string): { isValid: boolean; message: string } => {
  const trimmed = email.trim()

  if (!trimmed) {
    return { isValid: false, message: "Email is required" }
  }

  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

  if (!emailRegex.test(trimmed)) {
    return { isValid: false, message: "Enter a valid email address" }
  }

  return { isValid: true, message: "" }
}

// export const validatePassword = (password: string): string | undefined => {
//   if (!password) {
//     return "Password is required"
//   }
//   if (password.length < 6) {
//     return "Password must be at least 6 characters long"
//   }
//   return undefined
// }

export const validateItemName = (name: string): string | undefined => {
  if (!name) {
    return "Item name is required"
  }
  if (name.length < 3) {
    return "Item name must be at least 3 characters long"
  }
  return undefined
}

export const validateItemDescription = (description: string): string | undefined => {
  if (!description) {
    return "Description is required"
  }
  if (description.length < 10) {
    return "Description must be at least 10 characters long"
  }
  return undefined
}

export const validateItemQuantity = (quantity: number): string | undefined => {
  if (quantity === null || quantity === undefined) {
    return "Quantity is required"
  }
  if (isNaN(quantity) || quantity <= 0) {
    return "Quantity must be a positive number"
  }
  return undefined
}

export const validateItemPrice = (price: number): string | undefined => {
  if (price === null || price === undefined) {
    return "Price is required"
  }
  if (isNaN(price) || price <= 0) {
    return "Price must be a positive number"
  }
  return undefined
}
