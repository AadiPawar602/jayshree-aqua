import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { productAPI } from "../services/api";
import Navbar from "../components/Navbar";

export default function Dashboard({ onGoToLanding, onNavigate }) {
  const { user } = useAuth();
  const { cart, addToCart, cartCount, cartTotal } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [toast, setToast] = useState("");

  useEffect(() => {
    productAPI.getAll()
      .then(r => {
        setProducts(Array.isArray(r.data?.data) ? r.data.data : []);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const handleAddToCart = (p) => {
    addToCart(p);
    showToast("Added " + p.name + " 🛒");
  };

  // ✅ FILTERING FIXED
  const filtered =
    activeTab === "cold"
      ? products.filter(p => p.waterType === "COLD_FILTERED")
      : activeTab === "filtered"
      ? products.filter(p => p.waterType === "FILTERED")
      : activeTab === "accessory"
      ? products.filter(p => !p.bottleSize) // accessories = no size
      : products;

  const handleNav = (page) => {
    if (page === "landing") {
      onGoToLanding();
      return;
    }
    if (["dashboard", "orders", "subscriptions", "profile"].includes(page)) {
      setActiveTab(page);
      return;
    }
    if (onNavigate) onNavigate(page);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f0f9ff" }}>
      <Navbar currentPage={activeTab === "home" ? "dashboard" : activeTab} onNavigate={handleNav} />

      {/* TOAST */}
      {toast && (
        <div style={{
          position: "fixed",
          top: 80,
          right: 24,
          zIndex: 9999,
          background: "#0c2340",
          color: "white",
          padding: "12px 22px",
          borderRadius: 50
        }}>
          {toast}
        </div>
      )}

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: 20 }}>
        <h2 style={{ color: "#0c2340" }}>Available Products</h2>

        {/* FILTER BUTTONS */}
        <div style={{
          marginBottom: 25,
          display: "flex",
          gap: 10,
          flexWrap: "wrap"
        }}>
          {["home", "filtered", "cold", "accessory"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "10px 18px",
                borderRadius: 25,
                border: "none",
                cursor: "pointer",
                fontWeight: 500,
                background: activeTab === tab ? "#0284c7" : "#e5e7eb",
                color: activeTab === tab ? "white" : "#111"
              }}
            >
              {tab === "home" && "All"}
              {tab === "filtered" && "Filtered"}
              {tab === "cold" && "Cold"}
              {tab === "accessory" && "Accessories"}
            </button>
          ))}
        </div>

        {/* PRODUCTS */}
        {activeTab !== "cart" && (
          <ProductGrid
            products={filtered}
            loading={loading}
            onAdd={handleAddToCart}
          />
        )}

        {/* CART */}
        {activeTab === "cart" && (
          <div>
            <h2>🛒 Your Cart</h2>

            {cart.length === 0 ? (
              <p>Cart is empty</p>
            ) : (
              <>
                {cart.map(item => (
                  <div key={item.productId} style={{ marginBottom: 10 }}>
                    <b>{item.name}</b> × {item.qty}
                    <div>₹{item.pricePerUnit * item.qty}</div> {/* ✅ FIX */}
                  </div>
                ))}
                <h3>Total: ₹{cartTotal}</h3>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= GRID ================= */

function ProductGrid({ products, loading, onAdd }) {
  if (loading) return <p>Loading...</p>;
  if (!products.length) return <p>No products available</p>;

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
      gap: 25
    }}>
      {products.map(p => (
        <ProductCard key={p.productId} product={p} onAdd={onAdd} />
      ))}
    </div>
  );
}

/* ================= CARD ================= */

function ProductCard({ product: p, onAdd }) {

  // ✅ LABEL FIX (no category dependency)
  const getLabel = () => {
    if (p.bottleSize) {
      return `${p.sizeLabel || p.bottleSize} • ${p.waterType}`;
    }
    return "Accessory";
  };

  return (
    <div style={{
      background: "white",
      borderRadius: 16,
      padding: 20,
      boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
      transition: "0.3s"
    }}
    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-5px)"}
    onMouseLeave={e => e.currentTarget.style.transform = "translateY(0px)"}
    >

      {/* IMAGE */}
      <div style={{
        height: 180,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 15
      }}>
        <img
          src={p.imageUrl || "https://via.placeholder.com/150"}
          alt={p.name}
          style={{
            maxHeight: "100%",
            maxWidth: "100%",
            objectFit: "contain"
          }}
        />
      </div>

      {/* NAME */}
      <h3 style={{
        margin: "10px 0 5px",
        color: "#0c2340"
      }}>
        {p.name}
      </h3>

      {/* LABEL */}
      <p style={{
        fontSize: 13,
        color: "#6b7280"
      }}>
        {getLabel()}
      </p>

      {/* PRICE */}
      <h2 style={{ color: "#0284c7" }}>
        ₹{p.pricePerUnit}
      </h2>

      {/* BUTTON */}
      <button
        onClick={() => onAdd(p)}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: 10,
          background: "linear-gradient(135deg, #0284c7, #0369a1)",
          color: "white",
          border: "none",
          fontWeight: 600,
          cursor: "pointer"
        }}
      >
        + Add to Cart
      </button>
    </div>
  );
}