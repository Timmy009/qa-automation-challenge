import { render } from "@testing-library/react"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import type React from "react" // Import React for JSX

// Custom render function to wrap components with necessary providers
const customRender = (ui: React.ReactElement, options?: any) => render(ui, { wrapper: AllTheProviders, ...options })

function AllTheProviders({ children }: { children: any}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
      <Toaster />
    </ThemeProvider>
  )
}

// re-export everything from @testing-library/react
export * from "@testing-library/react"

// override render method
export { customRender as render }
