import React from "react";

const OutboundViewModal = ({ show, onClose, outbound }) => {
    if (!outbound) return null;

    return (
        <div className={`modal fade ${show ? "show d-block" : "d-none"}`} tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            <i className="bi bi-box-arrow-up me-2" style={{ color: "black" }}></i>
                            <strong>Outbound Details for {outbound.warehouse?.name}</strong>
                        </h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <table className="table">
                            <tbody>
                                <tr>
                                    <div className="text-start">
                                        <strong>Date:</strong> {new Date(outbound.date).toLocaleDateString()}
                                    </div>
                                </tr>
                            </tbody>
                        </table>
                        {outbound.products.length > 0 ? (
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {outbound.products.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.product.name}</td>
                                            <td>{item.quantity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No products found for this outbound record.</p>
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

export default OutboundViewModal;