import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

const SellerReport = () => {
  const { sellerId } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSellerReport = async () => {
      try {
        const response = await api.get(`/api/admin/seller-report/${sellerId}`);
        setReport(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch seller report");
        setLoading(false);
      }
    };

    fetchSellerReport();
  }, [sellerId]);

  const handleVerification = async (sellerId) => {
    try {
      await api.put(`/api/admin/verify/seller/${sellerId}`);
      alert("Success ✅");
      window.location.reload();
    } catch (err) {
      console.error("Error verifying seller", err);
    }
  };

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="seller-report">
      <h2>Seller Report</h2>
      {report && (
        <div className="report-content">
          <div className="seller-info">
            <h3>Seller Information</h3>
            <p>Name: {report.name}</p>
            <p>Email: {report.email}</p>
            <p>Status: {report.verified ? "Verified" : "Unverified"}</p>
            <button onClick={() => handleVerification(report._id)}>
              {report.verified ? "Unverify" : "Verify"} Seller
            </button>
          </div>
          <div className="sales-info">
            <h3>Sales Information</h3>
            <p>Total Sales: Rs {report.totalSales}</p>
            <p>Total Products: {report.totalProducts}</p>
            <p>Products Sold: {report.productsSold}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerReport;
