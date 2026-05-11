import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // 🔹 Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  // 🔹 Save to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // 🔹 Add to cart (CONSISTENT STRUCTURE)
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find(p => p.productId === product.productId);

      if (existing) {
        return prev.map(p =>
          p.productId === product.productId
            ? { ...p, qty: p.qty + 1 }
            : p
        );
      }

      return [
        ...prev,
        {
          productId: product.productId,
          name: product.name,
          pricePerUnit: product.pricePerUnit, // ✅ FIXED (IMPORTANT)
          qty: 1
        }
      ];
    });
  };

  // 🔹 Remove
  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(p => p.productId !== productId));
  };

  // 🔹 Clear
  const clearCart = () => setCart([]);

  // 🔹 Increase
  const increaseQty = (productId) => {
    setCart(prev =>
      prev.map(item =>
        item.productId === productId
          ? { ...item, qty: item.qty + 1 }
          : item
      )
    );
  };

  // 🔹 Decrease
  const decreaseQty = (productId) => {
    setCart(prev =>
      prev.map(item =>
        item.productId === productId
          ? { ...item, qty: item.qty > 1 ? item.qty - 1 : 1 }
          : item
      )
    );
  };

  // 🔥 TOTAL CALCULATION (NEW - IMPORTANT)
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.pricePerUnit * item.qty,
    0
  );

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        increaseQty,
        decreaseQty,
        cartTotal,   // ✅ NEW
        cartCount    // ✅ NEW
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);