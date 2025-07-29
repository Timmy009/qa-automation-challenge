import { cy } from "cypress"

describe("Item Management - Create Item", () => {
  beforeEach(() => {
    cy.login("testuser", "password123") // Ensure user is logged in
    cy.visit("/dashboard")
  })

  it("should allow a user to create a new item with valid data", () => {
    const itemName = `New Item ${Date.now()}`
    cy.createItem(itemName, "Description for new item", "10", "9.99")
    cy.contains("Item created successfully").should("be.visible")
    cy.contains(itemName).should("be.visible")
    cy.matchImageSnapshot("dashboard-after-create-item")
  })

  it("should display validation errors for invalid item data", () => {
    cy.get("button").contains("Add New Item").click()

    // Empty name
    cy.get("#description").type("Some description")
    cy.get("#quantity").type("5")
    cy.get("#price").type("10.00")
    cy.get("button").contains("Save").should("be.disabled")
    cy.contains("Item name is required.").should("be.visible")
    cy.matchImageSnapshot("create-item-empty-name")
    cy.get("#name").type("Valid Name") // Fill to enable save

    // Invalid quantity
    cy.get("#quantity").clear().type("0")
    cy.contains("Quantity must be a positive number.").should("be.visible")
    cy.get("button").contains("Save").should("be.disabled")
    cy.get("#quantity").clear().type("-5")
    cy.contains("Quantity must be a positive number.").should("be.visible")
    cy.get("button").contains("Save").should("be.disabled")
    cy.get("#quantity").clear().type("10") // Fill to enable save

    // Invalid price
    cy.get("#price").clear().type("-1")
    cy.contains("Price cannot be negative.").should("be.visible")
    cy.get("button").contains("Save").should("be.disabled")
    cy.get("#price").clear().type("abc")
    cy.contains("Price is required.").should("be.visible") // Assuming it becomes required if not a number
    cy.get("button").contains("Save").should("be.disabled")
    cy.get("#price").clear().type("10.00") // Fill to enable save

    // All fields valid, button should be enabled
    cy.get("button").contains("Save").should("not.be.disabled")
  })
})
