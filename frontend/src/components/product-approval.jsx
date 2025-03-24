import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { getImageUrl } from "../utils/imageUtils";

const PendingProducts = () => {
  const [pendingProducts, setPendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPendingProducts = async () => {
      try {
        const response = await api.get("/api/admin/pending-products");
        setPendingProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching pending products:", error);
        setLoading(false);
      }
    };

    fetchPendingProducts();
  }, []);

  const handleVerifyProduct = async (productId) => {
    try {
      const response = await api.put(`/api/admin/verify-product/${productId}`);
      setPendingProducts(
        pendingProducts.filter((product) => product._id !== productId)
      );
      alert("Product verified successfully");
    } catch (error) {
      console.error("Error verifying product:", error);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="product-approval">
      <h2 className="heading-text">Pending Products</h2>
      {pendingProducts.length === 0 ? (
        <p>No pending products found.</p>
      ) : (
        <ul className="product-approval__list">
          {pendingProducts.map((product) => (
            <li key={product._id}>
              <div className="product-approval__list__image">
                <img
                  src={getImageUrl(product.image)}
                  alt={product.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/LOGO.svg"; // Fallback to logo if product image fails to load
                  }}
                />
              </div>
              <div className="product-approval__list__content">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p>Price: Rs{product.price}</p>
                <button
                  onClick={() => handleVerifyProduct(product._id)}
                  className="btn clickAnimation"
                >
                  Verify
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PendingProducts;
