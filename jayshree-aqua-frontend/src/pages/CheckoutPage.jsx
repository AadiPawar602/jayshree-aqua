import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  console.log("CART DATA:", cart); 

    const handlePlaceOrder = async () => {
    try {
            const orderData = {
            items: cart.map(item => ({
                productId: item.productId || item.id,
                quantity: item.quantity || item.qty
            })),
            deliveryAddress: "Pune",
            deliveryDate: "2026-04-20",
            orderType: "ONE_TIME"
        };

        await api.post("/orders", orderData);

        clearCart();
        navigate("/success");

    } catch (err) {
        console.error("FULL ERROR:", err.response?.data || err);
        alert("Order failed ❌");
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
            <div key={item.id || item.productId }>
              <p>{item.name} × {item.qty || item.quantity }</p>
            </div>
          ))}

          <h2>Total: ₹{total}</h2>

            <button onClick={handlePlaceOrder}>
                Place Order
            </button>
        </>
      )}
    </div>
  );
}