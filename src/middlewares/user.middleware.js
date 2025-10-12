const jwt = require("jsonwebtoken");

const ACCESS_TOKEN_SECRET_KEY = process.env.ACCESS_TOKEN_SECRET_KEY;
let tokenBlacklist = [];

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1];
    if (tokenBlacklist.includes(token))
      return res.status(403).json({ message: "Token is invalid (logged out)" });

    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET_KEY);
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = { authMiddleware, tokenBlacklist };
