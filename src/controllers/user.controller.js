const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Token = require("../models/token.model");
const UserProfile = require("../models/profile.model");
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


// // Profile routes

// exports.createProfile = async (req, res) => {
//   try {
//     if (!req.user || !req.user.id) {
//       return res.status(401).json({ message: "Unauthorized: no user info found" });
//     }

//     const existing = await UserProfile.findOne({ user: req.user.id });
//     if (existing) {
//       return res.status(400).json({ message: "Profile already exists" });
//     }

//     const profile = new UserProfile({ user: req.user.id, ...req.body });
//     await profile.save();

//     res.status(201).json({ message: "Profile created successfully", profile });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };



// exports.getProfile = async (req, res) => {
//   try {
//     const profile = await UserProfile.findOne({ user: req.user.id }).populate("user", "name email");
//     if (!profile) return res.status(404).json({ message: "Profile not found" });

//     res.status(200).json({ message: "Profile fetched successfully", profile });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };


// exports.editProfile = async (req, res) => {
//   try {
//     const updates = req.body;
//     let profile = await UserProfile.findOne({ user: req.user.id });

//     if (!profile) {
//       profile = new UserProfile({ user: req.user.id, ...updates });
//     } else {
//       Object.assign(profile, updates);
//     }

//     await profile.save();
//     res.status(200).json({ message: "Profile updated successfully", profile });
//   } catch (err) {
//     res.status(500).json({ message: "Error updating profile", error: err.message });
//   }
// };



// // 🔴 DELETE PROFILE
// exports.deleteProfile = async (req, res) => {
//   try {
//     const profile = await UserProfile.findOneAndDelete({ user: req.user.id });

//     if (!profile) {
//       return res.status(404).json({ message: "Profile not found" });
//     }

//     res.json({ message: "Profile deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ message: "Error deleting profile", error: err.message });
//   }
// };





// 🟢 CREATE PROFILE
exports.createProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const existing = await UserProfile.findOne({ user: req.user.id });
    if (existing) {
      return res.status(400).json({ message: "Profile already exists" });
    }

    const profile = new UserProfile({ user: req.user.id, ...req.body });
    await profile.save();

    res.status(201).json({ message: "Profile created successfully", profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 🟡 EDIT PROFILE
exports.editProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const updates = req.body;

    let profile = await UserProfile.findOne({ user: req.user.id });
    if (!profile) {
      // Auto-create profile if not exists
      profile = new UserProfile({ user: req.user.id, ...updates });
    } else {
      Object.assign(profile, updates);
    }

    await profile.save();
    res.status(200).json({ message: "Profile updated successfully", profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating profile", error: err.message });
  }
};

// 🔹 GET PROFILE (always return name/email)
exports.getProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const profile = await UserProfile.findOne({ user: req.user.id }).populate("user", "name email");

    if (profile) {
      return res.status(200).json({ message: "Profile fetched successfully", profile });
    }

    // Profile not exists → return basic user info
    const user = await User.findById(req.user.id).select("name email");
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({
      message: "Profile not created yet, returning basic user info",
      profile: {
        user: user,
        phone: null,
        gender: null,
        dateOfBirth: null,
        profileImage: null,
        addresses: [],
        wishlist: [],
        cart: [],
        orderHistory: []
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 🔴 DELETE PROFILE
exports.deleteProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const profile = await UserProfile.findOneAndDelete({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json({ message: "Profile deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting profile", error: err.message });
  }
};



// 🔴 DELETE ACCOUNT
exports.deleteAccount = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Delete UserProfile (if exists)
    await UserProfile.findOneAndDelete({ user: req.user.id });

    // Delete User
    const deletedUser = await User.findByIdAndDelete(req.user.id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Optional: clear all refresh tokens for this user
    const Token = require("../models/token.model");
    await Token.deleteMany({ userId: req.user.id });

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting account", error: err.message });
  }
};
