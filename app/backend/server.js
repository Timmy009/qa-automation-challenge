require("dotenv").config({ path: "./app/backend/.env" })
const express = require("express")
const cors = require("cors")
const connectDB = require("./config/db")
const authRoutes = require("./routes/auth-routes")
const itemRoutes = require("./routes/item-routes")
const errorHandler = require("./middleware/error-handler")

const app = express()

// Connect Database
connectDB()

// Init Middleware
app.use(express.json({ extended: false }))
app.use(cors())

// Define Routes
app.use("/api/auth", authRoutes)
app.use("/api/items", itemRoutes)

// Error handling middleware
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
