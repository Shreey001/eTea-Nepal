import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { getImageUrl } from "../utils/imageUtils";

const SellersList = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const response = await api.get("/api/admin/sellers");
        setSellers(response.data);

        // Debug images
        console.log("Sellers data:", response.data);
        if (response.data.length > 0) {
          console.log(
            "Sample image URL:",
            getImageUrl(response.data[0].avatar)
          );
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching sellers:", error);
        setLoading(false);
      }
    };

    fetchSellers();
  }, []);

  return (
    <div className="sellers-list">
      <h1 className="heading-text">Sellers List</h1>
      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <div className="sellers-grid">
          {sellers.map((seller) => (
            <div key={seller._id} className="seller-card">
              <img
                src={getImageUrl(seller.avatar)}
                alt={seller.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/LOGO.svg"; // Fallback to logo if image fails to load
                }}
              />
              <h3>{seller.name}</h3>
              <p>Business: {seller.businessName}</p>
              <p>Email: {seller.email}</p>
              <Link to={`/seller-report/${seller._id}`} className="btn">
                View Report
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellersList;
