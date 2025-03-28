import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { getImageUrl } from "../utils/imageUtils";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    initialPrice: "",
  });

  // Fetch products from the server
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/api/products");
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle product deletion
  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/api/products/${productId}`);
        setProducts(products.filter((product) => product._id !== productId));
        alert("Product deleted successfully");
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product");
      }
    }
  };

  // Handle product editing
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      stock: product.stock || "",
      initialPrice: product.initialPrice || "",
    });
  };

  // Handle form data change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit updated product data
  const handleSave = async () => {
    if (editingProduct) {
      try {
        const response = await api.put(
          `/api/products/${editingProduct._id}`,
          formData
        );
        setProducts(
          products.map((product) =>
            product._id === editingProduct._id ? response.data : product
          )
        );
        setEditingProduct(null);
        alert("Product updated successfully");
      } catch (error) {
        console.error("Error updating product:", error);
        alert("Failed to update product");
      }
    }
  };

  const handleCancel = () => {
    setEditingProduct(null);
  };

  return (
    <div className="manage-products">
      {editingProduct ? (
        <div className="edit-product-form">
          <h1 className="heading-text">Edit Product</h1>
          <div className="product-item">
            <div className="form-group ">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Initial Price</label>
              <input
                type="number"
                name="initialPrice"
                value={formData.initialPrice}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-actions">
            <button onClick={handleSave} className="btn clickAnimation">
              Save
            </button>
            <button
              onClick={handleCancel}
              className="btn clickAnimation"
              style={{
                backgroundColor: "transparent",
                color: "black",
                border: ".5px solid black",
                marginLeft: ".5rem",
                marginTop: "1rem",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <h1 className="heading-text">Manage Products</h1>
          <h2>Welcome, Ashish!</h2>
          {loading ? (
            <p className="loading">Loading...</p>
          ) : (
            <div className="product-list">
              {products.map((product) => (
                <div key={product._id} className="product-item">
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <p>In Stock {product.stock}</p>
                    <p>Final price Rs {product.price}</p>
                    {product.initialPrice && (
                      <p>Initial price Rs {product.initialPrice}</p>
                    )}
                  </div>
                  <div className="product-actions">
                    <button
                      onClick={() => handleEdit(product)}
                      className="btn clickAnimation"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="btn clickAnimation ml"
                      style={{
                        backgroundColor: "red",
                        marginLeft: ".5rem",
                        marginTop: ".5rem",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                  <img src={getImageUrl(product.image)} alt={product.name} />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ManageProducts;
