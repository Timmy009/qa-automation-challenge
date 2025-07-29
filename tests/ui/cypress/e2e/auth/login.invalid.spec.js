import { cy } from "cypress"

describe("Login - Invalid Credentials", () => {
  beforeEach(() => {
    cy.visit("/login")
    cy.fixture("users").then((user) => {
      cy.wrap(user.invalidUser).as("invalidUser")
      cy.wrap(user.validUser).as("validUser")
    })
  })

  it("should display an error message for invalid password", function () {
    cy.login(this.validUser.username, this.invalidUser.password)
    cy.contains("Invalid credentials").should("be.visible")
    cy.url().should("include", "/login")
    cy.matchImageSnapshot("login-invalid-password")
  })

  it("should display an error message for non-existent username", function () {
    cy.login(this.invalidUser.username, this.invalidUser.password)
    cy.contains("Invalid credentials").should("be.visible")
    cy.url().should("include", "/login")
    cy.matchImageSnapshot("login-non-existent-user")
  })

  it("should display validation errors for empty username and password", () => {
    cy.get('button[type="submit"]').should("be.disabled") // Initially disabled

    cy.get("#username").type("a")
    cy.get("#username").clear()
    cy.contains("Username is required.").should("be.visible")
    cy.get('button[type="submit"]').should("be.disabled")

    cy.get("#username").type("testuser")
    cy.get("#password").type("a")
    cy.get("#password").clear()
    cy.contains("Password is required.").should("be.visible")
    cy.get('button[type="submit"]').should("be.disabled")

    cy.matchImageSnapshot("login-empty-fields")
  })

  it("should display validation error for short username", () => {
    cy.get("#username").type("ab") // Less than 3 characters
    cy.get("#password").type("password123")
    cy.contains("Username must be at least 3 characters long.").should("be.visible")
    cy.get('button[type="submit"]').should("be.disabled")
    cy.matchImageSnapshot("login-short-username")
  })

  it("should display validation error for short password", () => {
    cy.get("#username").type("testuser")
    cy.get("#password").type("123") // Less than 6 characters
    cy.contains("Password must be at least 6 characters long.").should("be.visible")
    cy.get('button[type="submit"]').should("be.disabled")
    cy.matchImageSnapshot("login-short-password")
  })
})
