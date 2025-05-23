// models/Product.js

const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    // quantity: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: false, default:null },
});

module.exports = mongoose.model("Product", ProductSchema);
