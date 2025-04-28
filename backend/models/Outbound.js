// models/Outbound.js

const mongoose = require("mongoose");

const OutboundSchema = new mongoose.Schema({
    warehouse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Warehouse",
        required: true
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Outbound", OutboundSchema);
