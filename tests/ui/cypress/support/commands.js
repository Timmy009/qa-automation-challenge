// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is a window command --
// Cypress.Commands.add('populateLocalStorage', (value) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import "./authCommands"
import "./crudCommands"
import { addMatchImageSnapshotCommand } from "cypress-image-snapshot/command"
import Cypress from "cypress"
import { cy } from "cypress"

addMatchImageSnapshotCommand({
  failureThreshold: 0.03,
  failureThresholdType: "percent",
  customDiffConfig: { threshold: 0.1 },
  capture: "viewport",
})

Cypress.Commands.add("setLocalStorage", (key, value) => {
  cy.window().then((window) => {
    window.localStorage.setItem(key, value)
  })
})

Cypress.Commands.add("getLocalStorage", (key) => {
  cy.window().then((window) => {
    return window.localStorage.getItem(key)
  })
})

Cypress.Commands.add("clearLocalStorage", () => {
  cy.window().then((window) => {
    window.localStorage.clear()
  })
})
