// routes/warehouseRoutes.js

const express = require("express");
const warehouseController = require("../controllers/warehouseController");
const authMiddleware = require("../middleware/authMiddleware"); // Authentication middleware
const router = express.Router();

// Routes for warehouse CRUD operations with authentication middleware

// Create a new warehouse
router.post("/", authMiddleware, warehouseController.createWarehouse);

// Get all warehouses
router.get("/", authMiddleware, warehouseController.getAllWarehouses);

// Get a warehouse by ID
router.get("/:id", authMiddleware, warehouseController.getWarehouseById);

// Update a warehouse by ID
router.put("/:id", authMiddleware, warehouseController.updateWarehouse);

// Delete a warehouse by ID
router.delete("/:id", authMiddleware, warehouseController.deleteWarehouse);

module.exports = router;
