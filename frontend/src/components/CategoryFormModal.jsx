import React, { useEffect, useState } from "react";
import axios from "../utils/axios";
import { toast } from "react-toastify";

const CategoryFormModal = ({ show, onClose, category }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    // Populate form with existing category data for editing
    useEffect(() => {
        if (category) {
            setName(category.name || "");
            setDescription(category.description || "");
        } else {
            setName("");
            setDescription("");
        }
    }, [category]);

    // Form submission logic
    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            name,
            description,
        };

        try {
            if (category) {
                // Edit category
                await axios.put(`/categories/${category._id}`, payload, { withCredentials: true });
                toast.success("Category updated successfully");
            } else {
                // Create category
                await axios.post("/categories", payload, { withCredentials: true });
                toast.success("Category created successfully");
            }
            onClose(); // Close the modal
        } catch (error) {
            if (error.response) {
                // Handle specific backend errors
                if (error.response.status === 400) {
                    toast.error(error.response.data.message || "Validation error");
                } else if (error.response.status === 404) {
                    toast.error("Category not found");
                } else {
                    toast.error(error.response.data.message || "An error occurred");
                }
            } else {
                // Handle network or other errors
                toast.error("Failed to connect to the server");
            }
            console.error("Error saving category:", error);
        }
    };

    return (
        <div className={`modal fade ${show ? "show d-block" : "d-none"}`} tabIndex="-1" role="dialog">
            <div className="modal-dialog" style={{ maxWidth: "50%", width: "600px" }} role="document">
                <div className="modal-content">
                    <form onSubmit={handleSubmit}>
                        <div className="modal-header">
                            <h5 className="modal-title">
                                <i className="bi bi-tags-fill me-2" style={{ color: "black" }}></i>
                                <strong>{category ? "Edit Category" : "Add Category"}</strong>
                            </h5>
                            <button type="button" className="btn-close" onClick={onClose}></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label"><strong>Category Name</strong></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter category name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label"><strong>Description</strong></label>
                                <textarea
                                    className="form-control"
                                    placeholder="Enter category description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                ></textarea>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                {category ? "Update" : "Create"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CategoryFormModal;