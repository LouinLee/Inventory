import React, { useEffect, useState } from "react";
import api from "../utils/axios";
import { toast } from "react-toastify";

const WarehouseInventoryModal = ({ show, onClose, warehouse }) => {
    const [inventory, setInventory] = useState([]);

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const res = await api.get(`/inventory/warehouse/${warehouse._id}`, {
                    withCredentials: true,
                });
                setInventory(res.data);
            } catch (err) {
                console.error("Failed to fetch inventory:", err);
                toast.error("Failed to load inventory.");
            }
        };

        if (show && warehouse) {
            fetchInventory();
        }
    }, [show, warehouse]);

    // Hitung total value dari semua subtotal
    const totalValue = inventory.reduce((total, item) => {
        if (item.product?.price) {
            return total + item.quantity * item.product.price;
        }
        return total;
    }, 0);

    return (
        <div className={`modal fade ${show ? "show d-block" : "d-none"}`} tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            <i className="bi bi-box2-fill me-2" style={{ color: "black" }}></i>
                            <strong>Inventory for {warehouse?.name}</strong>
                        </h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {inventory.length === 0 ? (
                            <p>No inventory found for this warehouse.</p>
                        ) : (
                            <>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Quantity</th>
                                            <th>Price</th>
                                            <th>Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {inventory.map((item) => (
                                            <tr key={item._id}>
                                                <td>{item.product?.name || "Unknown"}</td>
                                                <td>{item.quantity}</td>
                                                <td>
                                                    {item.product?.price
                                                        ? `$${item.product.price.toLocaleString("id-ID")}`
                                                        : "N/A"}
                                                </td>
                                                <td>
                                                    {item.product?.price
                                                        ? `$${(item.quantity * item.product.price).toLocaleString("id-ID")}`
                                                        : "N/A"}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {/* Total Value */}
                                <div className="d-flex justify-content-end mt-3">
                                    <table className="table w-auto">
                                        <tbody>
                                            <tr>
                                                <td className="text-end">
                                                    <strong>Total Value:</strong>
                                                </td>
                                                <td className="text-end">
                                                    ${totalValue.toLocaleString("id-ID")}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={onClose}>
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WarehouseInventoryModal;