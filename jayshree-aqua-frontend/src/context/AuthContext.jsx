import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authAPI } from "../services/api";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Restore session
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      api.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
    }


    setLoading(false);
  }, []);

// 🔹 REGISTER
const register = useCallback(async (formData) => {
  try {
    const res = await authAPI.register(formData);
    const data = res.data.data;

    const accessToken = data.accessToken;
    const refreshToken = data.refreshToken;

    const userData = {
      id: data.userId,
      email: data.email,
      fullName: data.fullName,
      role: data.role,
    };

    // ✅ SAVE
    localStorage.setItem("token", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(userData));

    // 🔥 CRITICAL FIX (for first request issue)
    api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

    setToken(accessToken);
    setUser(userData);

    return userData;

  } catch (err) {
    console.error("REGISTER FAILED:", err.response?.data || err);
    throw err;
  }
}, []);


// 🔹 LOGIN
const login = useCallback(async (formData) => {
  try {
    const res = await authAPI.login(formData);
    const data = res.data.data;

    const accessToken = data.accessToken;
    const refreshToken = data.refreshToken;

    const userData = {
      id: data.userId,
      email: data.email,
      fullName: data.fullName,
      role: data.role,
    };

    // ✅ SAVE
    localStorage.setItem("token", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(userData));

    // 🔥 CRITICAL FIX (THIS SOLVES YOUR BUG)
    api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

    setToken(accessToken);
    setUser(userData);

    return userData;

  } catch (err) {
    console.error("LOGIN FAILED:", err.response?.data || err);
    throw err;
  }
}, []);

  // 🔹 LOGOUT
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token,
        isAdmin: user?.role === "ADMIN",
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// 🔹 Hook
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}