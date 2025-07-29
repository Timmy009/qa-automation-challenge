import { cy } from "cypress"

describe("Item Management - Delete Item", () => {
  const itemToDelete = `Delete Test Item ${Date.now()}`
  const itemToKeep = `Keep This Item ${Date.now()}`

  beforeEach(() => {
    cy.login("testuser", "password123") // Ensure user is logged in
    cy.visit("/dashboard")
    // Create items for the test
    cy.createItem(itemToDelete, "Description to delete", "1", "1.00")
    cy.contains("Item created successfully").should("be.visible")
    cy.createItem(itemToKeep, "Description to keep", "2", "2.00")
    cy.contains("Item created successfully").should("be.visible")
  })

  it("should allow a user to delete an existing item", () => {
    cy.deleteItem(itemToDelete)
    cy.contains("Item deleted successfully").should("be.visible")
    cy.contains(itemToDelete).should("not.exist")
    cy.contains(itemToKeep).should("be.visible") // Ensure other item is still there
    cy.matchImageSnapshot("dashboard-after-delete-item")
  })

  it("should not delete an item if deletion is cancelled", () => {
    cy.contains(".item-card", itemToDelete).find("button").contains("Delete").click()
    cy.get("button").contains("Cancel").click() // Click cancel in the confirmation dialog
    cy.contains(itemToDelete).should("be.visible") // Item should still be visible
    cy.contains("Item deleted successfully").should("not.exist") // No success toast
    cy.matchImageSnapshot("dashboard-delete-cancelled")
  })
})
