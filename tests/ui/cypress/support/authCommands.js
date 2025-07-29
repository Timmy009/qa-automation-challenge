const Cypress = require("cypress")
const cy = Cypress.cy

Cypress.Commands.add("login", (username, password) => {
  cy.visit("/login")
  cy.get("#username").type(username)
  cy.get("#password").type(password)
  cy.get('button[type="submit"]').click()
})

Cypress.Commands.add("logout", () => {
  // Assuming there's a logout button or mechanism on the dashboard
  // This might need adjustment based on your actual UI
  cy.get("button").contains("Logout").click()
  cy.url().should("include", "/login")
})

Cypress.Commands.add("register", (username, password) => {
  cy.visit("/register") // Assuming a register page exists
  cy.get("#username").type(username)
  cy.get("#password").type(password)
  cy.get('button[type="submit"]').click()
})
