import React, { useState, useEffect } from "react";
import api from "../utils/axios";
import CategoryFormModal from "../components/CategoryFormModal";
import CategoryViewModal from "../components/CategoryViewModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { toast } from "react-toastify";

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [categoryProducts, setCategoryProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);

    const fetchCategories = async () => {
        try {
            const response = await api.get("/categories", { withCredentials: true });
            setCategories(response.data);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
            toast.error("Failed to fetch categories.");
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleViewCategory = async (categoryId) => {
        try {
            const response = await api.get(`/categories/${categoryId}`, { withCredentials: true });
            setSelectedCategory(response.data.category); // Simpan data kategori
            setCategoryProducts(response.data.products); // Simpan daftar produk
            setShowViewModal(true); // Tampilkan modal
        } catch (error) {
            console.error("Failed to fetch category details:", error);
            toast.error("Failed to load category details.");
        }
    };

    const handleEdit = (category) => {
        setSelectedCategory(category);
        setShowModal(true);
    };

    const handleDelete = (category) => {
        setCategoryToDelete(category);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            await api.delete(`/categories/${categoryToDelete._id}`, { withCredentials: true });
            toast.success("Category deleted successfully!");
            fetchCategories();
        } catch (error) {
            console.error("Delete failed:", error);
            toast.error("Failed to delete category.");
        }
        setShowDeleteModal(false);
    };

    const handleCreate = () => {
        setSelectedCategory(null);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        fetchCategories();
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>Category List</h3>
                <button className="btn btn-primary" onClick={handleCreate}>
                    Add Category
                </button>
            </div>

            <table className="table table-bordered">
                <thead className="thead-dark">
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((category) => (
                        <tr key={category._id}>
                            <td>{category.name}</td>
                            <td>{category.description || "-"}</td>
                            <td>
                                <button
                                    className="btn btn-sm btn-info me-2"
                                    onClick={() => handleViewCategory(category._id)}
                                >
                                    View
                                </button>
                                <button
                                    className="btn btn-sm btn-warning me-2"
                                    onClick={() => handleEdit(category)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDelete(category)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showViewModal && (
                <CategoryViewModal
                    show={showViewModal}
                    onClose={() => setShowViewModal(false)}
                    category={selectedCategory} // Data kategori
                    products={categoryProducts} // Daftar produk
                />
            )}

            {showModal && (
                <CategoryFormModal
                    show={showModal}
                    onClose={handleCloseModal}
                    category={selectedCategory}
                />
            )}

            {showDeleteModal && (
                <ConfirmDeleteModal
                    show={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={confirmDelete}
                    message={`Are you sure you want to delete the category "${categoryToDelete?.name}"?`}
                />
            )}
        </div>
    );
};

export default Categories;