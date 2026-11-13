import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api",
  headers: { Accept: "application/json" },
});
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
apiClient.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem("token")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return Promise.reject(error);
  },
);
export default {
  client: apiClient,
  register: (data) => apiClient.post("/register", data),
  login: (data) => apiClient.post("/login", data),
  logout: () => apiClient.post("/logout"),
  me: () => apiClient.get("/me"),
  updateProfile: (data) => apiClient.patch("/profile", data),
  changePassword: (data) => apiClient.post("/change-password", data),
  getDoctors: (params) => apiClient.get("/doctors", { params }),
  getDoctorProfile: () => apiClient.get("/doctor/profile"), // Eger bar bolsa
  updateDoctorProfile: (data) => apiClient.patch("/doctor/profile", data),
  getDoctorDetail: (id) => apiClient.get(`/doctors/${id}`),
  getDoctorSlots: (id, params) =>
    apiClient.get(`/doctors/${id}/slots`, { params }),
  getSpecializations: () => apiClient.get("/specializations"),
  getClinics: () => apiClient.get("/clinics"),
  createAppointment: (data) => apiClient.post("/appointments", data),
  getMyAppointments: (params) => apiClient.get("/my-appointments", { params }),
  cancelAppointment: (id, data = {}) =>
    apiClient.patch(`/appointments/${id}/cancel`, data),
  getNotifications: () => apiClient.get("/notifications"),
};
