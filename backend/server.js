// server.js

const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/database");
const authRoutes = require("./routes/authRoutes"); // Import auth routes
const categoryRoutes = require("./routes/categoryRoutes"); // Import category routes
const productRoutes = require("./routes/productRoutes"); // Import product routes
const warehouseRoutes = require("./routes/warehouseRoutes"); // Import warehouse routes
const inboundRoutes = require("./routes/inboundRoutes");
const outboundRoutes = require("./routes/outboundRoutes"); // Import outbound routes
const inventoryRoutes = require("./routes/inventoryRoutes");

const cookieParser = require("cookie-parser"); // Add this

const app = express();
connectDB();

// Middleware
app.use(express.json());
// app.use(cors());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
  }));
app.use(cookieParser()); // Use cookie-parser to parse cookies

// Routes
app.use("/api/auth", authRoutes);  // Authentication routes (Login, Register, etc.)
app.use("/api/categories", categoryRoutes);  // Category routes (Get, Create, Update, Delete)
app.use("/api/products", productRoutes); // Use product routes for handling products
app.use("/api/warehouses", warehouseRoutes); // Use warehouse routes for handling warehouses
app.use("/api/inbound", inboundRoutes);  // New Inbound Routes
app.use("/api/outbound", outboundRoutes);  // New Outbound Routes
app.use("/api/inventory", inventoryRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
