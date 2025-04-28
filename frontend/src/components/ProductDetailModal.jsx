import React, { useEffect, useState } from "react";
import api from "../utils/axios";

const ProductDetailModal = ({ show, onClose, productId }) => {
    const [productDetails, setProductDetails] = useState(null);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const res = await api.get(`/products/${productId}/details`);
                setProductDetails(res.data);
            } catch (error) {
                console.error("Failed to fetch product details:", error);
            }
        };

        if (show && productId) {
            fetchProductDetails();
        }
    }, [show, productId]);

    if (!productDetails) return null;

    return (
        <div className={`modal fade ${show ? "show d-block" : "d-none"}`} tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            <i className="bi bi-box-seam-fill me-2" style={{ color: "black" }}></i>
                            <strong>Product Details for {productDetails.product.name}</strong>
                        </h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {productDetails.warehouses.length > 0 ? (
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Warehouse</th>
                                        <th>Location</th>
                                        <th>Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productDetails.warehouses.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.warehouse.name}</td>
                                            <td>{item.warehouse.location || "N/A"}</td>
                                            <td>{item.quantity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No warehouses found for this product.</p>
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

export default ProductDetailModal;