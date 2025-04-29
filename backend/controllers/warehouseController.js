// controllers/warehouseController.js

const Warehouse = require("../models/Warehouse");
const Inbound = require("../models/Inbound");
const Outbound = require("../models/Outbound");

// Create a new warehouse
exports.createWarehouse = async (req, res) => {
    const { name, location } = req.body;
    try {
        const existingWarehouse = await Warehouse.findOne({ name });
        if (existingWarehouse) {
            return res.status(400).json({ message: "Warehouse name already exists" });
        }

        const warehouse = new Warehouse({ name, location });
        await warehouse.save();
        res.status(201).json({ message: "Warehouse created successfully", warehouse });
    } catch (error) {
        res.status(500).json({ message: "Error creating warehouse", error: error.message });
    }
};

// Get all warehouses
exports.getAllWarehouses = async (req, res) => {
    try {
        const warehouses = await Warehouse.find();
        res.status(200).json(warehouses);
    } catch (error) {
        res.status(500).json({ message: "Error fetching warehouses", error });
    }
};

// Get a single warehouse by ID
exports.getWarehouseById = async (req, res) => {
    const { id } = req.params;

    try {
        const warehouse = await Warehouse.findById(id);
        if (!warehouse) return res.status(404).json({ message: "Warehouse not found" });
        res.status(200).json(warehouse);
    } catch (error) {
        res.status(500).json({ message: "Error fetching warehouse", error });
    }
};

// Update a warehouse by ID
exports.updateWarehouse = async (req, res) => {
    const { id } = req.params;
    const { name, location } = req.body;

    try {
        const existingWarehouse = await Warehouse.findOne({ name, _id: { $ne: id } });
        if (existingWarehouse) {
            return res.status(400).json({ message: "Warehouse name already exists" });
        }

        const warehouse = await Warehouse.findByIdAndUpdate(
            id,
            { name, location },
            { new: true }
        );
        if (!warehouse) {
            return res.status(404).json({ message: "Warehouse not found" });
        }

        res.status(200).json({ message: "Warehouse updated successfully", warehouse });
    } catch (error) {
        res.status(500).json({ message: "Error updating warehouse", error: error.message });
    }
};

// Delete a warehouse by ID
exports.deleteWarehouse = async (req, res) => {
    const { id } = req.params;

    try {
        const warehouse = await Warehouse.findByIdAndDelete(id);
        if (!warehouse) return res.status(404).json({ message: "Warehouse not found" });
        res.status(200).json({ message: "Warehouse deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting warehouse", error });
    }
};

// Get all warehouses
exports.getAllWarehouses = async (req, res) => {
    try {
        const warehouses = await Warehouse.find();

        const warehousesWithStats = await Promise.all(
            warehouses.map(async (warehouse) => {
                const inboundCount = await Inbound.aggregate([
                    { $match: { warehouse: warehouse._id } },
                    { $unwind: "$products" },
                    { $group: { _id: null, total: { $sum: "$products.quantity" } } },
                ]);

                const outboundCount = await Outbound.aggregate([
                    { $match: { warehouse: warehouse._id } },
                    { $unwind: "$products" },
                    { $group: { _id: null, total: { $sum: "$products.quantity" } } },
                ]);

                return {
                    ...warehouse.toObject(),
                    inboundCount: inboundCount[0]?.total || 0,
                    outboundCount: outboundCount[0]?.total || 0,
                };
            })
        );

        res.status(200).json(warehousesWithStats);
    } catch (error) {
        console.error("Error fetching warehouses:", error);
        res.status(500).json({ message: "Error fetching warehouses", error });
    }
};