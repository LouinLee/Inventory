import React, { useState, useEffect } from "react";
import api from "../utils/axios";
import OutboundFormModal from "../components/OutboundFormModal";
import OutboundViewModal from "../components/OutboundViewModal";
import { toast } from "react-toastify";

const Outbound = () => {
    const [outbounds, setOutbounds] = useState([]);
    const [showFormModal, setShowFormModal] = useState(false);
    const [selectedOutbound, setSelectedOutbound] = useState(null);

    const fetchOutbounds = async () => {
        try {
            const response = await api.get("/outbound", { withCredentials: true });
            setOutbounds(response.data);
        } catch (error) {
            console.error("Failed to fetch outbounds:", error);
            toast.error("Failed to fetch outbound records.");
        }
    };

    useEffect(() => {
        fetchOutbounds();
    }, []);

    const handleCreate = () => {
        setSelectedOutbound(null);
        setShowFormModal(true);
    };

    const handleView = (outbound) => {
        setSelectedOutbound(outbound);
    };

    const handleCloseModals = () => {
        setShowFormModal(false);
        setSelectedOutbound(null);
        fetchOutbounds();
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>Outbound Shipments</h3>
                <button className="btn btn-primary" onClick={handleCreate}>
                    Add Outbound
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
                    {outbounds.map((outbound) => (
                        <tr key={outbound._id}>
                            <td>{outbound.warehouse.name}</td>
                            <td>{outbound.products.map(p => p.product.name).join(", ")}</td>
                            <td>{new Date(outbound.date).toLocaleDateString()}</td>
                            <td>
                                <button className="btn btn-sm btn-info" onClick={() => handleView(outbound)}>
                                    View
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showFormModal && (
                <OutboundFormModal show={showFormModal} onClose={handleCloseModals} />
            )}

            {selectedOutbound && (
                <OutboundViewModal
                    show={!!selectedOutbound}
                    outbound={selectedOutbound}
                    onClose={handleCloseModals}
                />
            )}
        </div>
    );
};

export default Outbound;
