// routes/categoryRoutes.js
const express = require("express");
const categoryController = require("../controllers/categoryController");
const authMiddleware = require("../middleware/authMiddleware"); // Import authMiddleware
const router = express.Router();

router.use(authMiddleware); // All routes below will require authentication

// Using singular 'category' in routes
router.post("/", categoryController.createCategory);  // POST '/api/category'
router.get("/", categoryController.getAllCategories);  // GET '/api/category'
router.get("/:id", categoryController.getCategoryById);  // GET '/api/category/:id'
router.put("/:id", categoryController.updateCategory);  // PUT '/api/category/:id'
router.delete("/:id", categoryController.deleteCategory);  // DELETE '/api/category/:id'
router.get("/:id", categoryController.getCategoryById);  // GET '/api/category/:id'

module.exports = router;
