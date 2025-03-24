import React, { useState, useEffect } from "react";
import api from "../api/axios";

const SellerOrder = () => {
  const [orders, setOrders] = useState([]);
  const [sellerId, setSellerId] = useState(""); // Assuming seller ID is fetched from auth or stored in localStorage
  const [userRole, setUserRole] = useState(""); // User role (seller/admin)
  const [statusUpdate, setStatusUpdate] = useState({ orderId: "", status: "" });

  useEffect(() => {
    // Fetch seller ID and role from localStorage or other auth mechanism
    const fetchUserDetails = () => {
      const id = localStorage.getItem("id"); // Fetch seller ID
      const role = localStorage.getItem("role"); // Fetch user role (seller/admin)
      setSellerId(id);
      setUserRole(role);
    };

    fetchUserDetails();
  }, []);

  // Fetch orders for the seller
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/api/orders/seller");
        // Filter orders where sellerId is present in the items array
        const filteredOrders = response.data.filter((order) =>
          order.items.some((item) => item.sellerId.toString() === sellerId)
        );
        setOrders(filteredOrders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    if (sellerId) {
      fetchOrders();
    }
  }, [sellerId]);

  // Handle status change
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/api/orders/${orderId}/status`, { status: newStatus });
      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      alert("Order status updated successfully");
    } catch (error) {
      console.error("Failed to update order status:", error);
      alert("Failed to update order status. Please try again later.");
    }
  };

  return (
    <div className="seller-orders__container">
      <h2 className="heading-text">Seller Orders</h2>
      <div className="seller-orders__container__content">
        {orders.length === 0 ? (
          <p>No orders found for you.</p>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="order-item">
              <div className="order-details">
                <p>Order ID: {order._id}</p>
                <p>Status: {order.status}</p>
                <p>Total Amount: Rs {order.totalAmount}</p>
                <p>Shipping Address: {order.shippingAddress}</p>
                <p>Mobile Number: {order.mobileNumber}</p>
                <p>Buyer Name: {order.buyerName}</p>
              </div>
              <div className="order-items">
                <h3>Items:</h3>
                {order.items
                  .filter((item) => item.sellerId.toString() === sellerId)
                  .map((item, index) => (
                    <div key={index} className="item-details">
                      <p>Product: {item.productName}</p>
                      <p>Quantity: {item.quantity}</p>
                      <p>Price: Rs {item.price}</p>
                    </div>
                  ))}
              </div>
              <div className="order-actions">
                <select
                  value={order.status}
                  onChange={(e) =>
                    handleStatusChange(order._id, e.target.value)
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SellerOrder;
