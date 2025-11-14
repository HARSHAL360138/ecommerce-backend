//https://ecommerce-backend-y1bv.onrender.com/api/user/logout
const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./src/config/db");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const Admin = require("./src/models/Admin");
const adminRoutes = require("./src/routes/admin.routes");
const routes = require("./src/routes/api.routes"); // your existing user routes

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

// ✅ Connect to MongoDB
connectDB();

// ✅ Automatically create default admin if not exists
const createAdmin = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await Admin.create({ email, password: hashedPassword });
      console.log("✅ Default admin created:", email);
    } else {
      console.log("ℹ️ Admin already exists:", email);
    }
  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
  }
};
createAdmin();

// ✅ Routes
app.use("/api", routes);          // Existing user routes
app.use("/api/admin", adminRoutes); // New admin login route

// ✅ Default route
app.get("/", (req, res) => {
  res.send(`<h2>Welcome to Shopping Website</h2>`);
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
