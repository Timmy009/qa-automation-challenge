import { cy } from "cypress"

describe("Item Management - Edit Item", () => {
  const originalItemName = `Edit Test Item ${Date.now()}`
  const updatedItemName = `Updated Item ${Date.now()}`

  before(() => {
    // Ensure a user is logged in and an item exists for editing
    cy.login("testuser", "password123")
    cy.visit("/dashboard")
    cy.createItem(originalItemName, "Original description", "5", "15.00")
    cy.contains("Item created successfully").should("be.visible")
    cy.logout() // Logout to ensure fresh login for each test
  })

  beforeEach(() => {
    cy.login("testuser", "password123")
    cy.visit("/dashboard")
    cy.contains(originalItemName).should("be.visible") // Ensure the item is visible
  })

  it("should allow a user to edit an existing item with valid data", () => {
    cy.editItem(originalItemName, updatedItemName, "Updated description", "7", "12.50")
    cy.contains("Item updated successfully").should("be.visible")
    cy.contains(updatedItemName).should("be.visible")
    cy.contains(originalItemName).should("not.exist") // Original name should be gone
    cy.matchImageSnapshot("dashboard-after-edit-item")
  })

  it("should display validation errors when editing with invalid data", () => {
    cy.contains(".item-card", originalItemName).find("button").contains("Edit").click()

    // Clear name field
    cy.get("#name").clear()
    cy.contains("Item name is required.").should("be.visible")
    cy.get("button").contains("Save").should("be.disabled")
    cy.matchImageSnapshot("edit-item-empty-name")
    cy.get("#name").type(updatedItemName) // Re-enter valid name

    // Invalid quantity
    cy.get("#quantity").clear().type("0")
    cy.contains("Quantity must be a positive number.").should("be.visible")
    cy.get("button").contains("Save").should("be.disabled")
    cy.matchImageSnapshot("edit-item-invalid-quantity")
    cy.get("#quantity").clear().type("10") // Re-enter valid quantity

    // Invalid price
    cy.get("#price").clear().type("-1")
    cy.contains("Price cannot be negative.").should("be.visible")
    cy.get("button").contains("Save").should("be.disabled")
    cy.matchImageSnapshot("edit-item-invalid-price")
    cy.get("#price").clear().type("20.00") // Re-enter valid price

    // All fields valid, button should be enabled
    cy.get("button").contains("Save").should("not.be.disabled")
    cy.get("button").contains("Save").click() // Save the changes
    cy.contains("Item updated successfully").should("be.visible")
  })
})
