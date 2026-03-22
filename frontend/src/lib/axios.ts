import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api/",
  withCredentials: true,
});

// // Response interceptor to handle token expiration
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // Don't redirect if it's the checkAuth endpoint (initial auth check)
//       const isCheckAuth = error.config?.url?.includes("/auth/checkAuth");
//       if (!isCheckAuth && window.location.pathname !== "/login") {
//         window.location.href = "/login";
//       }
//     }
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
