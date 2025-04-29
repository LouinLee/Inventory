// controllers/outboundController.js

const Outbound = require("../models/Outbound");
const Product = require("../models/Product");
const Warehouse = require("../models/Warehouse");
const Inventory = require("../models/Inventory");

exports.createOutbound = async (req, res) => {
    try {
        const { warehouseId, products } = req.body;

        // Check if warehouse exists
        const warehouse = await Warehouse.findById(warehouseId);
        if (!warehouse) {
            return res.status(404).json({ message: "Warehouse not found" });
        }

        // Validate all products exist in the warehouse
        for (let { product, quantity } of products) {
            const existingProduct = await Product.findById(product);
            if (!existingProduct) {
                return res.status(404).json({ message: `Product with ID ${product} not found` });
            }

            // Check if product exists in inventory for this warehouse and if enough stock is available
            const inventoryRecord = await Inventory.findOne({ product: product, warehouse: warehouseId });
            if (!inventoryRecord || inventoryRecord.quantity < quantity) {
                return res.status(400).json({
                    message: `Not enough stock for product ${existingProduct.name} in the selected warehouse`
                });
            }
        }

        // Create the Outbound record
        const outbound = new Outbound({
            warehouse: warehouseId,
            products
        });

        // Save the Outbound record
        await outbound.save();

        // Update product quantities and inventory in the warehouse
        for (let { product, quantity } of products) {
            // Decrease the product quantity
            await Product.findByIdAndUpdate(
                product,
                { $inc: { quantity: -quantity } }
            );

            // Check if the inventory record exists
            const existingInventory = await Inventory.findOne({ product: product, warehouse: warehouseId });

            if (existingInventory) {
                // If inventory record exists, update the quantity
                await Inventory.findByIdAndUpdate(
                    existingInventory._id,
                    { $inc: { quantity: -quantity } }  // Decrease the stock in inventory
                );
            }
        }

        // Else, delete inventory record if outbound all product quantity to 0
        await Inventory.deleteMany({ warehouse: warehouseId, quantity: { $lte: 0 } });

        res.status(201).json({ message: "Outbound created successfully", outbound });
    } catch (error) {
        res.status(500).json({ message: "Error creating outbound record", error });
    }
};

// Get all outbound records
exports.getAllOutbound = async (req, res) => {
    try {
        const outbounds = await Outbound.find()
            .populate("products.product", "name quantity")
            .populate("warehouse", "name")
            .exec();
        res.status(200).json(outbounds);
    } catch (error) {
        res.status(500).json({ message: "Error fetching outbounds", error });
    }
};

// Get products available in a specific warehouse
exports.getProductsByWarehouse = async (req, res) => {
    const { warehouseId } = req.params;

    try {
        const inventory = await Inventory.find({ warehouse: warehouseId })
            .populate("product", "name quantity");

        if (!inventory || inventory.length === 0) {
            return res.status(404).json({ message: "No products found in this warehouse" });
        }

        res.status(200).json(inventory.map((item) => ({
            productId: item.product._id,
            name: item.product.name,
            quantity: item.quantity,
        })));
    } catch (error) {
        res.status(500).json({ message: "Error fetching products for warehouse", error });
    }
};