module.exports = {
  testEnvironment: "node",
  testMatch: ["**/*.test.js"],
  setupFiles: ["dotenv/config"], // Load .env variables for tests
  setupFilesAfterEnv: ["./jest.setup.js"],
  verbose: true,
  forceExit: true, // Ensure Jest exits after tests
  detectOpenHandles: true, // Helps identify why Jest might not be exiting
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  coverageDirectory: "./coverage",
  collectCoverageFrom: [
    "app/backend/**/*.js",
    "!app/backend/server.js", // Exclude server entry file
    "!app/backend/config/db.js", // Exclude DB config
    "!app/backend/models/*.js", // Exclude Mongoose models
    "!app/backend/routes/*.js", // Exclude routes as they are mostly just wiring
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/app/backend/$1",
  },
}
