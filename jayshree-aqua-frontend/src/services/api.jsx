import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// 🔁 Prevent multiple refresh calls
let isRefreshing = false;
let failedQueue = [];

// Process queue
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// 🔐 Attach access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔥 AUTO REFRESH LOGIC
api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
  // (response) => response,
  // async (error) => {
  //   const originalRequest = error.config;

  //   // If 401 & not retried already
  //   if (error.response?.status === 401 && !originalRequest._retry) {

  //     if (isRefreshing) {
  //       return new Promise((resolve, reject) => {
  //         failedQueue.push({ resolve, reject });
  //       }).then((token) => {
  //         originalRequest.headers.Authorization = "Bearer " + token;
  //         return api(originalRequest);
  //       });
  //     }

  //     originalRequest._retry = true;
  //     isRefreshing = true;

  //     const refreshToken = localStorage.getItem("refreshToken");

  //     if (!refreshToken) {
  //       logoutUser();
  //       return Promise.reject(error);
  //     }

  //     try {
  //       const res = await axios.post(`${BASE_URL}/auth/refresh`, {
  //         refreshToken,
  //       });

  //       const newToken = res.data.data.accessToken;

  //       // ✅ Save new token
  //       localStorage.setItem("token", newToken);

  //       // Update header
  //       api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

  //       processQueue(null, newToken);

  //       // Retry original request
  //       originalRequest.headers.Authorization = "Bearer " + newToken;
  //       return api(originalRequest);

  //     } catch (err) {
  //       processQueue(err, null);
  //       logoutUser();
  //       return Promise.reject(err);
  //     } finally {
  //       isRefreshing = false;
  //     }
  //   }

  //   return Promise.reject(error);
  // }
);

// 🔴 Logout helper
function logoutUser() {
  // localStorage.removeItem("token");
  // localStorage.removeItem("refreshToken");
  // localStorage.removeItem("user");
  // window.location.href = "/";
  console.warn("Logout skipped (temp fix)");
}

// APIs
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
};

export const productAPI = {
  getAll: () => api.get("/products"),
};

export default api;