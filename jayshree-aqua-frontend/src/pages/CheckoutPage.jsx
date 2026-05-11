import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { orderAPI } from "../services/api";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function CheckoutPage() {

  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const { token, loading } = useAuth();

  const [paying, setPaying] = useState(false);

  const total = cart.reduce(
    (sum, item) => sum + Number(item.pricePerUnit || 0) * item.qty,
    0
  );

  const getFutureDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  };

  const handlePayment = async () => {

    if (paying) return;
    if (cart.length === 0) return alert("Cart is empty");

    setPaying(true);

    try {
      const orderRes = await orderAPI.placeOrder({
        items: cart.map(item => ({
          productId: item.productId,
          quantity: item.qty
        })),
        deliveryAddress: "Pimpri-Chinchwad, Pune",
        deliveryDate: getFutureDate(),
        orderType: "ONE_TIME",
        paymentMethod: "ONLINE"
      });

      const order = orderRes.data.data;

      if (!order?.razorpayOrderId) {
        alert("Payment init failed");
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: Math.round(order.totalAmount * 100),
        currency: "INR",
        name: "Jayshree Aqua",
        description: "Order Payment",
        order_id: order.razorpayOrderId,

        prefill: {
          name: "Aditya Pawar",
          email: "test@razorpay.com",
          contact: "9999999999"
        },

        handler: async function (response) {
          try {
            await api.post("/payments/verify", response);

            alert("Payment successful ✅");
            clearCart();
            navigate("/success");

          } catch (err) {
            alert("Verification failed ❌");
          }
        },

        modal: {
          ondismiss: function () {
            alert("Payment cancelled ❌");
          }
        },

        theme: {
          color: "#0284c7"
        }
      };

      const rzp = new window.Razorpay(options);

      // 🔥 HANDLE FAILURE
      rzp.on("payment.failed", function () {
        alert("Payment failed ❌");
      });

      rzp.open();

    } catch (err) {
      console.error(err);
      alert("Payment failed ❌");

    } finally {
      setPaying(false);
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>🧾 Checkout</h1>

      {cart.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        <>
          {cart.map(item => (
            <div key={item.productId}>
              <p>{item.name} × {item.qty}</p>
            </div>
          ))}

          <h2>Total: ₹{total}</h2>

          <button onClick={handlePayment} disabled={loading || !token || paying}>
            {paying ? "Processing..." : "Pay Now"}
          </button>
        </>
      )}
    </div>
  );
}