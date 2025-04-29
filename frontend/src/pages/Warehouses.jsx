// src/pages/Warehouses.jsx

import React, { useState, useEffect } from "react";
import api from "../utils/axios";
import WarehouseFormModal from "../components/WarehouseFormModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import WarehouseInventoryModal from "../components/WarehouseInventoryModal"; // Import the new modal
import { toast } from "react-toastify";

const Warehouses = () => {
    const [warehouses, setWarehouses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedWarehouse, setSelectedWarehouse] = useState(null); // For editing
    const [showDeleteModal, setShowDeleteModal] = useState(false); // For delete confirmation
    const [warehouseToDelete, setWarehouseToDelete] = useState(null); // For the warehouse being deleted

    // State for the inventory modal
    const [showInventoryModal, setShowInventoryModal] = useState(false);
    const [warehouseToView, setWarehouseToView] = useState(null);

    // Fetch all warehouses
    const fetchWarehouses = async () => {
        try {
            const response = await api.get("/warehouses", { withCredentials: true });
            setWarehouses(response.data);
        } catch (error) {
            console.error("Failed to fetch warehouses:", error);
            toast.error("Failed to fetch warehouses.");
        }
    };

    useEffect(() => {
        fetchWarehouses();
    }, []);

    // Handle editing an existing warehouse
    const handleEdit = (warehouse) => {
        setSelectedWarehouse(warehouse);
        setShowModal(true);
    };

    // Handle deleting a warehouse
    const handleDelete = (warehouse) => {
        setWarehouseToDelete(warehouse);
        setShowDeleteModal(true);
    };

    // Confirm delete action
    const confirmDelete = async () => {
        try {
            await api.delete(`/warehouses/${warehouseToDelete._id}`, { withCredentials: true });
            toast.success("Warehouse deleted successfully!");
            fetchWarehouses(); // Refresh warehouse list
        } catch (error) {
            console.error("Delete failed:", error);
            toast.error("Failed to delete warehouse.");
        }
        setShowDeleteModal(false); // Close modal after action
    };

    // Handle creating a new warehouse
    const handleCreate = () => {
        setSelectedWarehouse(null);
        setShowModal(true);
    };

    // Handle closing the modal (after saving or canceling)
    const handleCloseModal = () => {
        setShowModal(false);
        fetchWarehouses(); // Refresh warehouse list
    };

    // Handle opening the inventory modal
    const handleViewInventory = (warehouse) => {
        setWarehouseToView(warehouse);
        setShowInventoryModal(true);
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>Warehouses</h3>
                <button className="btn btn-primary" onClick={handleCreate}>
                    Add Warehouse
                </button>
            </div>

            {warehouses.map((wh) => (
                <div key={wh._id} className="card mb-3 shadow-sm">
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h5 className="card-title mb-1">{wh.name}</h5>
                                <p className="text-muted mb-0">{wh.location || "No location specified"}</p>
                            </div>
                            <div>
                                <button
                                    className="btn btn-sm btn-info me-2"
                                    onClick={() => handleViewInventory(wh)}
                                >
                                    View Inventory
                                </button>
                                <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(wh)}>
                                    Edit
                                </button>
                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(wh)}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {showModal && (
                <WarehouseFormModal
                    show={showModal}
                    onClose={handleCloseModal}
                    warehouse={selectedWarehouse}
                />
            )}

            {showDeleteModal && (
                <ConfirmDeleteModal
                    show={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={confirmDelete}
                    message={`Are you sure you want to delete "${warehouseToDelete?.name}"?`}
                />
            )}

            {showInventoryModal && warehouseToView && (
                <WarehouseInventoryModal
                    show={showInventoryModal}
                    onClose={() => setShowInventoryModal(false)}
                    warehouse={warehouseToView}
                />
            )}
        </div>
    );
};

export default Warehouses;
