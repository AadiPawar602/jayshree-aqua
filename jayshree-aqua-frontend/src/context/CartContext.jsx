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

  // 🔹 Add to cart
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        return prev.map(p =>
          p.id === product.id
            ? { ...p, qty: p.qty + 1 }
            : p
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  // 🔹 Remove
  const removeFromCart = (id) => {
    setCart(prev => prev.filter(p => p.id !== id));
  };

  // 🔹 Clear
  const clearCart = () => setCart([]);

  const increaseQty = (id) => {
  setCart(prev =>
    prev.map(item =>
      item.id === id ? { ...item, qty: item.qty + 1 } : item
    )
  );
};

const decreaseQty = (id) => {
  setCart(prev =>
    prev.map(item =>
      item.id === id
        ? { ...item, qty: item.qty > 1 ? item.qty - 1 : 1 }
        : item
    )
  );
};

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, increaseQty, decreaseQty }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);