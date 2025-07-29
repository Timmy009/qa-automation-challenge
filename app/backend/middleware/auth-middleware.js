const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
  // Get token from header
  const token = req.header("Authorization")

  // Check if not token
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" })
  }

  // Extract token (remove "Bearer " prefix)
  const tokenString = token.startsWith("Bearer ") ? token.slice(7, token.length) : token

  try {
    const decoded = jwt.verify(tokenString, process.env.JWT_SECRET)
    req.user = decoded.user
    next()
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" })
  }
}
