import { useEffect, useState } from "react";
import { orderAPI } from "../services/api";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await orderAPI.getMyOrders();
      console.log("API RESPONSE:", res.data);

      setOrders(res.data.data || []);
    } catch (err) {
      console.error("FETCH ORDERS ERROR:", err);
    }
  };

  const toggleDetails = (orderId) => {
    setExpandedOrderId(prev => (prev === orderId ? null : orderId));
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>📦 My Orders</h1>

      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        orders.map((order) => (
          <div
            key={order.orderId}
            style={{
              border: "1px solid #ddd",
              padding: 20,
              marginBottom: 20,
              borderRadius: 10
            }}
          >
            {/* HEADER */}
            <h3>Order #{order.orderId}</h3>
            <p>Status: {order.status}</p>
            <p>Total: ₹{order.totalAmount}</p>

            {/* BUTTON */}
            <button
              onClick={() => toggleDetails(order.orderId)}
              style={{
                marginTop: 10,
                padding: "6px 12px",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
                background: "#2563eb",
                color: "#fff"
              }}
            >
              {expandedOrderId === order.orderId
                ? "Hide Details"
                : "View Details"}
            </button>

            {/* ITEMS */}
            {expandedOrderId === order.orderId && (
              <div style={{ marginTop: 15 }}>
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "8px 0",
                        borderBottom: "1px solid #eee"
                      }}
                    >
                      {/* ✅ PRODUCT NAME FIX */}
                      <span>
                        {item.productName || "No Name"}
                      </span>

                      {/* ✅ PRICE FIX */}
                      <span>
                        {item.quantity} × ₹{item.price || 0}
                      </span>
                    </div>
                  ))
                ) : (
                  <p>No items found</p>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}