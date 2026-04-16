import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import ServicesPage from "./pages/ServicesPage";
import EventsPage from "./pages/EventsPage";
import ContactPage from "./pages/ContactPage";
import CartPage from "./pages/CartPage";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import { CartProvider } from "./context/CartContext";
import CheckoutPage from "./pages/CheckoutPage";
import SuccessPage from "./pages/SuccessPage";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
      <BrowserRouter>
        <Routes>

          {/* Public */}
          <Route path="/" element={<ServicesPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/success" element={<SuccessPage />} />

          {/* Protected */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <h1>Admin Dashboard</h1>
              </AdminRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />

        </Routes>
      </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;