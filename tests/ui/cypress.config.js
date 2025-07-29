const { defineConfig } = require("cypress")
const { addMatchImageSnapshotPlugin } = require("cypress-image-snapshot/plugin")

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      addMatchImageSnapshotPlugin(on, config)
      // implement node event listeners here
      // Be sure to return the config object as it might have been modified by the plugin.
      return config
    },
    baseUrl: "http://localhost:3000", // Default base URL for your frontend
    specPattern: "cypress/e2e/**/*.spec.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.js",
    screenshotsFolder: "cypress/screenshots",
    videosFolder: "cypress/videos",
    fixturesFolder: "cypress/fixtures",
    viewportWidth: 1280,
    viewportHeight: 720,
  },
})
