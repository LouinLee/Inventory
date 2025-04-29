// models/Inbound.js

const mongoose = require("mongoose");

const InboundSchema = new mongoose.Schema({
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

module.exports = mongoose.model("Inbound", InboundSchema);
