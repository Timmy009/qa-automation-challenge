const express = require("express")
const router = express.Router()
const auth = require("../middleware/auth-middleware")
const { getItems, createItem, updateItem, deleteItem } = require("../controllers/items-controller")

router.route("/").get(auth, getItems).post(auth, createItem)

router.route("/:id").put(auth, updateItem).delete(auth, deleteItem)

module.exports = router
