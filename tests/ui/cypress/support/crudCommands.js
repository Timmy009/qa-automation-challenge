const Cypress = require("cypress")
const cy = Cypress.cy

Cypress.Commands.add("createItem", (name, description, quantity, price) => {
  cy.get("button").contains("Add New Item").click()
  cy.get("#name").type(name)
  cy.get("#description").type(description)
  cy.get("#quantity").type(quantity)
  cy.get("#price").type(price)
  cy.get("button").contains("Save").click()
})

Cypress.Commands.add("editItem", (itemName, newName, newDescription, newQuantity, newPrice) => {
  cy.contains(".item-card", itemName).find("button").contains("Edit").click()
  if (newName) cy.get("#name").clear().type(newName)
  if (newDescription) cy.get("#description").clear().type(newDescription)
  if (newQuantity) cy.get("#quantity").clear().type(newQuantity)
  if (newPrice) cy.get("#price").clear().type(newPrice)
  cy.get("button").contains("Save").click()
})

Cypress.Commands.add("deleteItem", (itemName) => {
  cy.contains(".item-card", itemName).find("button").contains("Delete").click()
  cy.get("button").contains("Confirm").click() // Assuming a confirmation dialog
})
