import React, { useEffect, useState } from "react";
import api from "../api/axios";

const CompareProducts = () => {
  const [products, setProducts] = useState([]);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/api/products", {
          headers: {
            "x-auth-token": localStorage.getItem("x-auth-token"),
          },
        });
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Handle product selection
  const handleProductSelect = (productId) => {
    if (selectedProductIds.includes(productId)) {
      setSelectedProductIds(
        selectedProductIds.filter((id) => id !== productId)
      );
    } else {
      setSelectedProductIds([...selectedProductIds, productId]);
    }
  };

  // Handle compare button click
  const handleCompare = async () => {
    if (selectedProductIds.length < 2) {
      alert("Select at least two products to compare.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.get("/api/algorithms/compare-products", {
        params: { ids: selectedProductIds.join(",") },
      });

      if (response.data && response.data.length > 0) {
        const productNames = response.data.map((product) => product.name);
        const alertMessage = productNames.join(
          " IS BETTER VALUE FOR MONEY THAN "
        );
        alert(`${alertMessage}`);
        setSelectedProductIds([]);
      }
    } catch (error) {
      console.error("Error fetching comparison data:", error);
    }

    setLoading(false);
  };

  return (
    <div className="compare-products">
      <h1 className="heading-text">Compare Products</h1>
      <div className="compare-products__content">
        <div className="compare-products__content__wrapper">
          <h2>Choose Products</h2>
          {loading ? (
            <p className="loading">Loading products...</p>
          ) : (
            <>
              {products.map((product) => (
                <div
                  key={product._id}
                  className="compare-products__content__wrapper__products"
                >
                  <input
                    type="checkbox"
                    id={product._id}
                    checked={selectedProductIds.includes(product._id)}
                    onChange={() => handleProductSelect(product._id)}
                  />
                  <label htmlFor={product._id}>{product.name}</label>
                </div>
              ))}
              <button onClick={handleCompare} disabled={loading}>
                {loading ? "Comparing..." : "Compare"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompareProducts;
