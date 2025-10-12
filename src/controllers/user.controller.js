const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Token = require("../models/token.model");
const { tokenBlacklist } = require("../middlewares/user.middleware");

const ACCESS_TOKEN_SECRET_KEY = process.env.ACCESS_TOKEN_SECRET_KEY;
const REFRESH_TOKEN_SECRET_KEY = process.env.REFRESH_TOKEN_SECRET_KEY;

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const accessToken = jwt.sign(
      { id: user._id, email: user.email },
      ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { id: user._id, email: user.email },
      REFRESH_TOKEN_SECRET_KEY,
      { expiresIn: "7d" }
    );

    const userTokens = await Token.find({ userId: user._id }).sort({ createdAt: 1 });
    if (userTokens.length >= 4) {
      await Token.deleteOne({ _id: userTokens[0]._id });
    }

    await Token.create({ userId: user._id, token: refreshToken });

    res.json({
      user: { id: user._id, name: user.name, email: user.email },
      message: "Login successful",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).json({ message: "Refresh token is required" });

    const storedToken = await Token.findOne({ token: refreshToken });
    if (!storedToken)
      return res.status(403).json({ message: "Invalid refresh token" });

    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET_KEY, async (err, user) => {
      if (err) return res.status(403).json({ message: "Invalid refresh token" });

      await Token.deleteOne({ _id: storedToken._id });

      const newAccessToken = jwt.sign(
        { id: user.id, email: user.email },
        ACCESS_TOKEN_SECRET_KEY,
        { expiresIn: "15m" }
      );
      const newRefreshToken = jwt.sign(
        { id: user.id, email: user.email },
        REFRESH_TOKEN_SECRET_KEY,
        { expiresIn: "7d" }
      );

      const userTokens = await Token.find({ userId: user.id }).sort({ createdAt: 1 });
      if (userTokens.length >= 4) {
        await Token.deleteOne({ _id: userTokens[0]._id });
      }

      await Token.create({ userId: user.id, token: newRefreshToken });

      res.json({
        message: "Token refreshed successfully",
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (token) {
      tokenBlacklist.push(token);
    }

    await Token.deleteMany({ userId: req.user.id });
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.profile = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
};


