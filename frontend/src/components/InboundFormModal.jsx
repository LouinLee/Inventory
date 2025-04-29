import React, { useEffect, useState } from "react";
import Select from "react-select";
import api from "../utils/axios";
import { toast } from "react-toastify";

const InboundFormModal = ({ show, onClose, inbound }) => {
    const [warehouseId, setWarehouseId] = useState("");
    const [products, setProducts] = useState([{ product: "", quantity: 0 }]);
    const [warehouses, setWarehouses] = useState([]);
    const [allProducts, setAllProducts] = useState([]);

    useEffect(() => {
        if (inbound) {
            setWarehouseId(inbound.warehouse._id);
            setProducts(inbound.products.map((p) => ({ product: p.product._id, quantity: p.quantity })));
        } else {
            setWarehouseId("");
            setProducts([{ product: "", quantity: 0 }]);
        }
        fetchWarehouses();
        fetchAllProducts();
    }, [inbound]);

    const fetchWarehouses = async () => {
        try {
            const response = await api.get("/warehouses", { withCredentials: true });
            setWarehouses(response.data);
        } catch (error) {
            console.error("Failed to fetch warehouses:", error);
            toast.error("Failed to fetch warehouses.");
        }
    };

    const fetchAllProducts = async () => {
        try {
            const response = await api.get("/products", { withCredentials: true });
            setAllProducts(response.data);
        } catch (error) {
            console.error("Failed to fetch products:", error);
            toast.error("Failed to fetch products.");
        }
    };

    const handleWarehouseChange = (selectedOption) => {
        setWarehouseId(selectedOption.value);
    };

    const handleProductChange = (index, selectedOption) => {
        const newProducts = [...products];
        newProducts[index].product = selectedOption.value;
        setProducts(newProducts);
    };

    const handleQuantityChange = (index, e) => {
        const newProducts = [...products];
        newProducts[index].quantity = e.target.value;
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

        // Validasi warehouseId
        if (!warehouseId) {
            toast.error("Please select a warehouse.");
            return;
        }

        // Validasi products
        if (products.length === 0 || products.some((p) => !p.product || p.quantity <= 0)) {
            toast.error("Please ensure all products are selected and have a valid quantity.");
            return;
        }

        const payload = { warehouseId, products };

        try {
            if (inbound) {
                await api.put(`/inbound/${inbound._id}`, payload, { withCredentials: true });
                toast.success("Inbound updated successfully");
            } else {
                await api.post("/inbound", payload, { withCredentials: true });
                toast.success("Inbound created successfully");
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
            console.error("Error saving inbound record:", error);
        }
    };

    const warehouseOptions = warehouses.map((warehouse) => ({
        value: warehouse._id,
        label: warehouse.name,
    }));

    const productOptions = allProducts.map((product) => ({
        value: product._id,
        label: product.name,
    }));

    return (
        <div className={`modal fade ${show ? "show d-block" : "d-none"}`} tabIndex="-1" role="dialog">
            <div className="modal-dialog" style={{ maxWidth: "80%", width: "800px" }} role="document">
                <div className="modal-content">
                    <form onSubmit={handleSubmit}>
                        <div className="modal-header">
                            <h5 className="modal-title">
                                <i className="bi bi-box-arrow-in-down me-2" style={{ color: "black" }}></i>
                                <strong>{inbound ? "Edit Inbound" : "Add Inbound"}</strong>
                            </h5>
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
                                        <th style={{ width: "70%" }}>Product Name</th>
                                        <th style={{ width: "20%" }}>Quantity</th>
                                        <th style={{ width: "10%" }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((productItem, index) => (
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
                                                    value={productItem.quantity}
                                                    onChange={(e) => handleQuantityChange(index, e)}
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
                                    ))}
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
                                Save Inbound
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default InboundFormModal;