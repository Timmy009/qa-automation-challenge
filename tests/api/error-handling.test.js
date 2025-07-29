const request = require("supertest")
const app = require("../../app/backend/server") // Adjust path to your Express app
const mongoose = require("mongoose")
const User = require("../../app/backend/models/user")
const Item = require("../../app/backend/models/item")

describe("Error Handling", () => {
  let server
  let token
  const testUser = {
    username: "erroruser",
    password: "errorpassword",
  }

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await require("../../app/backend/config/db")()
    }
    server = app.listen(5003) // Use a different port for error handling tests
  })

  afterAll(async () => {
    await server.close()
    await mongoose.disconnect()
  })

  beforeEach(async () => {
    await User.deleteMany({})
    await Item.deleteMany({})

    const registerRes = await request(server).post("/api/users/register").send(testUser)
    token = registerRes.body.token
  })

  it("should return 404 for an invalid route", async () => {
    const res = await request(server).get("/api/nonexistent-route")
    expect(res.statusCode).toEqual(404)
  })

  it("should return 401 for unauthorized access to protected routes", async () => {
    const res = await request(server).get("/api/items") // No token provided
    expect(res.statusCode).toEqual(401)
    expect(res.body.message).toEqual("Not authorized, no token")
  })

  it("should return 401 for invalid token", async () => {
    const res = await request(server).get("/api/items").set("Authorization", "Bearer invalidtoken")
    expect(res.statusCode).toEqual(401)
    expect(res.body.message).toEqual("Not authorized, token failed")
  })

  it("should return 400 for invalid item ID format on PUT", async () => {
    const res = await request(server)
      .put("/api/items/invalididformat")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Test", description: "Test", quantity: 1, price: 1 })
    expect(res.statusCode).toEqual(400) // Mongoose CastError results in 400
    expect(res.body.message).toContain("Cast to ObjectId failed")
  })

  it("should return 400 for invalid item ID format on DELETE", async () => {
    const res = await request(server).delete("/api/items/invalididformat").set("Authorization", `Bearer ${token}`)
    expect(res.statusCode).toEqual(400) // Mongoose CastError results in 400
    expect(res.body.message).toContain("Cast to ObjectId failed")
  })

  it("should return 500 for internal server errors (simulated)", async () => {
    // Temporarily modify a controller to throw an unexpected error
    const itemController = require("../../app/backend/controllers/items-controller")
    const originalGetItems = itemController.getItems
    itemController.getItems = (req, res, next) => {
      next(new Error("Simulated internal server error"))
    }

    const res = await request(server).get("/api/items").set("Authorization", `Bearer ${token}`)

    expect(res.statusCode).toEqual(500)
    expect(res.body.message).toEqual("Simulated internal server error")

    // Restore original function
    itemController.getItems = originalGetItems
  })
})
