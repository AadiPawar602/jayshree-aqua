import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate(); // ✅ FIX

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/admin/all");
      setOrders(res.data.data);
    } catch (err) {
      console.error("ADMIN FETCH ERROR:", err);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, status, {
        headers: { "Content-Type": "text/plain" }
      });
      fetchOrders();
    } catch (err) {
      console.error("UPDATE ERROR:", err);
    }
  };

  if (!orders.length) {
    return <p style={{ padding: 40 }}>Loading orders...</p>;
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>🔥 Admin Orders</h1>

      {/* 🔥 Navigation Buttons */}
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => navigate("/admin")}>Orders</button>
        <button onClick={() => navigate("/admin/products")}>
          Products
        </button>
      </div>

      {orders.map(order => (
        <div key={order.orderId} style={{
          border: "1px solid #ddd",
          padding: 15,
          marginBottom: 15,
          borderRadius: 10
        }}>
          <h3>Order #{order.orderId}</h3>
          <p>Status: <b>{order.status}</b></p>
          <p>Total: ₹{order.totalAmount}</p>

          <select
            onChange={(e) => updateStatus(order.orderId, e.target.value)}
            defaultValue=""
          >
            <option value="" disabled>Update Status</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
            <option value="DELIVERED">DELIVERED</option>
          </select>
        </div>
      ))}
    </div>
  );
}