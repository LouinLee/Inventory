// routes/productRoutes.js

const express = require("express");
const productController = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware"); // Authentication middleware
const router = express.Router();

// Routes for product CRUD operations with authentication middleware

// Create a new product
router.post("/", authMiddleware, productController.createProduct);

// Get all products
router.get("/", authMiddleware, productController.getAllProducts);

// Get a product by ID
router.get("/:id", authMiddleware, productController.getProductById);

// Update a product by ID
router.put("/:id", authMiddleware, productController.updateProduct);

// Delete a product by ID
router.delete("/:id", authMiddleware, productController.deleteProduct);

// Get product details (e.g., for inventory management)
router.get("/:id/details", authMiddleware, productController.getProductDetails);

module.exports = router;
