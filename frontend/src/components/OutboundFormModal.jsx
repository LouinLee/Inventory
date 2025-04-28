import React, { useEffect, useState } from "react";
import Select from "react-select";
import api from "../utils/axios";
import { toast } from "react-toastify";

const OutboundFormModal = ({ show, onClose, outbound }) => {
    const [warehouseId, setWarehouseId] = useState("");
    const [products, setProducts] = useState([{ product: "", quantity: 0 }]);
    const [warehouses, setWarehouses] = useState([]);
    const [availableProducts, setAvailableProducts] = useState([]);

    useEffect(() => {
        if (outbound) {
            setWarehouseId(outbound.warehouse._id);
            setProducts(outbound.products.map((p) => ({ product: p.product._id, quantity: p.quantity })));
        } else {
            setWarehouseId("");
            setProducts([{ product: "", quantity: 0 }]);
        }
        fetchWarehouses();
    }, [outbound]);

    const fetchWarehouses = async () => {
        try {
            const response = await api.get("/warehouses", { withCredentials: true });
            setWarehouses(response.data);
        } catch (error) {
            console.error("Failed to fetch warehouses:", error);
            toast.error("Failed to fetch warehouses.");
        }
    };

    const fetchProductsByWarehouse = async (warehouseId) => {
        try {
            const response = await api.get(`/outbound/products/${warehouseId}`, { withCredentials: true });
            setAvailableProducts(response.data);
        } catch (error) {
            console.error("Failed to fetch products:", error);
            toast.error("Failed to fetch products for the selected warehouse.");
        }
    };

    const handleWarehouseChange = (selectedOption) => {
        const selectedWarehouseId = selectedOption.value;
        setWarehouseId(selectedWarehouseId);
        setProducts([{ product: "", quantity: 0 }]); // Reset products
        fetchProductsByWarehouse(selectedWarehouseId);
    };

    const handleProductChange = (index, selectedOption) => {
        const newProducts = [...products];
        newProducts[index].product = selectedOption.value;
        setProducts(newProducts);
    };

    const handleAddProduct = () => {
        setProducts([...products, { product: "", quantity: 0 }]);
    };

    const handleRemoveProduct = (index) => {
        const newProducts = products.filter((_, i) => i !== index);
        setProducts(newProducts);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = { warehouseId, products };

        try {
            if (outbound) {
                await api.put(`/outbound/${outbound._id}`, payload, { withCredentials: true });
                toast.success("Outbound updated successfully");
            } else {
                await api.post("/outbound", payload, { withCredentials: true });
                toast.success("Outbound created successfully");
            }
            onClose();
        } catch (error) {
            if (error.response) {
                if (error.response.status === 404) {
                    toast.error(error.response.data.message || "Warehouse or product not found.");
                } else if (error.response.status === 400) {
                    toast.error(error.response.data.message || "Validation error.");
                } else {
                    toast.error(error.response.data.message || "An error occurred.");
                }
            } else {
                toast.error("Failed to connect to the server.");
            }
            console.error("Error saving outbound record:", error);
        }
    };

    const warehouseOptions = warehouses.map((warehouse) => ({
        value: warehouse._id,
        label: warehouse.name,
    }));

    return (
        <div className={`modal fade ${show ? "show d-block" : "d-none"}`} tabIndex="-1" role="dialog">
            <div className="modal-dialog" style={{ maxWidth: "80%", width: "800px" }} role="document">
                <div className="modal-content">
                    <form onSubmit={handleSubmit}>
                        <div className="modal-header">
                            <h5 className="modal-title">{outbound ? "Edit Outbound" : "Add Outbound"}</h5>
                            <button type="button" className="btn-close" onClick={onClose}></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">Warehouse</label>
                                <Select
                                    options={warehouseOptions}
                                    value={warehouseOptions.find((option) => option.value === warehouseId)}
                                    onChange={handleWarehouseChange}
                                    placeholder="Select Warehouse"
                                    isSearchable
                                    required
                                />
                            </div>
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th style={{ width: "50%" }}>Product Name</th>
                                        <th style={{ width: "15%" }}>Available Quantity</th>
                                        <th style={{ width: "25%" }}>Quantity Outbound</th>
                                        <th style={{ width: "10%" }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((productItem, index) => {
                                        const productOptions = availableProducts.map((product) => ({
                                            value: product.productId,
                                            label: product.name,
                                        }));

                                        return (
                                            <tr key={index}>
                                                <td>
                                                    <Select
                                                        options={productOptions}
                                                        value={productOptions.find((option) => option.value === productItem.product)}
                                                        onChange={(selectedOption) => handleProductChange(index, selectedOption)}
                                                        placeholder="Select Product"
                                                        isSearchable
                                                        required
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        value={
                                                            availableProducts.find((p) => p.productId === productItem.product)?.quantity || 0
                                                        }
                                                        disabled
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        name="quantity"
                                                        className="form-control"
                                                        value={productItem.quantity}
                                                        onChange={(e) => {
                                                            const newProducts = [...products];
                                                            newProducts[index].quantity = e.target.value;
                                                            setProducts(newProducts);
                                                        }}
                                                        required
                                                        min="1"
                                                    />
                                                </td>
                                                <td>
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => handleRemoveProduct(index)}
                                                    >
                                                        Remove
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            <button type="button" className="btn btn-secondary" onClick={handleAddProduct}>
                                Add Product
                            </button>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>
                                Close
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Save Outbound
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default OutboundFormModal;