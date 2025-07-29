
const request = require("supertest")
const app = require("../../app/backend/server") // Adjust path to your Express app
const mongoose = require("mongoose")
const User = require("../../app/backend/models/user")
const Item = require("../../app/backend/models/item")
const validItems = require("./test-data/validItems.json")
const invalidItems = require("./test-data/invalidItems.json")
require('dotenv').config();

describe("Items API", () => {
  let server
  let token
  let userId
  const testUser = {
    username: "itemtestuser",
    password: "itemtestpassword",
  }

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await require("../../app/backend/config/db")()
    }
    server = app.listen(5002) // Use a different port for items tests
  })

  afterAll(async () => {
    await server.close()
    await mongoose.disconnect()
  })

  beforeEach(async () => {
    await User.deleteMany({})
    await Item.deleteMany({})

    // Register and login a user to get a token
    const registerRes = await request(server).post("/api/users/register").send(testUser)
    userId = registerRes.body._id
    token = registerRes.body.token
  })

  describe("GET /api/items", () => {
    it("should fetch all items for the authenticated user", async () => {
      // Create some items for the user
      await request(server).post("/api/items").set("Authorization", `Bearer ${token}`).send(validItems[0])
      await request(server).post("/api/items").set("Authorization", `Bearer ${token}`).send(validItems[1])

      const res = await request(server).get("/api/items").set("Authorization", `Bearer ${token}`)

      expect(res.statusCode).toEqual(200)
      expect(res.body.length).toEqual(2)
      expect(res.body[0]).toHaveProperty("name", validItems[0].name)
      expect(res.body[1]).toHaveProperty("name", validItems[1].name)
    })

    it("should return 401 if no token is provided", async () => {
      const res = await request(server).get("/api/items")
      expect(res.statusCode).toEqual(401)
      expect(res.body.message).toEqual("Not authorized, no token")
    })
  })

  describe("POST /api/items", () => {
    it("should create a new item", async () => {
      const newItem = validItems[0]
      const res = await request(server).post("/api/items").set("Authorization", `Bearer ${token}`).send(newItem)

      expect(res.statusCode).toEqual(201)
      expect(res.body).toHaveProperty("_id")
      expect(res.body).toHaveProperty("name", newItem.name)
      expect(res.body).toHaveProperty("description", newItem.description)
      expect(res.body).toHaveProperty("quantity", newItem.quantity)
      expect(res.body).toHaveProperty("price", newItem.price)
      expect(res.body).toHaveProperty("user", userId)
    })

    it("should return 400 if required fields are missing", async () => {
      const invalidItem = { name: "Missing Desc" } // Missing description, quantity, price
      const res = await request(server).post("/api/items").set("Authorization", `Bearer ${token}`).send(invalidItem)

      expect(res.statusCode).toEqual(400)
      expect(res.body.message).toContain("Please add all fields")
    })

    it("should return 400 for invalid quantity (&lt;= 0)", async () => {
      const itemWithInvalidQuantity = invalidItems[1] // quantity: 0
      const res = await request(server)
        .post("/api/items")
        .set("Authorization", `Bearer ${token}`)
        .send(itemWithInvalidQuantity)

      expect(res.statusCode).toEqual(400)
      expect(res.body.message).toEqual("Quantity must be a positive number.")
    })

    it("should return 400 for invalid price (&lt; 0)", async () => {
      const itemWithInvalidPrice = invalidItems[2] // price: -50
      const res = await request(server)
        .post("/api/items")
        .set("Authorization", `Bearer ${token}`)
        .send(itemWithInvalidPrice)

      expect(res.statusCode).toEqual(400)
      expect(res.body.message).toEqual("Price cannot be negative.")
    })
  })

  describe("PUT /api/items/:id", () => {
    let existingItem

    beforeEach(async () => {
      const res = await request(server).post("/api/items").set("Authorization", `Bearer ${token}`).send(validItems[0])
      existingItem = res.body
    })

    it("should update an existing item", async () => {
      const updatedData = {
        name: "Updated Laptop",
        description: "Updated description for the laptop.",
        quantity: 7,
        price: 1300.0,
      }
      const res = await request(server)
        .put(`/api/items/${existingItem._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updatedData)

      expect(res.statusCode).toEqual(200)
      expect(res.body).toHaveProperty("name", updatedData.name)
      expect(res.body).toHaveProperty("quantity", updatedData.quantity)
    })

    it("should return 404 if item not found", async () => {
      const nonExistentId = new mongoose.Types.ObjectId()
      const updatedData = validItems[0]
      const res = await request(server)
        .put(`/api/items/${nonExistentId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updatedData)

      expect(res.statusCode).toEqual(404)
      expect(res.body.message).toEqual("Item not found")
    })

    it("should return 401 if user is not authorized to update item", async () => {
      // Create another user and item
      const anotherUserRes = await request(server).post("/api/users/register").send({
        username: "anotheruser",
        password: "anotherpassword",
      })
      const anotherUserToken = anotherUserRes.body.token

      const anotherItemRes = await request(server)
        .post("/api/items")
        .set("Authorization", `Bearer ${anotherUserToken}`)
        .send(validItems[2])
      const anotherItem = anotherItemRes.body

      const updatedData = {
        name: "Attempted Hack",
        description: "Trying to update someone else's item.",
        quantity: 1,
        price: 1,
      }

      // Try to update another user's item with the original user's token
      const res = await request(server)
        .put(`/api/items/${anotherItem._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updatedData)

      expect(res.statusCode).toEqual(401)
      expect(res.body.message).toEqual("User not authorized")
    })
  })

  describe("DELETE /api/items/:id", () => {
    let existingItem

    beforeEach(async () => {
      const res = await request(server).post("/api/items").set("Authorization", `Bearer ${token}`).send(validItems[0])
      existingItem = res.body
    })

    it("should delete an existing item", async () => {
      const res = await request(server).delete(`/api/items/${existingItem._id}`).set("Authorization", `Bearer ${token}`)

      expect(res.statusCode).toEqual(200)
      expect(res.body.message).toEqual("Item removed")

      // Verify item is deleted
      const getRes = await request(server).get("/api/items").set("Authorization", `Bearer ${token}`)
      expect(getRes.body.length).toEqual(0)
    })

    it("should return 404 if item not found", async () => {
      const nonExistentId = new mongoose.Types.ObjectId()
      const res = await request(server).delete(`/api/items/${nonExistentId}`).set("Authorization", `Bearer ${token}`)

      expect(res.statusCode).toEqual(404)
      expect(res.body.message).toEqual("Item not found")
    })

    it("should return 401 if user is not authorized to delete item", async () => {
      // Create another user and item
      const anotherUserRes = await request(server).post("/api/users/register").send({
        username: "deleteuser",
        password: "deletepassword",
      })
      const anotherUserToken = anotherUserRes.body.token

      const anotherItemRes = await request(server)
        .post("/api/items")
        .set("Authorization", `Bearer ${anotherUserToken}`)
        .send(validItems[2])
      const anotherItem = anotherItemRes.body

      // Try to delete another user's item with the original user's token
      const res = await request(server).delete(`/api/items/${anotherItem._id}`).set("Authorization", `Bearer ${token}`)

      expect(res.statusCode).toEqual(401)
      expect(res.body.message).toEqual("User not authorized")
    })
  })
})
