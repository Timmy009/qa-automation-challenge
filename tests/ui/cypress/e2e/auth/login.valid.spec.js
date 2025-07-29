import { cy } from "cypress"

describe("Login - Valid Credentials", () => {
  beforeEach(() => {
    cy.visit("/login")
    cy.fixture("users").then((user) => {
      cy.wrap(user.validUser).as("validUser")
    })
  })

  it("should allow a user to log in with valid credentials", function () {
    cy.login(this.validUser.username, this.validUser.password)
    cy.url().should("include", "/dashboard")
    cy.contains("Login successful").should("be.visible")
    cy.matchImageSnapshot("dashboard-after-login")
  })

  it("should redirect to dashboard if already logged in", function () {
    // Simulate a logged-in state by setting local storage
    cy.setLocalStorage("user", JSON.stringify({ token: "fake-token", username: this.validUser.username }))
    cy.visit("/login")
    cy.url().should("include", "/dashboard")
  })
})
