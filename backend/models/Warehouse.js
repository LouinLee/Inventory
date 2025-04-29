// models/Warehouse.js

const mongoose = require("mongoose");

const WarehouseSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // Optional
    location: { type: String, required: false }, // Optional
});

module.exports = mongoose.model("Warehouse", WarehouseSchema);
