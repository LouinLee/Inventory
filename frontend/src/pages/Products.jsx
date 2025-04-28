// src/pages/Products.jsx

import React, { useState, useEffect } from "react";
import api from "../utils/axios";
import ProductFormModal from "../components/ProductFormModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import ProductDetailModal from "../components/ProductDetailModal";
import { toast } from "react-toastify";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false); // For viewing details
    const [selectedProduct, setSelectedProduct] = useState(null); // For editing
    const [showDeleteModal, setShowDeleteModal] = useState(false); // For delete confirmation
    const [productToDelete, setProductToDelete] = useState(null); // For the product being deleted

    const fetchProducts = async () => {
        try {
            const response = await api.get("/products", { withCredentials: true });
            setProducts(response.data);
        } catch (error) {
            console.error("Failed to fetch products:", error);
            toast.error("Failed to fetch products.");
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleViewDetails = (productId) => {
        setSelectedProduct(productId); // Set ID produk yang dipilih
        setShowDetailModal(true); // Tampilkan modal detail
    };

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    const handleDelete = (product) => {
        setProductToDelete(product);  // Set product to delete
        setShowDeleteModal(true); // Show confirmation modal
    };

    const confirmDelete = async () => {
        try {
            await api.delete(`/products/${productToDelete._id}`, { withCredentials: true });
            toast.success("Product deleted successfully!");
            fetchProducts(); // Refresh after delete
        } catch (error) {
            console.error("Delete failed:", error);
            toast.error("Failed to delete product.");
        }
        setShowDeleteModal(false); // Close modal after action
    };

    const handleCreate = () => {
        setSelectedProduct(null);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        fetchProducts(); // Refresh product list
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>Product List</h3>
                <button className="btn btn-primary" onClick={handleCreate}>
                    Add Product
                </button>
            </div>

            <table className="table table-bordered">
                <thead className="thead-dark">
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product._id}>
                            <td>{product.name}</td>
                            <td>{product.description}</td>
                            <td>{product.quantity}</td>
                            <td>${product.price}</td>
                            <td>{product.category?.name || "-"}</td>
                            <td>
                                <button
                                    className="btn btn-sm btn-info me-2"
                                    onClick={() => handleViewDetails(product._id)}
                                >
                                    View Details
                                </button>
                                <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(product)}>
                                    Edit
                                </button>
                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(product)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {showDetailModal && (
                <ProductDetailModal
                    show={showDetailModal}
                    onClose={() => setShowDetailModal(false)}
                    productId={selectedProduct}
                />
            )}

            {showModal && (
                <ProductFormModal
                    show={showModal}
                    onClose={handleCloseModal}
                    product={selectedProduct}
                />
            )}

            {showDeleteModal && (
                <ConfirmDeleteModal
                    show={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}  // Close without deleting
                    onConfirm={confirmDelete}  // Confirm delete
                    message={`Are you sure you want to delete the product "${productToDelete?.name}"?`}
                />
            )}
        </div>
    );
};

export default Products;
