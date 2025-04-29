// src/components/WarehouseFormModal.jsx

import React, { useEffect, useState } from "react";
import axios from "../utils/axios";
import { toast } from "react-toastify";

const WarehouseFormModal = ({ show, onClose, warehouse }) => {
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");

    // Populate form with existing warehouse data for editing
    useEffect(() => {
        if (warehouse) {
            setName(warehouse.name || "");
            setLocation(warehouse.location || "");
        } else {
            setName("");
            setLocation("");
        }
    }, [warehouse]);

    // Form submission logic
    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            name,
            location,
        };

        try {
            if (warehouse) {
                // Edit warehouse
                await axios.put(`/warehouses/${warehouse._id}`, payload, { withCredentials: true });
                toast.success("Warehouse updated successfully");
            } else {
                // Create warehouse
                await axios.post("/warehouses", payload, { withCredentials: true });
                toast.success("Warehouse created successfully");
            }
            onClose(); // Close the modal
        } catch (error) {
            if (error.response) {
                // Handle specific backend errors
                if (error.response.status === 400) {
                    toast.error(error.response.data.message || "Validation error");
                } else if (error.response.status === 404) {
                    toast.error("Warehouse not found");
                } else {
                    toast.error(error.response.data.message || "An error occurred");
                }
            } else {
                // Handle network or other errors
                toast.error("Failed to connect to the server");
            }
            console.error("Error saving warehouse:", error);
        }
    };

    return (
        <div className={`modal fade ${show ? "show d-block" : "d-none"}`} tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <form onSubmit={handleSubmit}>
                        <div className="modal-header">
                            <h5 className="modal-title">
                                <i className="bi bi-box2-fill me-2" style={{ color: "black" }}></i>
                                <strong>{warehouse ? "Edit Warehouse" : "Add Warehouse"}</strong>
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
                                <label className="form-label"><strong>Location</strong></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                {warehouse ? "Update" : "Create"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default WarehouseFormModal;