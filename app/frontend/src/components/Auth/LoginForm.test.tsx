import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import LoginForm from "./LoginForm"
import jest from "jest" // Declare the jest variable

// Mock the useRouter hook from next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

// Mock the useToast hook
jest.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}))

// Mock the auth-service
jest.mock("@/lib/services/auth-service", () => ({
  login: jest.fn(),
}))

const mockLogin = require("@/lib/services/auth-service").login
const mockUseToast = require("@/hooks/use-toast").useToast
const mockUseRouter = require("next/navigation").useRouter

describe("LoginForm", () => {
  let toastMock: jest.Mock
  let pushMock: jest.Mock

  beforeEach(() => {
    toastMock = jest.fn()
    pushMock = jest.fn()
    mockUseToast.mockReturnValue({ toast: toastMock })
    mockUseRouter.mockReturnValue({ push: pushMock })
    mockLogin.mockReset() // Reset mocks before each test
  })

  it("renders the login form", () => {
    render(<LoginForm />)
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument()
  })

  it("shows validation errors for empty fields on submit", async () => {
    render(<LoginForm />)
    fireEvent.click(screen.getByRole("button", { name: /login/i }))

    await waitFor(() => {
      expect(screen.getByText(/username is required/i)).toBeInTheDocument()
      expect(screen.getByText(/password is required/i)).toBeInTheDocument()
    })
  })

  it("calls login and redirects on successful login", async () => {
    mockLogin.mockResolvedValue({ token: "fake-token", user: { id: "123", email: "test@example.com" } })

    render(<LoginForm />)
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: "testuser" } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } })
    fireEvent.click(screen.getByRole("button", { name: /login/i }))

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("testuser", "password123")
    })

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/dashboard")
    })

    expect(toastMock).toHaveBeenCalledWith({
      title: "Success",
      description: "Logged in successfully!",
    })
  })

  it("shows error toast on failed login", async () => {
    mockLogin.mockRejectedValue(new Error("Invalid credentials"))

    render(<LoginForm />)
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: "wronguser" } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "wrongpass" } })
    fireEvent.click(screen.getByRole("button", { name: /login/i }))

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("wronguser", "wrongpass")
    })

    await waitFor(() => {
      expect(toastMock).toHaveBeenCalledWith({
        title: "Error",
        description: "Invalid credentials",
        variant: "destructive",
      })
    })
    expect(pushMock).not.toHaveBeenCalled()
  })

  it("disables button while logging in", async () => {
    mockLogin.mockReturnValue(new Promise(() => {})) // Never resolve to keep it pending

    render(<LoginForm />)
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: "testuser" } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } })
    fireEvent.click(screen.getByRole("button", { name: /login/i }))

    expect(screen.getByRole("button", { name: /logging in.../i })).toBeDisabled()
  })
})
