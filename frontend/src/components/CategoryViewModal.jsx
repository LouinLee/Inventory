const CategoryViewModal = ({ show, onClose, category, products }) => {
    if (!category) return null;

    return (
        <div className={`modal fade ${show ? "show d-block" : "d-none"}`} tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            <i className="bi bi-tags-fill me-2" style={{ color: "black" }}></i>
                            <strong>Category Details for {category.name}</strong>
                        </h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {products && products.length > 0 ? (
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Product Name</th>
                                        <th>Description</th>
                                        <th>Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product, index) => (
                                        <tr key={index}>
                                            <td>{product.name}</td>
                                            <td>{product.description || "No description"}</td>
                                            <td>{product.price ? product.price.toLocaleString("id-ID") : "N/A"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No products found for this category.</p>
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

export default CategoryViewModal;