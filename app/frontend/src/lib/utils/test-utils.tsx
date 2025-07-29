import { render } from "@testing-library/react"
import type { ReactElement } from "react"

// Custom render function to wrap components with necessary providers if any
const customRender = (ui: ReactElement, options?: any) => render(ui, { ...options })

// re-export everything from @testing-library/react
export * from "@testing-library/react"

// override render method
export { customRender as render }
