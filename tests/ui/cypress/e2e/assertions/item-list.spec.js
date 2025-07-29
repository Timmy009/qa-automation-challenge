// tests/ui/cypress/e2e/assertions/item-list.spec.js
const cy = require("cypress")

describe("Item List Assertions", () => {
  beforeEach(() => {
    cy.fixture("users").then((users) => {
      cy.loginViaAPI(users.validUser.username, users.validUser.password)
    })
    cy.visit("/dashboard")
  })

  it('should display "No items yet" when the list is empty', () => {
    // Ensure the list is empty by deleting all items if any exist
    cy.request({
      method: "GET",
      url: "http://localhost:5002/api/items", // Corrected port
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")).token}`,
      },
    }).then((response) => {
      if (response.body.length > 0) {
        response.body.forEach((item) => {
          cy.request({
            method: "DELETE",
            url: `http://localhost:5002/api/items/${item._id}`, // Corrected port
            headers: {
              Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")).token}`,
            },
          })
        })
      }
    })
    cy.reload() // Reload to reflect changes
    cy.contains("No items yet. Add one above!").should("be.visible")
  })

  it("should display multiple items in the list", () => {
    const item1 = `Item A ${Date.now()}`
    const item2 = `Item B ${Date.now() + 1}`
    const item3 = `Item C ${Date.now() + 2}`

    cy.createItem(item1)
    cy.createItem(item2)
    cy.createItem(item3)

    cy.contains(item1).should("be.visible")
    cy.contains(item2).should("be.visible")
    cy.contains(item3).should("be.visible")

    cy.get("ul > li").should("have.length", 3)
  })

  it("should update item status visually when checkbox is toggled", () => {
    const itemName = `Toggle Me ${Date.now()}`
    cy.createItem(itemName)

    // Mark as completed
    cy.contains(itemName).parents("li").find('input[type="checkbox"]').check()
    cy.contains("Item Status Updated").should("be.visible")
    cy.contains(itemName).should("have.class", "line-through")

    // Mark as incomplete
    cy.contains(itemName).parents("li").find('input[type="checkbox"]').uncheck()
    cy.contains("Item Status Updated").should("be.visible")
    cy.contains(itemName).should("not.have.class", "line-through")
  })

  it("should capture a visual snapshot of the dashboard", () => {
    // Add some items for a consistent snapshot
    cy.createItem(`Snapshot Item 1 ${Date.now()}`)
    cy.createItem(`Snapshot Item 2 ${Date.now() + 1}`)
    cy.wait(500) // Give time for UI to settle
    cy.matchImageSnapshot("dashboard-initial-state")
  })
})
