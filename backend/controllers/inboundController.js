// controllers/inboundController.js

const Inbound = require("../models/Inbound");
const Product = require("../models/Product");
const Warehouse = require("../models/Warehouse");
const Inventory = require("../models/Inventory");  // Assuming you have an Inventory model

// exports.createInbound = async (req, res) => {
//     try {
//         const { warehouseId, products } = req.body; // Assuming products is an array [{ productId, quantity }]

//         // Check if warehouse exists
//         const warehouse = await Warehouse.findById(warehouseId);
//         if (!warehouse) {
//             return res.status(404).json({ message: "Warehouse not found" });
//         }

//         // Validate all products exist
//         for (let { product, quantity } of products) {
//             const existingProduct = await Product.findById(product);
//             if (!existingProduct) {
//                 return res.status(404).json({ message: `Product with ID ${product} not found` });
//             }
//         }

//         // Create the Inbound record
//         const inbound = new Inbound({
//             warehouse: warehouseId,
//             products
//         });

//         // Save the Inbound record
//         await inbound.save();

//         // Now, update product quantities and inventory in the warehouse
//         for (let { product, quantity } of products) {
//             // Update the product quantity
//             await Product.findByIdAndUpdate(
//                 product,
//                 { $inc: { quantity: quantity } }  // Increment the stock by quantity
//             );

//             // Check if this product already has an inventory record in this warehouse
//             const existingInventory = await Inventory.findOne({ product: product, warehouse: warehouseId });

//             if (existingInventory) {
//                 // If inventory record exists, update the quantity
//                 await Inventory.findByIdAndUpdate(
//                     existingInventory._id,
//                     { $inc: { quantity: quantity } }
//                 );
//             } else {
//                 // If no inventory record exists, create a new one
//                 const newInventory = new Inventory({
//                     product: product,
//                     warehouse: warehouseId,
//                     quantity: quantity
//                 });
//                 await newInventory.save();
//             }
//         }

//         res.status(201).json({ message: "Inbound created successfully", inbound });
//     } catch (error) {
//         res.status(500).json({ message: "Error creating inbound record", error });
//     }
// };

exports.createInbound = async (req, res) => {
    try {
        const { warehouseId, products } = req.body;

        // Validasi warehouse
        const warehouse = await Warehouse.findById(warehouseId);
        if (!warehouse) {
            return res.status(404).json({ message: "Warehouse not found" });
        }

        // Validasi produk
        for (let { product, quantity } of products) {
            const existingProduct = await Product.findById(product);
            if (!existingProduct) {
                return res.status(404).json({ message: `Product with ID ${product} not found` });
            }
            if (quantity <= 0) {
                return res.status(400).json({ message: "Quantity must be greater than 0" });
            }
        }

        // Buat record Inbound
        const inbound = new Inbound({
            warehouse: warehouseId,
            products,
        });
        await inbound.save();

        // Update stok produk di Inventory
        for (let { product, quantity } of products) {
            const existingInventory = await Inventory.findOne({ product, warehouse: warehouseId });

            if (existingInventory) {
                await Inventory.findByIdAndUpdate(
                    existingInventory._id,
                    { $inc: { quantity } } // Tambahkan stok
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
