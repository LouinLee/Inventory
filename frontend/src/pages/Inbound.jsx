// src/Pages/Inbound.jsx

import React, { useState, useEffect } from "react";
import api from "../utils/axios";
import InboundFormModal from "../components/InboundFormModal";
import InboundViewModal from "../components/InboundViewModal";
import { toast } from "react-toastify";

const Inbound = () => {
    const [inbounds, setInbounds] = useState([]);
    const [showFormModal, setShowFormModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedInbound, setSelectedInbound] = useState(null);

    const fetchInbounds = async () => {
        try {
            const response = await api.get("/inbound", { withCredentials: true });
            setInbounds(response.data);
        } catch (error) {
            console.error("Failed to fetch inbounds:", error);
            toast.error("Failed to fetch inbounds.");
        }
    };

    useEffect(() => {
        fetchInbounds();
    }, []);

    const handleCreate = () => {
        setSelectedInbound(null);
        setShowFormModal(true);
    };

    const handleView = (inbound) => {
        setSelectedInbound(inbound);
        setShowViewModal(true);
    };

    const handleCloseModals = () => {
        setShowFormModal(false);
        setShowViewModal(false);
        fetchInbounds();
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>Inbound Shipments</h3>
                <button className="btn btn-primary" onClick={handleCreate}>
                    Add Inbound
                </button>
            </div>

            <table className="table table-bordered">
                <thead className="thead-dark">
                    <tr>
                        <th>Warehouse</th>
                        <th>Products</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {inbounds.map((inbound) => (
                        <tr key={inbound._id}>
                            <td>{inbound.warehouse.name}</td>
                            <td>{inbound.products.map(product => product.product.name).join(", ")}</td>
                            <td>{new Date(inbound.date).toLocaleDateString()}</td>
                            <td>
                                <button className="btn btn-sm btn-info" onClick={() => handleView(inbound)}>
                                    View
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showFormModal && (
                <InboundFormModal
                    show={showFormModal}
                    onClose={handleCloseModals}
                    inbound={null}
                />
            )}

            {showViewModal && (
                <InboundViewModal
                    show={showViewModal}
                    onClose={handleCloseModals}
                    inbound={selectedInbound}
                />
            )}
        </div>
    );
};

export default Inbound;
