import { render, screen, fireEvent, waitFor } from "@/lib/utils/test-utils"
import { LoginForm } from "@/frontend-components/Auth/LoginForm"
import { login } from "@/lib/services/auth-service"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/use-toast"
import jest from "jest"

// Mock the authService and useRouter
jest.mock("@/lib/services/auth-service", () => ({
  login: jest.fn(),
}))
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}))
// Mock useToast directly
jest.mock("@/components/use-toast", () => ({
  useToast: jest.fn(),
}))

describe("LoginForm", () => {
  let mockPush
  let mockToastFn

  beforeEach(() => {
    mockPush = jest.fn()
    useRouter.mockReturnValue({
      push: mockPush,
    })
    mockToastFn = jest.fn()
    useToast.mockReturnValue({
      toast: mockToastFn,
    })
    login.mockClear()
    mockPush.mockClear()
    mockToastFn.mockClear()
  })

  it("renders the login form with username and password fields", () => {
    render(<LoginForm />)
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument()
  })

  it("displays validation errors for empty fields on submit", async () => {
    render(<LoginForm />)
    fireEvent.click(screen.getByRole("button", { name: /login/i }))

    await waitFor(() => {
      expect(screen.getByText(/username is required/i)).toBeInTheDocument()
      expect(screen.getByText(/password is required/i)).toBeInTheDocument()
    })
    expect(login).not.toHaveBeenCalled()
  })

  it("displays validation errors for short username/password", async () => {
    render(<LoginForm />)
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: "ab" } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "123" } })
    fireEvent.click(screen.getByRole("button", { name: /login/i }))

    await waitFor(() => {
      expect(screen.getByText(/username must be at least 3 characters/i)).toBeInTheDocument()
      expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument()
    })
    expect(login).not.toHaveBeenCalled()
  })

  it("calls login service and redirects on successful login", async () => {
    login.mockResolvedValue({ token: "fake-token", username: "testuser" })
    render(<LoginForm />)

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: "testuser" } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } })
    fireEvent.click(screen.getByRole("button", { name: /login/i }))

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith("testuser", "password123")
    })
    expect(mockToastFn).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Login Successful",
      }),
    )
    expect(mockPush).toHaveBeenCalledWith("/dashboard")
  })

  it("displays error toast on failed login", async () => {
    login.mockRejectedValue("Invalid credentials")
    render(<LoginForm />)

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: "testuser" } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "wrongpass" } })
    fireEvent.click(screen.getByRole("button", { name: /login/i }))

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith("testuser", "wrongpass")
    })
    expect(mockToastFn).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Login Failed",
        description: "Invalid credentials",
        variant: "destructive",
      }),
    )
    expect(mockPush).not.toHaveBeenCalled()
  })

  it("disables the login button while loading", async () => {
    login.mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve({ token: "fake" }), 100)))
    render(<LoginForm />)

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: "testuser" } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } })
    fireEvent.click(screen.getByRole("button", { name: /login/i }))

    expect(screen.getByRole("button", { name: /login/i })).toBeDisabled()

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /login/i })).not.toBeDisabled()
    })
  })
})
