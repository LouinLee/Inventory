// routes/outboundRoutes.js

const express = require("express");
const outboundController = require("../controllers/outboundController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// POST route to create outbound
router.post("/", authMiddleware, outboundController.createOutbound);
router.get("/", authMiddleware, outboundController.getAllOutbound);
router.get("/products/:warehouseId", authMiddleware, outboundController.getProductsByWarehouse);

module.exports = router;
