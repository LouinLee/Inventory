import React from "react";

const InboundViewModal = ({ show, onClose, inbound }) => {
    if (!inbound) return null;

    return (
        <div className={`modal fade ${show ? "show d-block" : "d-none"}`} tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            <i className="bi bi-box-arrow-in-down me-2" style={{ color: "black" }}></i>
                            <strong>Inbound Details for {inbound.warehouse?.name}</strong>
                        </h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <table className="table">
                            <tbody>
                                <tr>
                                    <div className="text-start">
                                        <strong>Date:</strong> {new Date(inbound.date).toLocaleDateString()}
                                    </div>
                                </tr>
                            </tbody>
                        </table>
                        {inbound.products.length > 0 ? (
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {inbound.products.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.product.name}</td>
                                            <td>{item.quantity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No products found for this inbound record.</p>
                        )}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InboundViewModal;