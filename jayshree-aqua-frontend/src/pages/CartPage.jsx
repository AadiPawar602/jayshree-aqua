import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";


export default function CartPage() {
  const {
    cart,
    removeFromCart,
    increaseQty,
    decreaseQty
  } = useCart();

  const navigate = useNavigate();

  // 💰 Total
  const total = cart.reduce((sum, item) => {
    return sum + item.pricePerUnit * item.qty;
  }, 0);

  return (
    <div style={{ padding: 40 }}>
      <h1>🛒 Your Cart</h1>

      {cart.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <>
          {cart.map(item => (
            <div
              key={item.productId}
              style={{
                border: "1px solid #ddd",
                padding: 15,
                marginBottom: 10,
                borderRadius: 10
              }}
            >
              <h3>{item.name}</h3>

              <p>Price: ₹{item.pricePerUnit}</p>

              {/* 🔥 Quantity Controls */}
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <button onClick={() => decreaseQty(item.productId)}>➖</button>
                <span>{item.qty}</span>
                <button onClick={() => increaseQty(item.productId)}>➕</button>
              </div>

              <p>Subtotal: ₹{item.pricePerUnit * item.qty}</p>

              <button onClick={() => removeFromCart(item.productId)}>
                ❌ Remove
              </button>
            </div>
          ))}

          {/* 💰 TOTAL */}
          <h2>Total: ₹{total}</h2>

          {/* 🔥 Checkout */}
          <button onClick={() => navigate("/checkout")}>
            Proceed to Checkout 🚀
          </button>
        </>
      )}
    </div>
  );
}