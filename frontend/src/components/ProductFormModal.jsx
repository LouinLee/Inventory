import React, { useEffect, useState } from "react";
import axios from "../utils/axios";
import { toast } from "react-toastify";
import Select from "react-select";

const ProductFormModal = ({ show, onClose, product }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const [priceError, setPriceError] = useState(""); // For price validation error

    // Populate form when editing product
    useEffect(() => {
        if (product) {
            setName(product.name || "");
            setDescription(product.description || "");
            setPrice(product.price || "");
            setCategory(product.category?._id || "");
        } else {
            setName("");
            setDescription("");
            setPrice("");
            setCategory("");
        }
    }, [product]);

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get("/categories", { withCredentials: true });
                setCategories(res.data);
            } catch (err) {
                console.error("Failed to fetch categories", err);
                toast.error("Failed to fetch categories");
            }
        };
        fetchCategories();
    }, []);

    // Validate price input
    const handlePriceChange = (e) => {
        const value = e.target.value;
        setPrice(value);
        if (isNaN(value) || value <= 0) {
            setPriceError("Price must be a positive number");
        } else {
            setPriceError("");
        }
    };

    // Form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (priceError) {
            toast.error(priceError);
            return;
        }

        const payload = {
            name,
            description,
            price,
            category: category || null,
        };

        try {
            if (product) {
                // Edit product
                await axios.put(`/products/${product._id}`, payload, { withCredentials: true });
                toast.success("Product updated successfully");
            } else {
                // Create new product
                await axios.post("/products", payload, { withCredentials: true });
                toast.success("Product created successfully");
            }
            onClose(); // Close modal
        } catch (error) {
            if (error.response) {
                // Handle specific backend errors
                if (error.response.status === 400) {
                    toast.error(error.response.data.message || "Validation error");
                } else if (error.response.status === 404) {
                    toast.error("Product not found");
                } else {
                    toast.error(error.response.data.message || "An error occurred");
                }
            } else {
                // Handle network or other errors
                toast.error("Failed to connect to the server");
            }
            console.error("Error saving product:", error);
        }
    };

    return (
        <div className={`modal fade ${show ? "show d-block" : "d-none"}`} tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <form onSubmit={handleSubmit}>
                        <div className="modal-header">
                            <h5 className="modal-title">
                                <i className="bi bi-box-seam-fill me-2" style={{ color: "black" }}></i>
                                <strong>{product ? "Edit Product" : "Add Product"}</strong>
                            </h5>
                            <button type="button" className="btn-close" onClick={onClose}></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label"><strong>Name</strong></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label"><strong>Description</strong></label>
                                <textarea
                                    className="form-control"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                ></textarea>
                            </div>
                            <div className="mb-3">
                                <label className="form-label"><strong>Price</strong></label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={price}
                                    onChange={handlePriceChange}
                                    required
                                    step="0.01"
                                />
                                {priceError && <div className="text-danger">{priceError}</div>}
                            </div>
                            <div className="mb-3">
                                <label className="form-label"><strong>Category</strong></label>
                                <Select
                                    options={categories.map((cat) => ({
                                        value: cat._id,
                                        label: cat.name,
                                    }))}
                                    value={categories
                                        .map((cat) => ({ value: cat._id, label: cat.name }))
                                        .find((option) => option.value === category)}
                                    onChange={(selectedOption) => setCategory(selectedOption ? selectedOption.value : "")}
                                    placeholder="Select Category"
                                    isSearchable
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                {product ? "Update" : "Create"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProductFormModal;