// routes/inboundRoutes.js

const express = require("express");
const inboundController = require("../controllers/inboundController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// POST route to create inbound
router.post("/", authMiddleware, inboundController.createInbound);
router.get("/", inboundController.getAllInbound);
// router.get("/:id", inboundController.getInboundById);

module.exports = router;
