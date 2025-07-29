require('dotenv').config();

const request = require("supertest")
const app = require("../../app/backend/server") // Adjust path to your Express app
const mongoose = require("mongoose")
const User = require("../../app/backend/models/user")
const bcrypt = require("bcryptjs")

describe("Auth API", () => {
  let server
  const testUser = {
    username: "testuser",
    password: "testpassword",
  }

  beforeAll(async () => {
    // Ensure MongoDB is connected before tests run
    if (mongoose.connection.readyState === 0) {
      await require("../../app/backend/config/db")()
    }
    // Start the server for testing
    server = app.listen(5001) // Use a different port for tests
  })

  afterAll(async () => {
    // Close the server after tests
    await server.close()
    // Disconnect from MongoDB
    await mongoose.disconnect()
  })

  beforeEach(async () => {
    // Clean up database before each test
    await User.deleteMany({})
  })

  it("should register a new user", async () => {
    const res = await request(server).post("/api/users/register").send(testUser)
    expect(res.statusCode).toEqual(201)
    expect(res.body).toHaveProperty("_id")
    expect(res.body).toHaveProperty("username", testUser.username)
    expect(res.body).toHaveProperty("token")
  })

  it("should not register a user with existing username", async () => {
    await request(server).post("/api/users/register").send(testUser) // Register first user
    const res = await request(server).post("/api/users/register").send(testUser) // Try to register again
    expect(res.statusCode).toEqual(400)
    expect(res.body.message).toEqual("User already exists")
  })

  it("should login an existing user", async () => {
    // Register the user first
    await request(server).post("/api/users/register").send(testUser)

    const res = await request(server).post("/api/users/login").send(testUser)
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty("_id")
    expect(res.body).toHaveProperty("username", testUser.username)
    expect(res.body).toHaveProperty("token")
  })

  it("should not login with incorrect password", async () => {
    await request(server).post("/api/users/register").send(testUser) // Register user
    const res = await request(server).post("/api/users/login").send({
      username: testUser.username,
      password: "wrongpassword",
    })
    expect(res.statusCode).toEqual(400)
    expect(res.body.message).toEqual("Invalid credentials")
  })

  it("should not login with non-existent username", async () => {
    const res = await request(server).post("/api/users/login").send({
      username: "nonexistent",
      password: "anypassword",
    })
    expect(res.statusCode).toEqual(400)
    expect(res.body.message).toEqual("Invalid credentials")
  })
})
