const express = require("express")
const router = express.Router()
const { register, login } = require("../controllers/auth-controller")

router.post("/register", register)
router.post("/login", login)

// Additional routes or middleware can be added here if needed

module.exports = router
