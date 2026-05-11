import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function AdminProductsPage() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [uploading, setUploading] = useState(false);

  const emptyForm = {
    name: "",
    category: "WATER",
    waterType: "FILTERED",
    bottleSize: "L_1",
    pricePerUnit: "",
    imageUrl: ""
  };

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data.data || []);
    } catch (err) {
      console.error("FETCH ERROR", err);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // 🔥 IMAGE UPLOAD
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);

      const res = await api.post("/images/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      const imageUrl = res.data.data;

      if (!imageUrl) throw new Error("Upload failed");

      setForm(prev => ({
        ...prev,
        imageUrl
      }));

    } catch (err) {
      console.error("UPLOAD ERROR", err);
      alert("❌ Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  // 🔥 SUBMIT (CATEGORY LOGIC)
  const handleSubmit = async () => {
    if (!form.name || !form.pricePerUnit) {
      alert("Name and Price required");
      return;
    }

    if (uploading) {
      alert("Wait for image upload...");
      return;
    }

    try {
      const payload = {
        name: form.name,
        category: form.category,
        pricePerUnit: Number(form.pricePerUnit),
        imageUrl: form.imageUrl
      };

      if (form.category === "WATER") {
        payload.waterType = form.waterType;
        payload.bottleSize = form.bottleSize;
      }

      if (form.category === "JAR") {
        payload.bottleSize = form.bottleSize;
      }

      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
      } else {
        await api.post("/products", payload);
      }

      setForm(emptyForm);
      setEditingId(null);
      fetchProducts();

    } catch (err) {
      console.error("SAVE ERROR", err);
      alert("❌ Save failed");
    }
  };

  // 🔥 FIXED EDIT
  const handleEdit = (p) => {
    setForm({
      name: p.name,
      category: p.category || "WATER",
      waterType: p.waterType || "FILTERED",
      bottleSize: p.bottleSize || "L_1",
      pricePerUnit: p.pricePerUnit,
      imageUrl: p.imageUrl || ""
    });
    setEditingId(p.productId);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error("DELETE ERROR", err);
    }
  };

  const formatSize = (size) => {
    return {
      ML_500: "500ml",
      L_1: "1L",
      L_2: "2L",
      L_5: "5L",
      L_10: "10L",
      L_30: "30L"
    }[size] || size;
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>🛠 Admin Products</h1>

      {/* NAV */}
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => navigate("/admin")}>Orders</button>
        <button onClick={() => navigate("/admin/products")}>Products</button>
      </div>

      {/* FORM */}
      <div style={{ marginBottom: 30 }}>

        <input
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
        />

        {/* CATEGORY */}
        <select name="category" value={form.category} onChange={handleChange}>
          <option value="WATER">Water</option>
          <option value="JAR">Jar</option>
          <option value="ACCESSORY">Accessory</option>
        </select>

        {/* WATER TYPE */}
        {form.category === "WATER" && (
          <select name="waterType" value={form.waterType} onChange={handleChange}>
            <option value="FILTERED">FILTERED</option>
            <option value="COLD_FILTERED">COLD_FILTERED</option>
          </select>
        )}

        {/* SIZE */}
        {form.category !== "ACCESSORY" && (
          <select name="bottleSize" value={form.bottleSize} onChange={handleChange}>
            <option value="ML_500">500ml</option>
            <option value="L_1">1L</option>
            <option value="L_2">2L</option>
            <option value="L_5">5L</option>
            <option value="L_10">10L</option>
            <option value="L_30">30L</option>
          </select>
        )}

        <input
          name="pricePerUnit"
          type="number"
          placeholder="Price"
          value={form.pricePerUnit}
          onChange={handleChange}
        />

        {/* IMAGE */}
        <input type="file" onChange={handleImageUpload} />

        {uploading && <p>Uploading image...</p>}

        {form.imageUrl && (
          <img
            src={form.imageUrl}
            alt="preview"
            style={{ width: 120, marginTop: 10 }}
          />
        )}

        <button onClick={handleSubmit} disabled={uploading}>
          {editingId ? "Update Product" : "Add Product"}
        </button>

        {editingId && (
          <button onClick={() => {
            setEditingId(null);
            setForm(emptyForm);
          }}>
            Cancel
          </button>
        )}
      </div>

      {/* LIST */}
      {products.map(p => (
        <div key={p.productId} style={{
          border: "1px solid #ccc",
          padding: 15,
          marginBottom: 10,
          display: "flex",
          gap: 15
        }}>

          {p.imageUrl && (
            <img src={p.imageUrl} alt={p.name} style={{ width: 80 }} />
          )}

          <div style={{ flex: 1 }}>
            <h3>{p.name}</h3>

            <p>
              {p.category === "WATER" && `${formatSize(p.bottleSize)} • ${p.waterType}`}
              {p.category === "JAR" && `${formatSize(p.bottleSize)} Jar`}
              {p.category === "ACCESSORY" && "Accessory"}
            </p>

            <p>₹{p.pricePerUnit}</p>
          </div>

          <button onClick={() => handleEdit(p)}>Edit</button>
          <button onClick={() => handleDelete(p.productId)}>Delete</button>
        </div>
      ))}
    </div>
  );
}