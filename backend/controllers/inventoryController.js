// controllers/inventoryController.js

const Inventory = require("../models/Inventory");

exports.getByWarehouse = async (req, res) => {
    try {
        const inventory = await Inventory.find({ warehouse: req.params.warehouseId })
            .populate("product", "name price")
            .populate("warehouse", "name");
        res.json(inventory);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch inventory", error: err });
    }
};
