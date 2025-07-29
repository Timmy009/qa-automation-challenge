// cypress/support/e2e.js
// ***********************************************************
// This example support file is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands"
import "./authCommands"
import "./crudCommands"
import "cypress-real-events/support"
import "cypress-image-snapshot/command" // Ensure this is imported

const addMatchImageSnapshotCommand = require("cypress-image-snapshot/command").addMatchImageSnapshotCommand // Corrected import

addMatchImageSnapshotCommand({
  failureThreshold: 0.03,
  failureThresholdType: "percent",
  customDiffConfig: { threshold: 0.1 },
  capture: "viewport",
})

// Alternatively, you can extend Cypress's types and use existing global commands.
// For example:
// Cypress.Commands.add('login', (email, password) => { ... })
