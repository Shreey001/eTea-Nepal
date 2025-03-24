import React, { useEffect, useState } from "react";
import api from "../api/axios";

const VerifySeller = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      const response = await api.get("/api/admin/sellers");
      setSellers(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching sellers", err);
      setLoading(false);
    }
  };

  const handleVerification = async (sellerId) => {
    try {
      await api.put(`/api/admin/verify/seller/${sellerId}`);
      alert("Success ✅");
      fetchSellers();
    } catch (err) {
      console.error("Error verifying seller", err);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="verify-seller">
      <h2>Verify Sellers</h2>
      <ul>
        {sellers.map((seller) => (
          <li key={seller._id}>
            <span>
              {seller.name} ({seller.verified ? "Verified" : "Unverified"})
            </span>
            <span>{seller.email}</span>
            <button onClick={() => handleVerification(seller._id)}>
              {seller.verified ? "Unverify" : "Verify"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VerifySeller;
