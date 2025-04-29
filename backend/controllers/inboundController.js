// controllers/inboundController.js

const Inbound = require("../models/Inbound");
const Product = require("../models/Product");
const Warehouse = require("../models/Warehouse");
const Inventory = require("../models/Inventory");

exports.createInbound = async (req, res) => {
    try {
        const { warehouseId, products } = req.body;

        // Warehouse validation
        const warehouse = await Warehouse.findById(warehouseId);
        if (!warehouse) {
            return res.status(404).json({ message: "Warehouse not found" });
        }

        // Product validation
        for (let { product, quantity } of products) {
            // // Update product quantity
            // await Product.findByIdAndUpdate(
            //     product,
            //     { $inc: { quantity } }
            // );

            // Update inventory
            const existingProduct = await Product.findById(product);
            if (!existingProduct) {
                return res.status(404).json({ message: `Product with ID ${product} not found` });
            }
            if (quantity <= 0) {
                return res.status(400).json({ message: "Quantity must be greater than 0" });
            }
        }

        // Create new inbound record
        const inbound = new Inbound({
            warehouse: warehouseId,
            products,
        });
        await inbound.save();

        // Update product stock/quantity in Inventory
        for (let { product, quantity } of products) {
            const existingInventory = await Inventory.findOne({ product, warehouse: warehouseId });

            if (existingInventory) {
                await Inventory.findByIdAndUpdate(
                    existingInventory._id,
                    { $inc: { quantity } }
                );
            } else {
                const newInventory = new Inventory({
                    product,
                    warehouse: warehouseId,
                    quantity,
                });
                await newInventory.save();
            }
        }

        res.status(201).json({ message: "Inbound created successfully", inbound });
    } catch (error) {
        console.error("Error creating inbound record:", error);
        res.status(500).json({ message: "Error creating inbound record", error });
    }
};

exports.getAllInbound = async (req, res) => {
    try {
        // Fetch all inbounds and populate related data (warehouse and products)
        const inbounds = await Inbound.find()
            .populate("warehouse", "name")  // Populate the warehouse name
            .populate("products.product", "name");  // Populate product names

        res.status(200).json(inbounds);
    } catch (error) {
        res.status(500).json({ message: "Error fetching inbounds", error });
    }
};
