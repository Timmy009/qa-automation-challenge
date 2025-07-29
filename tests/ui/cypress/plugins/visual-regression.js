const { addMatchImageSnapshotPlugin } = require("cypress-image-snapshot/plugin")

module.exports = (on, config) => {
  addMatchImageSnapshotPlugin(on, config)
  // Additional configuration or plugins can be added here if needed
}
